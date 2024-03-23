import express from 'express'
import ViteExpress from 'vite-express'
import morgan from 'morgan'
import session from 'express-session'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'


const app = express()

// dotenv config for .env file retrieval
import dotenv from "dotenv";
dotenv.config();

// basic middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("src"));
app.use(cors());

// express-session middleware
const sessionMiddleware = session({
  secret: process.env.VITE_EXPRESS_SESSION_SECRET,
  saveUninitialized: false,
  resave: false
})
app.use(sessionMiddleware);

// create http server for sockets
const httpServer = http.createServer(app)
// Create socket.io server
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:9987",
    credentials: true
  }
})

io.engine.use(sessionMiddleware)

ViteExpress.config({ printViteDevServerHost: true})

const rooms = {}

io.on('connection', (socket) => {
  console.log('a user connected, socket id:', socket.id)

  socket.on('request_rooms', () => {
    io.emit('list_rooms', Object.entries(rooms))
  })

  socket.on('create_room', ({ roomName, password }) => {
    if (rooms[roomName]) {
      socket.emit('room_create_error', 'Room already exists.');
      return;
    }
    rooms[roomName] = password;
    socket.join(roomName);
    console.log("rooms: ", rooms)
    socket.emit('room_created', roomName);
    io.emit('list_rooms', Object.entries(rooms))
  });

  socket.on('join_room', ({ roomName, password }) => {
    if (!rooms[roomName]) {
      socket.emit('room_join_error', 'Room does not exist.');
      return;
    }
    if (rooms[roomName] !== password) {
      socket.emit('room_join_error', 'Incorrect password.');
      return;
    }
    socket.join(roomName);
    socket.emit('room_joined', roomName);
  });

  socket.on('send_message', (data) => {
    console.log(data)
    io.to(data.room.roomName).emit('new_message', data)
  })
})

io.engine.on('connection_error', (err) => {
  console.log(err)
})

import userHandlers from './controllers/userController.js'
const { register, login, logout, sessionCheck } = userHandlers

app.get('/api/session-check', sessionCheck)
app.post('/api/register', register)
app.post('/api/login', login)
app.post('/api/logout', logout)


httpServer.listen(9987, () => console.log('Chat here - http://localhost:9987'))

ViteExpress.bind(app, httpServer)