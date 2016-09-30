const http = require('http')

const app = require('./app.js')

let index = require('./controllers/index.js')
let test = require('./controllers/test.js')

app.get('/', index)
app.get('/test/:folder/:id', test)

http.createServer(app.server).listen(8000)

