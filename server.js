var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var nicknames = [];

server.listen(3000);


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){

    socket.on('new user', function(data, callback){
        if(nicknames.indexOf(data) != -1){
            callback(false);
        }else{
            callback(true);
            socket.nickname = data;
            nicknames.push(data);
            updateUsernames();
        }
    });

    function updateUsernames(){
        io.sockets.emit('usernames', nicknames);
    }

    socket.on('send message', function(data){
        io.sockets.emit('new message', data);
    });

    socket.on('disconnect', function(){
        if(!socket.nickname) return;
        nicknames.splice(nicknames.indexOf(socket.nickname), 1);
        updateUsernames();
    });
});