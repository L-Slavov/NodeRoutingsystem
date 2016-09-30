const fs = require('fs')
module.exports = (req, res) => {
  fs.readFile('./public/index.html', (err, file) => {
    if (err) {
      res.writeHead(500)
      res.end()
    }
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(file)
  })
}
