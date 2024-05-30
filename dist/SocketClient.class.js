"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ChatClient_user_map, _ChatClientWithSocketIO_socket, _ChatClientWithSocketIO_user;
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
class ChatClient {
    constructor() {
        _ChatClient_user_map.set(this, new Map());
        this.rooms = new Map();
        // Initialize chat client properties or methods here
    }
}
_ChatClient_user_map = new WeakMap();
class ChatClientWithSocketIO extends ChatClient {
    constructor(user, socketURL, options = {}) {
        super();
        this.isClientReady = false;
        _ChatClientWithSocketIO_socket.set(this, null);
        this.DEFAULT_ROOM = "/general";
        this.currentRoom = null;
        _ChatClientWithSocketIO_user.set(this, null);
        __classPrivateFieldSet(this, _ChatClientWithSocketIO_user, user, "f");
        __classPrivateFieldGet(this, _ChatClientWithSocketIO_user, "f").connected(true);
        // Initialize socket.io-client
        __classPrivateFieldSet(this, _ChatClientWithSocketIO_socket, (0, socket_io_client_1.io)(socketURL, options), "f");
        if (!__classPrivateFieldGet(this, _ChatClientWithSocketIO_socket, "f"))
            throw new Error("[ChatClient] Failed to connect to the server");
        __classPrivateFieldGet(this, _ChatClientWithSocketIO_socket, "f").on("connect", () => {
            console.log("[ChatClient] Connected to chat server.");
            this.isClientReady = true;
        });
        __classPrivateFieldGet(this, _ChatClientWithSocketIO_socket, "f").on("disconnect", () => {
            this.isClientReady = false;
            __classPrivateFieldGet(this, _ChatClientWithSocketIO_user, "f").connected(false);
            console.log("[ChatClient] Disconnected from the chat server.");
        });
        this.registerUser();
    }
    registerUser() {
        __classPrivateFieldGet(this, _ChatClientWithSocketIO_socket, "f").emit("register_user", __classPrivateFieldGet(this, _ChatClientWithSocketIO_user, "f"), (isAckDone) => {
            if (!isAckDone)
                throw new Error("User could not be registered to the server.");
        });
    }
    async getRooms() {
        try {
            await this.IOgetAvailableRooms(); // Await for the asynchronous operation to complete
            return this.availableRoomList; // Return the available rooms
        }
        catch (error) {
            throw error; // Throw any errors encountered during the process
        }
    }
    async IOgetAvailableRooms() {
        try {
            return new Promise((resolve, reject) => {
                __classPrivateFieldGet(this, _ChatClientWithSocketIO_socket, "f").emit("get_available_rooms", (roomList) => {
                    this.setAvailableRooms(roomList); // Ensure proper binding of the callback function
                    resolve(true); // Resolve the promise once roomList is received
                });
            });
        }
        catch (error) {
            throw error; // Throw any errors encountered during the process
        }
    }
    joinToRoom(roomName) {
        __classPrivateFieldGet(this, _ChatClientWithSocketIO_socket, "f").emit("join_to_room", {
            user: __classPrivateFieldGet(this, _ChatClientWithSocketIO_user, "f"),
            roomName: roomName,
        }, (isAckDone) => {
            if (isAckDone && __classPrivateFieldGet(this, _ChatClientWithSocketIO_user, "f")) {
                console.log(`[ChatClient] Joined to room "/general" `);
            }
            console.log("JOIN TO ROOM STATUS: ", isAckDone);
        });
    }
    unRegisterUser() {
        __classPrivateFieldGet(this, _ChatClientWithSocketIO_socket, "f").emit("unregister_user", (isAckDone) => {
            console.log("[ChatClient] Removing user.");
            if (isAckDone) {
                console.log(`[ChatClient] User is unregistered from the server.`);
            }
        });
    }
    setAvailableRooms(roomList) {
        // console.log("[ChatClient] Available rooms from client: ", roomList);
        const array = Array.from(roomList);
        // array.forEach((item: any) => {
        //   this.availableRoomList.push(item);
        // });
        this.availableRoomList = array;
        if (this.availableRoomList === null &&
            this.availableRoomList === undefined) {
            throw new Error("Room list could not be set.");
        }
        // ChatClientWithSocketIO.availableRoomList = roomList[0];
    }
    sendMessage(message, roomName = "general") {
        console.log("message: ", message);
        __classPrivateFieldGet(this, _ChatClientWithSocketIO_socket, "f").emit("send_message", { roomName: roomName, message: message });
    }
    getSocket() {
        return __classPrivateFieldGet(this, _ChatClientWithSocketIO_socket, "f");
    }
}
_ChatClientWithSocketIO_socket = new WeakMap(), _ChatClientWithSocketIO_user = new WeakMap();
exports.default = ChatClientWithSocketIO;
