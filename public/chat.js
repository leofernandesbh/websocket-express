const socket = io()

const urlSearch = new URLSearchParams(window.location.search)
const username = urlSearch.get('username')
const room = urlSearch.get('room')

const userIdentification = document.getElementById('username')
const newUser = document.createElement('h3')
newUser.innerHTML = `Olá, ${username}! Você está na sala de ${room}`

userIdentification.appendChild(newUser)

socket.emit('chat:join', { username, room: room }, messages => {
  messages.forEach(message => createMessage(message));
})

const chatInput = document.getElementById('message-input')

document.addEventListener('submit', (event) => {
  event.preventDefault();

  const message = chatInput.value

  if (message){
    socket.emit('chat:message', {
      username,
      room,
      message
    })

    chatInput.value = ''  
  }
})

const logoutButton = document.getElementById('logout')

logoutButton.addEventListener('click', (event) => {
  event.preventDefault();    

  socket.emit('chat:leave', {
    username,
    room
  })

  window.location.href = 'index.html'
})

socket.on('chat:message', (data) => {
  const isMe = data.username === username 
  const meJoined = data.whoJoined && data.whoJoined === username
  const meLeft = data.whoLeft && data.whoLeft === username

  if (meJoined || meLeft)
    return

  createMessage(data, isMe)
})

function createMessage(data, isMe) {
  const chatMessages = document.getElementById('chat-messages')
  const newMessage = document.createElement('div')
  
  newMessage.classList.add('message')
  isMe 
    ? newMessage.innerHTML = `<span class="me">Você:</span> ${data.message}`
    : newMessage.innerHTML = `<span class="user">${data.username}:</span> ${data.message}`

  chatMessages.appendChild(newMessage)
  chatMessages.scrollTop = chatMessages.scrollHeight
}