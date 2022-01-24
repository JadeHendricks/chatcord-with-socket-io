const chatFrom = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');

const socket = io();

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
    <p class="meta">Brad <span>9:12pm</span></p>
    <p class="text">
        ${message}
    </p>
    `;

    document.getElementById('chat-messages').appendChild(div);
}