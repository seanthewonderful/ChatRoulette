import { useState, useEffect } from 'react'
import io from'socket.io-client'
import ChatRoom from '../components/ChatRoom'
import JoinRoomModal from '../components/JoinRoomModal'
import CreateRoomModal from '../components/CreateRoomModal'

const socket = io('http://localhost:9987')

function Chat() {

  const [room, setRoom] = useState({ 
    roomName: "", 
    password: "", 
    joined: false
  })
  const [allRooms, setAllRooms] = useState([])
  const [roomSelected, setRoomSelected] = useState(false)
  const [newRoom, setNewRoom] = useState(false)

  const openJoinModal = (listRoomName) => {
    setRoom({ 
      ...room, 
      roomName: listRoomName 
    })
    setRoomSelected(true)
  }

  const closeJoinModal = () => {
    setRoom({ 
      roomName: "", 
      password: "", 
      joined: false
    })
    setRoomSelected(false)
  }

  const handleCreateRoomClick = () => {
    setNewRoom(true)
    setRoom({
      roomName: "",
      password: "",
      joined: false
    })
  }

  const roomList = allRooms.map((listRoom, idx) => (
    <li key={idx}>
      {listRoom[0]}{"  "}
      <button
        id='join-room-btn'
        onClick={() => openJoinModal(listRoom[0])}
        >
          Join Room
      </button>
    </li>
  ))

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
      setNewRoom(false)
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

          <button 
            onClick={handleCreateRoomClick}
            >
              Create a New Chat Room
          </button>

          {newRoom && 
            <CreateRoomModal
              socket={socket}
              room={room}
              setRoom={setRoom}
              setNewRoom={setNewRoom}
              />
          }

          {roomSelected && 
            <JoinRoomModal 
              socket={socket}
              room={room}
              setRoom={setRoom}
              closeJoinModal={closeJoinModal}
              />
          }

          <ul>
            {roomList}
          </ul>

        </div>
      ) : (
        <ChatRoom 
          socket={socket} 
          room={room} 
          setRoom={setRoom}
          />
      )
    }
      
    </div>
  )
}

export default Chat