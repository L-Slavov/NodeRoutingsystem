const staticProvider = require('../defaultRoutes/static.js').staticProvider
let getRoutes = {}

module.exports = {
  getRouter: getRouter,
  get: get
}

function get (route, controller) {
  if (route.match(/\/:\w+/)) {
    let routeSplit = route.split('/')
    let parameters = {}
    routeSplit.forEach((element, index) => {
      if (element.match(/:\w+/)) {
        parameters[element.match(/\w+/)] = index
      }
    })

    let temp = route.replace(/:\w+/g, '\\w+')
    let pattern = new RegExp('^' + temp + '$')

    getRoutes[route] = {'pattern': pattern, 'controller': controller, 'parameters': parameters}
  } else {
    let pattern = new RegExp('^' + route + '$')
    getRoutes[route] = {'pattern': pattern, 'controller': controller, 'parameters': false}
  }
}

function getRouter (req, res, location) {
  for (let route in getRoutes) {
    if (location.match(getRoutes[route].pattern)) {
      if (getRoutes[route].parameters) {
        req.params = {}
        let locationSplit = location.split('/')
        for (let parameter in getRoutes[route].parameters) {
          req.params[parameter] = locationSplit[getRoutes[route].parameters[parameter]]
        }
        getRoutes[route].controller(req, res)
        return
      } else {
        getRoutes[route].controller(req, res)
        return
      }
    }
  }
  staticProvider(req, res, location)
}
