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
import { apiFetch, roundNumber } from "../Utils"

const apiUrl = "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USDT"
const exchangeFeePercent = 0.03

class Form extends React.Component {
  static propTypes = {
    networkFee: PropTypes.number,
    createUrl: PropTypes.string,
  }

  state = {
    inputs: {
      email: "",
      originalSum: 0,
      destination: "",
      termsChecked: false,
    },
    errors: {
      email: null,
      originalSum: null,
      destination: null,
      termsChecked: null,
    },
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
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => this.setState({ rate: data.USDT }));
  }

  onSubmit = event => {
    event.preventDefault()

    const requestOptions = {
      url: this.props.createUrl,
      method: "POST",
      body: { transaction: this.state.inputs },
    }

    apiFetch(requestOptions)
      .then((data) => {
        if (data.showUrl) {
          window.location = data.showUrl
        } else {
          this.setState(data.errors)
        }
      }).catch(error => {
        console.error("error", error)
      })
  }

  // расставить ошибки - прочитать на реакт бутстрапе
  render () {
    const { inputs } = this.state
    const { createUrl } = this.props

    return (
      <React.Fragment>
        <Card body className="text-center mb-3"> Exchange your USDT </Card>
        <Container className="border mb-3">
          <Row>
            <Col>
              <ReactForm onSubmit={this.onSubmit}>
                <InputGroup className="mb-1">
                  <FormControl
                    type="number"
                    name="originalSum"
                    placeholder="You pay"
                    onChange={this.handleChange}
                    value={inputs.originalSum}
                  />
                  <InputGroup.Text>USDT</InputGroup.Text>
                </InputGroup>

                <FormControl
                  name="destination"
                  placeholder="Destination address"
                  onChange={this.handleChange}
                  value={inputs.destination}
                />
                <div className="text-end mb-3">
                  { `You get: ~${this.btcRounded(this.exchangedSum())} BTC`}
                </div>

                <FormControl
                  className="mb-3"
                  type="email"
                  name="email"
                  placeholder="Your email"
                  onChange={this.handleChange}
                  value={inputs.email}
                />

                <Row>
                  <Col>
                    <ReactForm.Check
                      className="mt-2"
                      type="checkbox"
                      name="termsChecked"
                      label="I agree with the Terms and Conditions"
                      checked={inputs.termsChecked}
                      onChange={this.handleChange}
                    />
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
        </Container>
      </React.Fragment>
    );
  }
}

export default Form
