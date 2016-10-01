const fs = require('fs')
const path = require('path')
let staticFolder = ''

module.exports = {
  staticProvider: staticProvider,
  staticFolder: placeStaticFolder
}

function placeStaticFolder (fullPath) {
  if (staticFolder) {
    throw new Error('Static folder already defined')
  }
  fullPath = path.normalize(fullPath)
  staticFolder = fullPath
}

function staticProvider (req, res, location) {
  let extention = location.split('.')[1]
  let allowedExtentions = ['jpg', 'css', 'html', 'js', 'png']
  let contentTypes = {
    'jpg': 'image/jpeg',
    'css': 'text/css',
    'html': 'text/html',
    'js': 'application/javascript',
    'png': 'image/png'
  }
  if (allowedExtentions.indexOf(extention) === -1) {
    res.writeHead(403)
    res.write('Unsupported request')
    res.end()
    return
  }
  let fullPath = path.normalize(staticFolder + '/' + location)
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404)
      res.write('Resourse not found')
      res.end()
    } else {
      res.writeHead(200, {
        'Content-Type': contentTypes[extention]
      })
      res.write(data)
      res.end()
    }
  })
}
