import React from "react"
import PropTypes from "prop-types"
import {
  Row,
  Col,
  Card,
  Form as ReactForm,
  FormControl,
  InputGroup,
  Button,
  ListGroup,
  Container,
  Spinner,
} from "react-bootstrap"
import _ from "lodash"
import { apiFetch, roundNumber } from "../../Utils"

class Form extends React.Component {
  static propTypes = {
    networkFee: PropTypes.string,
    exchangeFeePercent: PropTypes.number,
    exchangeRateApiUrl: PropTypes.string,
    createUrl: PropTypes.string,
  }

  state = {
    inputs: {
      email: "",
      originalSum: 0,
      destination: "",
      termsChecked: false,
    },
    errors: {},
    exchangedSum: 0,
    exchangeFee: 0,
    rate: null,
  }

  componentDidMount() {
    this.fetchActualRate()
    this.timer = setInterval(() => { this.fetchActualRate() }, 10000)
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  rate = () => {
    const { rate } = this.state
    return(rate ? rate : <Spinner animation="border" size="sm"/>)
  }

  // посмотреть все округления
  exchangedSum = () => {
    const { inputs, rate } = this.state
    const { networkFee } = this.props
    const sum = (inputs.originalSum / rate) - this.exchangeFee() - networkFee
    return(sum > 0 ? sum : 0)
  }

  // посмотреть все округления
  // Подумать об округлении, строке и сайнтифик нотации
  // С экспонентой в раунде NaN на маленькой сумме?
  // Может скачать либу
  exchangeFee = () => {
    const { inputs, rate } = this.state
    const { exchangeFeePercent } = this.props
    return((inputs.originalSum / rate) * exchangeFeePercent)
  }

  btcRounded = (number) => {
    return(roundNumber(number, 8))
  }

  handleChange = event => {
    const target = event.target
    const { name } = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    this.setState({ inputs: { ...this.state.inputs, [name]: value } }) // проверить
  }

  fetchActualRate = () => {
    const { exchangeRateApiUrl } = this.props

    fetch(exchangeRateApiUrl)
      .then(response => response.json())
      .then(data => this.setState({ rate: data.USDT }));
  }

  onSubmit = event => {
    const { inputs, exchangedSum, exchangedFee } = this.state
    const { createUrl } = this.props

    event.preventDefault()
    this.setState({errors: {}})

    const snakeizedInputs = _.mapKeys(inputs, (value, key) => (_.snakeCase(key)))
    const transactionParams = {
      ...snakeizedInputs,
      exchanged_sum: exchangedSum,
      exchanged_fee: exchangedFee,
    }

    const requestOptions = {
      url: createUrl,
      method: "POST",
      body: { transaction: transactionParams },
    }

    apiFetch(requestOptions)
      .then((data) => {
        if (data.showUrl) {
          window.location = data.showUrl
        } else {
          this.setState({ errors: data.errors })
        }
      }).catch(error => {
        console.error("error", error)
      })
  }

  showFieldErrors = errors => {
    return (
      errors.map(error => {
        return(
          <FormControl.Feedback type="invalid" key={error}>
            {error}
          </FormControl.Feedback>
        )
      })
    )
  }

  render () {
    const { inputs, errors } = this.state

    console.log(errors)

    return (
      <React.Fragment>
        <Container className="border mb-3">
          <Row className="mt-3 mb-3 ">
            <Col>
              <ReactForm onSubmit={this.onSubmit}>
                <InputGroup className="mb-1">
                  <FormControl
                    type="number"
                    name="originalSum"
                    placeholder="You pay"
                    onChange={this.handleChange}
                    value={inputs.originalSum}
                    isInvalid={!!errors.originalSum}
                  />
                  <InputGroup.Text>USDT</InputGroup.Text>
                  {errors.originalSum && this.showFieldErrors(errors.originalSum)}
                </InputGroup>

                <InputGroup>
                  <FormControl
                    name="destination"
                    placeholder="Destination address"
                    onChange={this.handleChange}
                    value={inputs.destination}
                    isInvalid={!!errors.destination}
                  />
                  {errors.destination && this.showFieldErrors(errors.destination)}
                </InputGroup>

                <div className="text-end mb-3">
                  { `You get: ~${this.btcRounded(this.exchangedSum())} BTC`}
                </div>

                <InputGroup className="mb-3">
                  <FormControl
                    name="email"
                    placeholder="Your email"
                    onChange={this.handleChange}
                    value={inputs.email}
                    isInvalid={!!errors.email}
                  />
                  {errors.email && this.showFieldErrors(errors.email)}
                </InputGroup>

                <Row>
                  <Col>
                    <InputGroup>
                      <ReactForm.Check
                        className="mt-2"
                        type="checkbox"
                        name="termsChecked"
                        label="I agree with the Terms and Conditions"
                        checked={inputs.termsChecked}
                        onChange={this.handleChange}
                        isInvalid={!!errors.termsChecked}
                      />
                    </InputGroup>
                    {errors.termsChecked && this.showFieldErrors(errors.termsChecked)}
                  </Col>
                  <Col>
                    <Button
                      className="float-end"
                      variant="success"
                      type="submit"
                    >
                      Submit
                    </Button>
                  </Col>
                </Row>
              </ReactForm>
            </Col>

            <Col>
              <Card className="mb-3">
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <span>Exchange rate: </span>
                    <span>{this.rate()}</span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {`Exchanged Fee: ${this.btcRounded(this.exchangeFee())} BTC`}
                  </ListGroup.Item>
                  <ListGroup.Item>{`Network Fee: ${this.props.networkFee} BTC`}</ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          { errors.general &&
            <Card body className="text-danger mb-3">{errors.general}</Card>
          }
        </Container>
      </React.Fragment>
    );
  }
}

export default Form
