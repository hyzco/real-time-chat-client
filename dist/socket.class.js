"use strict";
var _ChatClient_user_map, _ChatClient_rooms;
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
class User {
    constructor(name) {
        this.id = null;
        this.name = null;
        this.room = null;
        this.isConnected = false;
        this.id = Math.random().toString(36).substr(-9); // Generate a unique id for user
        this.name = name;
        this.room = "";
        this.isConnected = false;
    }
    set connected(status) {
        if (this.isConnected == status)
            return;
        console.log(`User ${this.name} is now ${status ? "Connected" : "Disconnected"} to the chat`);
        this.isConnected = status;
    }
    addRoom(newRoom) {
        const oldRoom = this.room;
        this.room = newRoom.name;
        // console.log(`[User-${this.id}] joined the room ${newRoom.name}.`);
        // socket.emit("addUserToRoom", this.id, oldRoom, this.room);
    }
}
class Room {
    constructor(name) {
        this.users = null;
        this.name = null;
        this.users = [];
        // this.messages = [];
        this.name = name;
    }
    addUser(user) {
        const index = this.users.indexOf(user);
        if (!~index)
            this.users.push(user);
        else
            throw new Error(`${user.name} is already in the room.`);
    }
    removeUser(user) {
        const index = this.users.indexOf(user);
        if (~index)
            this.users.splice(index, 1);
        else
            throw new Error(`${user.name} isn't in the room.`);
    }
}
class ChatClient {
    constructor() {
        _ChatClient_user_map.set(this, new Map());
        _ChatClient_rooms.set(this, new Map());
        // Initialize chat client properties or methods here
    }
}
_ChatClient_user_map = new WeakMap(), _ChatClient_rooms = new WeakMap();
class ChatClientWithSocketIO extends ChatClient {
    constructor(socketURL, options = {}) {
        super(); // Call the constructor of the parent class
        this.isClientReady = false;
        // Initialize socket.io-client
        const socket = (0, socket_io_client_1.io)(socketURL, options);
        if (!socket)
            console.error("Failed to connect to the server");
        // Example: Listen to an event
        socket.on("connect", () => {
            console.log("Connected to chat server.");
            this.isClientReady = true;
        });
    }
}
exports.default = ChatClientWithSocketIO;
