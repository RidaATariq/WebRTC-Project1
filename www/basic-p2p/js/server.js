const namespaces = io.of(/^\/[0-9]{7}$/);
namespaces.on('connect', function(socket) {
const namespace = socket.nsp;
socket.broadcast.emit('connected peer');
socket.on('signal', function(data) {
socket.broadcast.emit('signal', data);
});
socket.on('disconnect', function() {
namespace.emit('disconnected peer');
});
});
