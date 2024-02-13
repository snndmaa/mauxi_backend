const express    = require('express')
const mongoose   = require('mongoose')
const morgan     = require('morgan')
const cors       = require('cors')
const http       = require('http')
const bodyParser = require('body-parser')
const WebSocket       = require('ws')

const middleware = require('./middleware')
const app        = express()
const server     = http.createServer(app)

const userWss    = new WebSocket.Server({ noServer: true })
const driverWss  = new WebSocket.Server({ noServer: true })

require('dotenv').config()

const port = process.env.PORT_NO
const dbString = process.env.DB_STRING
const baseURL = process.env.URL_BASE

const Driver = require('./driver_app/router')
const User = require('./user_app/router')

// app.use(bodyParser.json({ limit: '5mb' }))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(middleware.authHandle())

app.use('*', cors())

app.use(`${baseURL}/driver/auth`, Driver.AuthRoutes.router)
app.use(`${baseURL}/driver/`, Driver.DriverRoutes.router)
app.use(`${baseURL}/driver/profile`, Driver.ProfileRoutes.router)
app.use(`${baseURL}/driver/rating`, Driver.RatingRoutes.router)
app.use(`${baseURL}/driver/ride`, Driver.RideRoutes.router)

app.use(`${baseURL}/user/auth`, User.AuthRoutes.router)

app.use(middleware.errorHandle)

app.get('/', (req, res) => {
    res.send('Welcome to Mauxi. The Mauritian Taxi App')
})

server.on('upgrade', (request, socket, head) => {
  const pathname = request.url.split('/');

  if (pathname[2] === 'user') {
    userWss.handleUpgrade(request, socket, head, (ws) => {
      userWss.emit('connection', ws, request)
    })
  } else if (pathname[2] === 'driver') {
    driverWss.handleUpgrade(request, socket, head, (ws) => {
      driverWss.emit('connection', ws, request)
    })
  } else {
    socket.destroy()
  }
})

userWss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message)
    if (data.type === 'location' || data.type === 'request') {
      userWss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      })
    }

    

  })
  // ws.send(JSON.stringify({message: 'Connected!'}));
})

driverWss.on('connection', (ws) => {
  ws.on('message', (message) => {

  })
})

mongoose.connect(dbString)
.then(() => console.log('Database Connected!'))
.catch( (error) => console.log(error))

server.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`)
  });
  