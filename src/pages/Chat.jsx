import { useState, useEffect } from 'react'
import io from'socket.io-client'

const socket = io('http://localhost:9987')

function Chat() {

  const [room, setRoom] = useState("")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])

  console.log(messages)

  const messageThread = messages.map((message, index) => {
    return (
      <div key={index}>
        <span>{message.username}: </span>
        <span>{message.message}</span>
      </div>
    )
  })

  const joinRoom = async (e) => {
    e.preventDefault()
    if (room !== "") {
      socket.emit('join_room', { room })

    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    socket.emit('send_message', { message, room, username: 'User' })
    setMessage("")
  }

  useEffect(() => {
    const handleNewMessage = (data) => {
      setMessages(prevMessages => [data, ...prevMessages]);
    };
  
    socket.on('new_message', handleNewMessage);
  
    // Clean-up function
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [])

  return (
    <div>

      <form 
        id='create-room-form'
        onSubmit={joinRoom}
        >
          <input
            type="text"
            name="room"
            placeholder="Enter Room Code..."
            value={room}
            onChange={e => setRoom(e.target.value)}
          />
          <input type="submit" value="Join Room" />
      </form>
      
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
      {messageThread}
      </section>
    </div>
  )
}

export default Chat