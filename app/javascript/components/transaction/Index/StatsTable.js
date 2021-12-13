import React from "react"
import PropTypes from "prop-types"
import {
  Table,
  Spinner,
} from "react-bootstrap"
import { apiFetch } from "../../Utils"

class StatsTable extends React.Component {
  static propTypes = {
    fetchUrl: PropTypes.string,
  }

  state = {
    data: {},
    loading: false,
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    const requestOptions = {
      url: this.props.fetchUrl,
      method: "GET",
    }

    this.setState({loading: true})

    apiFetch(requestOptions)
      .then((data) => {
        this.setState({ data, loading: false })
      })
      .catch(error => {
        this.setState({loading: false})
        console.error("error", error)
      })
  }

  render () {
    const { loading } = this.state

    if (loading) { return (<Spinner animation="border" size="sm"/>) }

    return (
      <React.Fragment>
        <Table>
          <thead>
            <tr>
              <th>Total exchange fee</th>
              <th>Total transactions</th>
              <th>Total success transactions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{`${this.state.data.exchangeFee} tBTC`}</td>
              <td>{this.state.data.count}</td>
              <td>{this.state.data.successCount}</td>
            </tr>
          </tbody>
        </Table>
      </React.Fragment>
    );
  }
}

export default StatsTable
