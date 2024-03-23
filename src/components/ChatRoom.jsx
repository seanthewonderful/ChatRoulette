import React, { useEffect, useState } from 'react'


function ChatRoom({ socket, room }) {

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

export default ChatRoom