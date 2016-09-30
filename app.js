const url = require('url')
let getRoutes = {}
let postRoutes = {}

module.exports = {
  server: server,
  get: get,
  post: post
}

function server (req, res) {
  let location = url.parse(decodeURI(req.url)).path
  if (req.method === 'GET') {
    getParser(req, res, location)
  }

  if (req.method === 'POST') {
    postParser(req, res, location)
  }
}

function getParser (req, res, location) {
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
  res.writeHead(404)
  res.end('The page or resource not found')
}

function postParser (req, res, location) {
  if (!(location in postRoutes)) {
    res.writeHead(404)
    res.end('Page or resource not found')
    return
  }

  let request = ''
  req.body = {}
  req.on('data', (chunk) => {
    request += chunk
  })
  req.on('end', () => {
    let temp = request.split('&')
    for (let item of temp) {
      let itemValues = item.split('=')
      if ((itemValues[0] === '' || itemValues[1] === '') || (itemValues[0] === 'null' || itemValues[1] === 'null')) {
        res.writeHead(400)
        res.end('Please enter values in both fields')
      }
      req.body[itemValues[0]] = itemValues[1]
    }
    postRoutes[location].controller(req, res)
  })
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

function post (route, controller) {
  postRoutes[route] = controller
}
