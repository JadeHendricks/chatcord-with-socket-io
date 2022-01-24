const path = require('path');
const express = require('express');
//http is used by express under the hood, there is a method called create server. 
//But we want to access it directly because we need to in order to use socket.io "const server = http.createServer(app);"
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
//by doing this we can now run when a client connects
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));
//this listens for some kind of event
//and whenever a client connects it should log this
io.on('connection', socket => {
    //welcome current user
    socket.emit('message', 'Welcome to ChatCord')

    //broadcast when a user connects
    socket.broadcast.emit('message', 'A user has joined the chat');

    //runs when client disconnects from the room
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    })

    //listen for chatmessage event
    socket.on('chatMessage', (message) => {
        io.emit('message', message);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));