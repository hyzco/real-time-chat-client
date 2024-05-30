"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketUser {
    constructor(name) {
        this.id = null;
        this.name = null;
        this.isConnected = false;
        this.id = Math.random().toString(36).substr(-9); // Generate a unique id for user
        this.name = name;
    }
    connected(status) {
        console.log(`[SocketUser] User ${this.name} is now ${status ? "Connected" : "Disconnected"} to the chat`);
        this.isConnected = status;
    }
}
exports.default = SocketUser;
