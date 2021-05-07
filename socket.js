let io;

module.exports = {
    init: httpServer => {
        io = require('socket.io')(httpServer, {
            cors: {
                origin: '*'
            }
        });
        return io;
    },
    getIO: () => {
        if(!io) {
            console.log('Not initialized');
        }
        return io;
    }
};