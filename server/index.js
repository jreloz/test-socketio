const http = require('http').createServer();


const io = require('socket.io')(http,{
    cors:{origin:"*"}
});
 

let users = [];



io.on('connection',(socket) => {
    console.log("user connected");


    socket.on('join', function(request){

        let data = JSON.parse(request);

        users.push({
            id:socket.id,
            name:data.name,
        });

        io.emit('join',
            JSON.stringify({
                id:socket.id,
                users:users,
                name:data.name,
            })
        )

    });



    socket.on('message',(request) => {
        let data = JSON.parse(request);
        io.emit('message', 
            JSON.stringify(
                {
                    id: socket.id,
                    name: data.name,
                    message: data.message
                }
            )
        )
    });



    socket.on('disconnect', function() {
        console.log('Got disconnect!');
  
        console.log(socket.id);
        var i = users.indexOf(socket.id);
        users.splice(i, 1);

        io.emit('user_disconnected',
            JSON.stringify({
                id:socket.id,
                users:users,
            })
        )
        
     });
})

http.listen(8080,() => console.log("listening 8080"))