const path = require('path');
const express = require('express');
//http is used by express under the hood, there is a method called create server. 
//But we want to access it directly because we need to in order to use socket.io "const server = http.createServer(app);"
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getTheCurrentUser, getRoomUsers, userLeave } = require('./utils/users');

const app = express();
const server = http.createServer(app);
//by doing this we can now run when a client connects
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

//this listens for some kind of event
//and whenever a client connects it should log this
io.on('connection', socket => {

    //get room that user has joined
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)

        socket.join(user.room)

        //welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord'))

        //broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        //Send users in room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    //listen for chat message event
    socket.on('chatMessage', (message) => {
        const user = getTheCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, message));
    });

    //runs when client disconnects from the room
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
        }

        //reset the state of the chat app when someone leaves
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));