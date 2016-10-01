module.exports = {
  postRouter: postRouter,
  post: post
}

let postRoutes = {}

function postRouter (req, res, location) {
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



function post (route, controller) {
  postRoutes[route] = controller
}
