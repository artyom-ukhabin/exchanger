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
    event.preventDefault()

    this.setState({errors: {}})

    const snakeizedInputs = _.mapKeys(this.state.inputs, (value, key) => (_.snakeCase(key)))
    const requestOptions = {
      url: this.props.createUrl,
      method: "POST",
      body: {transaction: snakeizedInputs},
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
                  <FormControl.Feedback type="invalid">
                    {errors.originalSum}
                  </FormControl.Feedback>
                </InputGroup>

                <InputGroup>
                  <FormControl
                    name="destination"
                    placeholder="Destination address"
                    onChange={this.handleChange}
                    value={inputs.destination}
                    isInvalid={!!errors.destination}
                  />
                  <FormControl.Feedback type="invalid">
                    {errors.destination}
                  </FormControl.Feedback>
                </InputGroup>

                <div className="text-end mb-3">
                  { `You get: ~${this.btcRounded(this.exchangedSum())} BTC`}
                </div>

                <InputGroup>
                  <FormControl
                    className="mb-3"
                    name="email"
                    placeholder="Your email"
                    onChange={this.handleChange}
                    value={inputs.email}
                    isInvalid={!!errors.email}
                  />
                  <FormControl.Feedback type="invalid">
                    {errors.email}
                  </FormControl.Feedback>
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
                        isInvalid={!!errors.email}
                      />
                    </InputGroup>
                    <FormControl.Feedback type="invalid">
                      {errors.termsChecked}
                    </FormControl.Feedback>
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
