import React from "react"
import PropTypes from "prop-types"
import Form from "./Form"
import {
  Card,
  Container,
} from "react-bootstrap"

class New extends React.Component {
  static propTypes = {
    networkFee: PropTypes.string,
    exchangeFeePercent: PropTypes.number,
    walletBalance: PropTypes.string,
    exchangeRateApiUrl: PropTypes.string,
    createUrl: PropTypes.string,
  }

  render () {
    const { walletBalance } = this.props

    return (
      <React.Fragment>
        <Card body className="text-center mb-3"> Exchange your USDT </Card>
        <Container className="mb-3">
          <div className="mb-3">{`Exchanger balance: ${walletBalance} BTC`}</div>
          <Form
            networkFee={this.props.networkFee}
            exchangeFeePercent={this.props.exchangeFeePercent}
            exchangeRateApiUrl={this.props.exchangeRateApiUrl}
            createUrl={this.props.createUrl}
          />
        </Container>
      </React.Fragment>
    )
  }
}

export default New
