import express from 'express'
import ViteExpress from 'vite-express'
import morgan from 'morgan'
import session from 'express-session'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'


const app = express()

import dotenv from "dotenv";
dotenv.config();

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const sessionMiddleware = session({
  secret: process.env.VITE_EXPRESS_SESSION_SECRET,
  saveUninitialized: false,
  resave: false
})

app.use(sessionMiddleware);

app.use(express.static("src"));

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:9987",
    credentials: true
  }
})

io.engine.use(sessionMiddleware)

ViteExpress.config({ printViteDevServerHost: true})

io.on('connection', (socket) => {
  console.log('a user connected, socket id:', socket.id)

  socket.on('join_room', (data) => {
    console.log(data)
    socket.join(data.room)
  })

  socket.on('send_message', (data) => {
    console.log(data)
    io.to(data.room).emit('new_message', data)
  })
})

io.engine.on('connection_error', (err) => {
  console.log(err)
})

httpServer.listen(9987, () => console.log('Chat here - http://localhost:9987'))

ViteExpress.bind(app, httpServer)