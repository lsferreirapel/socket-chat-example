// Set socket handshake with user token
const socket = io({
  auth: {
    token: document.cookie?.split('; ')[0]?.slice(6)
  }
});

// Get HTML elements to manipulate
const typingLabel = document.getElementById('typing-label');
const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');

const usernameInfo = document.getElementById('username');
const userColorInfo = document.getElementById('user-color');
const htmlUsersList = document.getElementById('userslist');

// Create user
let user;

// Get user information from server side
//  and save on html elements
socket.on('user information', userInfo => {
  usernameInfo.textContent = userInfo.username;
  userColorInfo.style.background = userInfo.color;
});

// Get list of online users from server side
socket.on('online users', usersList => {
  
  // Reset userlist
  htmlUsersList.querySelectorAll('li').forEach(item => item.remove());

  // Create a new Li element foreach user on list
  usersList.forEach(user => {
    let item = document.createElement('li');
    item.textContent = user.username;
    item.style.color = user.color;

    // Append user on userlist
    htmlUsersList.appendChild(item);
  });
})

// Send alert to all users when a new user logs in
socket.on('user connection', (alert, className) => {
  
  // Create message element
  let item = document.createElement('li');
  item.textContent = alert;
  item.classList.add(className);

  // Append to messages list
  messages.appendChild(item);

  // Scroll messages to bottom
  messages.scrollTop = messages.scrollHeight;
})

// Send alert to all users when a user is typing
socket.on('typing', (bool, user) => {
  
  // if "bool" is true, user is typing
  if (bool) {
    typingLabel.textContent = `${user.username} is typing...`;
  } else {
    typingLabel.textContent = '';
  }
})

// Recieve message from server side
//  and send that to all online users
socket.on('chat message', (msg, user) => {

  // Create HTML elements to message
  const item = document.createElement('li');
  const label = document.createElement('strong');

  // Set username label
  label.textContent = user.username;
  label.style.color = user.darkerColor;
  label.classList.add('message-label-name');
  
  // Set message
  item.style.borderColor = user.darkerColor;
  item.style.background = user.lightenColor;
  item.classList.add('message');
  item.textContent = `${msg}`;
  item.insertBefore(label, item.firstChild);

  // Append message on messages list
  messages.appendChild(item);

  // Scroll messages to bottom
  messages.scrollTop = messages.scrollHeight;
});

// Function to know when the user is typing
let typeInterval;
let typing = false;
input.addEventListener('keydown', e => {
  if (e.key !== 'Enter') {
    clearInterval(typeInterval);
    if (!typing) {
      typing = true;
      socket.emit('typing', typing);
    } 
    typeInterval = setTimeout(() => {
      typing = false;
      socket.emit('typing', typing);
    }, 1000);
  }
});


form.addEventListener('submit', e => { 
  e.preventDefault();
  
  if (typing) {
    clearInterval(typeInterval);
    typing = false;
    socket.emit('typing', typing);
  }

  // Send user message to server side
  if (input.value) {
    socket.emit('chat message', input.value);

    // Reset input
    input.value = '';
  }
});


