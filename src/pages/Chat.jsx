import { useState, useEffect } from 'react'
import io from'socket.io-client'
import ChatRoom from '../components/ChatRoom'

const socket = io('http://localhost:9987')

function Chat() {

  const [room, setRoom] = useState({ roomName: "", password: "", joined: false})
  const [allRooms, setAllRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState("")

  console.log(allRooms)

  const roomList = allRooms.map((room, idx) => (
    <li key={idx}>
      {room[0]}, {room[1]}
    </li>
  ))

  const createRoom = async (e) => {
    e.preventDefault()
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
    // Request all rooms
    socket.emit('request_rooms')
    
    // Handler for receiving all rooms
    const listRooms = (rooms) => {
      setAllRooms(rooms)
    }
    
    // Handler for creating a room
    const handleRoomCreated = (roomName) => {
      setRoom({...room, joined: true, roomName});
    };
    const handleRoomCreateError = (data) => {
      alert(data)
    }
    
    // Handler for joining a room
    const handleRoomJoined = (roomName) => {
      setRoom({...room, joined: true, roomName});
    };
    const handleRoomJoinError = (data) => {
      alert(data)
    }
    
    socket.on('list_rooms', listRooms)
    socket.on('room_created', handleRoomCreated);
    socket.on('room_create_error', handleRoomCreateError)
    socket.on('room_joined', handleRoomJoined);
    socket.on('room_join_error', handleRoomJoinError)

    return () => {
      socket.off('list_rooms')
    }
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

          <ul>
            {roomList}
          </ul>

        </div>
      ) : (
        <ChatRoom socket={socket} room={room} />
      )
    }
      
    </div>
  )
}

export default Chat