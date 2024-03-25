
function CreateRoomModal({ socket, room, setRoom, setNewRoom }) {

  const createRoom = async (e) => {
    e.preventDefault()
    socket.emit('create_room', {
      roomName: room.roomName,
      password: room.password
    })
  }

  return (
    <div className='modal' id='join-room-modal'>

      <button onClick={() => setNewRoom(false)}>Cancel</button>

      <form
        id='create-room-form'
        onSubmit={createRoom}
      >
        <input
          type='text'
          name='room-name'
          placeholder='Room Name'
          value={room.roomName}
          onChange={e => setRoom({ ...room, roomName: e.target.value })}
        />
        <input
          type='text'
          name='room-password'
          placeholder='Room Password'
          value={room.password}
          onChange={e => setRoom({ ...room, password: e.target.value })}
        />
        <input type="submit" value="Create Room" />
      </form>
      
    </div>
  )
}

export default CreateRoomModal