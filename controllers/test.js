module.exports = (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.end(`The params are ${req.params.folder} and ${req.params.id}`)
}
