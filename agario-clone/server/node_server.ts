import { Config, ServerControl } from 'server';
// import { ClientAteFoodData, DataValidation } from 'client_server';

const app = require('express')();
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer,
    {
        cors: {
            origin: Config.domain,
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        },
        pingTimeout: 20000
    }
);

new ServerControl(io).Initialize();

httpServer.listen(Config.port);

console.clear();
console.log("Server was started.");