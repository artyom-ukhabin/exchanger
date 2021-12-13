import React from "react"
import PropTypes from "prop-types"
import {
  Card, Container,
} from "react-bootstrap"
import StatsTable from "./StatsTable"
import TransactionsTable from "./TransactionsTable/index"

class Index extends React.Component {
  static propTypes = {
    statsUrl: PropTypes.string,
    allTransactionsUrl: PropTypes.string,
  }

  render () {
    return (
      <React.Fragment>
        <Card body bg="dark" text="white" className="text-center mb-3"> Transaction statistics </Card>
        <Container>
          <strong>Statistic</strong>
          <StatsTable fetchUrl={this.props.statsUrl} />
        </Container>
        <Container>
          <strong>All Transactions</strong>
          <TransactionsTable statsUrl={this.props.allTransactionsUrl} />
        </Container>
      </React.Fragment>
    )
  }
}

export default Index
