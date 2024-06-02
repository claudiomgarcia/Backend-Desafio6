import express from 'express'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import sessionsRouter from './routes/api/sessions.router.js'
import { create } from 'express-handlebars'
import customHelpers from './views/helpers/customHelpers.js'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import { __dirname } from './utils.js'
import socketProducts from './listener/socketProducts.js'
import socketChat from './listener/socketChat.js'
import connectDB from './config/db.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

const httpServer = app.listen(PORT, console.log(`Server running on: http://localhost:${PORT}`))

const socketServer = new Server(httpServer)

const handlebars = create({
    helpers: customHelpers
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.engine('handlebars', handlebars.engine)
app.set('views', __dirname + '/views')
app.set("view engine", "handlebars")

connectDB()

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        ttl: 100
    }),
    secret: "53cr37k3Y",
    resave: false,
    saveUninitialized: false
}))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/', viewsRouter)

socketProducts(socketServer)
socketChat(socketServer)