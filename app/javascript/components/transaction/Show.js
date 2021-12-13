import React from "react"
import PropTypes from "prop-types"
import {
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap"

class Show extends React.Component {
  static propTypes = {
    originalSum: PropTypes.number,
    exchangedSum: PropTypes.number,
    exchangeRate: PropTypes.number,
    destination: PropTypes.string,
    networkFee: PropTypes.number,
    exchangeFee: PropTypes.number,
    txId: PropTypes.string
  }

  render () {
    return (
      <React.Fragment>
        <Card bg="success" text="white" body className="text-center mb-3"> Success! </Card>
        <Container className="border mb-3">
          <Card bg="primary" text="white" className="mb-3 text-center">Your transaction:</Card>
          <div id="thId">
            <strong>Id: </strong>
            <span id="txId">{this.props.txId}</span>
          </div>
          <Row>
            <Col xs={7}>
              <strong>You sent: </strong>
              <span id="exchangedSum">{`${this.props.originalSum} USDT`}</span>
            </Col>
            <Col xs={5}>
              <strong>You received: </strong>
              <span id="originalSum">{`${this.props.exchangedSum} tBTC`}</span>
            </Col>
          </Row>
          <Row>
            <Col xs={7}>
              <strong>Your wallet address: </strong>
              <span id="destination">{this.props.destination}</span>
            </Col>
            <Col xs={5}>
              <strong>Exchanged rate: </strong>
              <span id="exchangeRate">{`1 tBTC = ${this.props.exchangeRate} USDT`}</span>
            </Col>
          </Row>
          <Row>
            <Col xs={7}>
              <strong>Exchange fee: </strong>
              <span id="exchangeFee">{`${this.props.exchangeFee} tBTC`}</span>
            </Col>
            <Col xs={5}>
              <strong>Network fee: </strong>
              <span id="networkFee">{`${this.props.networkFee} tBTC`}</span>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default Show
