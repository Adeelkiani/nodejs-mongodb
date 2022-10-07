const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const tradeRouter = require('./routers/trade')

const app = express()

//Automatically parse incoming JSON
app.use(express.json())

//Registering routes
app.use(userRouter)
app.use(tradeRouter)

module.exports = app