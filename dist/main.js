"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const socket = (0, socket_io_client_1.io)("ws://localhost:3000");
if (socket.connected)
    console.log("Connected to the server");
else
    console.error("Failed to connect to the server");
