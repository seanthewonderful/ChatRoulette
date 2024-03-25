
function JoinRoomModal({ socket, room, setRoom, closeJoinModal }) {

  const joinRoom = async (e) => {
    e.preventDefault()
    if (room.password !== "") {
      socket.emit('join_room', { roomName: room.roomName, password: room.password })
    }
  }

  return (
    <div className='modal' id='join-room-modal'>

      <button onClick={closeJoinModal}>Close</button>

      <form
        id='join-room-form'
        onSubmit={joinRoom}
      >
        
        <h4>Join room "{room.roomName}"?</h4>
        <input
          type="text"
          name="room"
          placeholder="Enter Room Code..."
          value={room.password}
          onChange={e => setRoom({ ...room, password: e.target.value })}
        />
        <input type="submit" value="Join Room" />
      </form>
    </div>
  )
}

export default JoinRoomModal