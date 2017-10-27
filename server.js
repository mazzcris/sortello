const io = require('socket.io')();


io.on('connection', (socket) => {

  // Admin wants to open a new room
  socket.on('openNewRoom', () => {
    console.log('A client requested to open a new Room');
    let newRoomKey = getNewRoomKey()
    socket.join(newRoomKey);
    socket.emit('newRoomOpened', newRoomKey)
  })

  // Client wants to join the room
  socket.on('room', function (room) {
    socket.join(room);
    io.to(room).emit('getCurrentChoice')
    io.to(room).emit('voterJoined',socket.id)
  });

  socket.on('cardClicked', function (side, room, trelloId, trelloAvatar) {
    io.to(room).emit('cardClicked', side, socket.id, trelloId, trelloAvatar)
  })

  socket.on('prioritizationEnded', function (room) {
    io.to(room).emit('prioritizationEnded', room)
  })



  // Emitted by admin choices
  socket.on('nextChoice', function (leftCard, rightCard, room) {
    console.log("admin triggered nextchoice");
    io.to(room).emit('nextChoice', leftCard, rightCard)
  })

});

function getNewRoomKey () {
  return '123n123eih12he';
}

const port = 8000;
io.listen(port);
console.log('listening on port ', port);