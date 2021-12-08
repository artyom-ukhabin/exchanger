import React from "react"
import PropTypes from "prop-types"

class Show extends React.Component {
  static propTypes = {
    originalSum: PropTypes.number,
    exchangedSum: PropTypes.number,
    destination: PropTypes.string,
    networkFee: PropTypes.number,
    exchangedFee: PropTypes.number,
    txId: PropTypes.string
  }

  render () {
    return (
      <React.Fragment>
        Original Sum: {this.props.originalSum}
        Exchanged Sum: {this.props.exchangedSum}
        Destination: {this.props.destination}
        Network Fee: {this.props.networkFee}
        Exchanged Fee: {this.props.exchangedFee}
        Tx: {this.props.txId}
      </React.Fragment>
    );
  }
}

export default Show
