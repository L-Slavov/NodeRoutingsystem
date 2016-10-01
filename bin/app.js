const url = require('url')
const getRouter = require('./modules/get.js').getRouter
const postRouter = require('./modules/post.js').postRouter

module.exports = {
  server: server,
  get: require('./modules/get.js').get,
  post: require('./modules/post.js').post,
  staticFolder: require('./defaultRoutes/static.js').staticFolder
}

function server (req, res) {
  let location = url.parse(decodeURI(req.url)).path
  if (req.method === 'GET') {
    getRouter(req, res, location)
  }

  if (req.method === 'POST') {
    postRouter(req, res, location)
  }
}
