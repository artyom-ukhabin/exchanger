const unprocessableEntity = 422

const getCSRFToken = () => document.querySelector("meta[name=csrf-token]").content

const apiRequestParams = (method, body) => {
  return(
    {
      method: method,
      headers: {
        "X-CSRF-Token": getCSRFToken(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    }
  )
}

const apiFetch = options => {
  return(
    fetch(options.url, apiRequestParams(options.method, options.body))
    .then(res => {
      if (res.ok || res.status === unprocessableEntity) {
        return res.json()
      } else {
        throw res
      }
    })
  )
}

const roundNumber = (number, precision) => {
  return(number.toFixed((precision)))
}

export { apiFetch, roundNumber }
