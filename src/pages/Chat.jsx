import { useState, useEffect } from 'react'
import io from'socket.io-client'
import ChatRoom from '../components/ChatRoom'

const socket = io('http://localhost:9987')

function Chat() {

  const [room, setRoom] = useState({ roomName: "", password: "", joined: false})

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

  useEffect(() => {
    // Handler for when a room is created
    const handleRoomCreated = (roomName) => {
      setRoom({...room, joined: true, roomName});
    };

    // Handler for when a room is joined
    const handleRoomJoined = (roomName) => {
      setRoom({...room, joined: true, roomName});
    };
    
    socket.on('room_created', handleRoomCreated);
    socket.on('room_joined', handleRoomJoined);
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
        <ChatRoom socket={socket} room={room} />
      )
    }
      
    </div>
  )
}

export default Chat