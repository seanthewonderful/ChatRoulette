import { useState, useEffect } from 'react'
import io from'socket.io-client'

const socket = io('http://localhost:9987')

function Chat() {

  const [room, setRoom] = useState({ roomName: "", password: "", joined: false})
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])

  const messageThread = messages.map((message, index) => {
    return (
      <div key={index}>
        <span>{message.username}: </span>
        <span>{message.message}</span>
      </div>
    )
  })

  const createRoom = async (e) => {
    e.preventDefault()
    console.log("allo")
    socket.emit('create_room', { 
      roomName: room.roomName, 
      password: room.password 
    })
  }

  const joinRoom = async (e) => {
    e.preventDefault()
    if (room.password !== "") {
      socket.emit('join_room', { roomName: room.roomName, password: room.password })
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    socket.emit('send_message', { message, room, username: 'User' })
    setMessage("")
  }

  useEffect(() => {
    // Handler for when a room is created
    const handleRoomCreated = (roomName) => {
      setRoom({...room, joined: true, roomName});
    };

    // Handler for when a room is joined
    const handleRoomJoined = (roomName) => {
      setRoom({...room, joined: true, roomName});
    };
    
    const handleNewMessage = (data) => {
      setMessages(prevMessages => [data, ...prevMessages]);
    };
    
    socket.on('room_created', handleRoomCreated);
    socket.on('room_joined', handleRoomJoined);
    socket.on('new_message', handleNewMessage);
  
    // Clean-up function
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [])

  return (
    <div>

      {!room.joined ? (
        <div id='join-room-container'>

          <form 
            id='create-room-form'
            onSubmit={createRoom}
            >
              <input
                type='text'
                name='room-name'
                placeholder='Room Name'
                value={room.roomName}
                onChange={e => setRoom({...room, roomName: e.target.value})}
              />
              <input 
                type='text'
                name='room-password'
                placeholder='Room Password'
                value={room.password}
                onChange={e => setRoom({...room, password: e.target.value})}
                />
              <input type="submit" value="Create Room" />
          </form>

          <form 
            id='join-room-form'
            onSubmit={joinRoom}
            >
              <input
                type='text'
                name='room-name'
                placeholder='Room Name'
                value={room.roomName}
                onChange={e => setRoom({...room, roomName: e.target.value})}
                />
              <input
                type="text"
                name="room"
                placeholder="Enter Room Code..."
                value={room.password}
                onChange={e => setRoom({ ...room, password: e.target.value})}
                />
              <input type="submit" value="Join Room" />
          </form>

        </div>
      ) : (
        <div id='chat-container'>

          <form 
            id='send-message-form'
            onSubmit={sendMessage}
            >
            <input 
              type="text" 
              name="message" 
              placeholder="Message..." 
              value={message}
              onChange={e => setMessage(e.target.value)}
              />
            <input type="submit" value="Send" />
          </form>

          <section id='thread'>
            <h4>Welcome to {room.roomName}</h4>
            {messageThread}
          </section>

        </div>
      )
    }
      
    </div>
  )
}

export default Chat