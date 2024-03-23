import { db, User, Room, Message } from "./model.js";

await db.sync({ force: true });

const aaa = await User.create({ username: "a", password: "asdf" })
const bbb = await User.create({ username: "b", password: "asdf" })

// const roomA = await aaa.createRoom({ roomName: "roomA" })
// const roomB = await bbb.createRoom({ roomName: "roomB" })

// const messageA = await aaa.createMessage({ 
//   roomId: roomA.roomId, 
//   message: "Message from user aaa in roomA" 
// })

// const messageB = await bbb.createMessage({
//   roomId: roomB.roomId,
//   message: "Message from user bbb in roomB"
// })  

console.log("Finished seeding database.")

await db.close()