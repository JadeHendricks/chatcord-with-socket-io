const chatFrom = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get user name and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

//Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    addUsersToDom(users);
});

socket.on('message', message => {
    outputMessage(message);

    // scroll down everytime we get a message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//message submit
chatFrom.addEventListener('submit', event => {
    event.preventDefault();

    //get the text input
    const message = event.target.elements.msg;
    //emitting a message to the server
    socket.emit('chatMessage', message.value);

    //clear Input after send
    message.value = '';
    message.focus();
});

//output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.userName} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>
    `;

    document.getElementById('chat-messages').appendChild(div);
}

function outputRoomName(room) {
    roomName.innerText = room;
}


function addUsersToDom(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}