import { db, User, Room, Message } from "./model.js";

console.log(await User.findAll())
console.log(await Room.findAll())
console.log(await Message.findAll())

await db.close()