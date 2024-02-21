import { app } from "./http"

interface UserRoom {
  socketId: string
  username: string
  room: string
}

interface Message {
  username: string
  whoJoined?: string
  whoLeft?: string
  room: string
  message: string
  createdAt: Date
}

const users: UserRoom[] = []
const messages: Message[] = []

app.io.on('connection', (socket) => {
  socket.on('chat:join', (data, callback) => {    
    socket.join(data.room)

    const userInRoom = users.find(user => user.username === data.username && user.room === data.room)

    if (userInRoom) {
      userInRoom.socketId = socket.id
    } else {
      users.push({
        socketId: socket.id,
        username: data.username,
        room: data.room
      })    
    }

    const message = {
      username: 'Bot',
      whoJoined: data.username,
      room: data.room,
      message: `${data.username} entrou`,
      createdAt: new Date()
    }        

    app.io.to(data.room).emit('chat:message', message)

    const currentRoomMessages = getRoomMessages(data.username, data.room)

    callback(currentRoomMessages)
  })

  socket.on('chat:leave', (data) => {
    const userInRoom = users.find(user => user.username === data.username && user.room === data.room)    

    if (userInRoom) {      
      const message = {
        username: 'Bot',
        whoLeft: data.username,
        room: data.room,
        message: `${data.username} saiu`,
        createdAt: new Date()
      }        

      messages.push(message)

      app.io.to(data.room).emit('chat:message', message)
    }
  })

  socket.on('chat:message', (data) => {
    const userInRoom = users.find(user => user.username === data.username && user.room === data.room)    

    if (userInRoom) {
      const message = {
        username: data.username,
        room: data.room,
        message: data.message,
        createdAt: new Date()
      }

      messages.push(message)

      app.io.to(data.room).emit('chat:message', message)
    }
  })
})

function getRoomMessages(username: string, room: string) {
  const roomMessages = messages.filter(message => 
    message.room === room 
    && (!message.whoLeft || message.whoLeft !== username) 
    && (!message.whoJoined || message.whoJoined !== username))

  return roomMessages
}