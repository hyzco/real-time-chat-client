import { io } from "socket.io-client";

class ChatClient {
  #user_map = new Map();
  rooms = new Map();

  constructor() {
    // Initialize chat client properties or methods here
  }
}

export default class ChatClientWithSocketIO extends ChatClient {
  isClientReady: boolean = false;
  #socket = null;
  availableRoomList: Array<any>;
  DEFAULT_ROOM = "/general";
  currentRoom = null;
  #user = null;

  constructor(user, socketURL, options = {}) {
    super();
    this.#user = user;
    this.#user.connected(true);

    // Initialize socket.io-client
    this.#socket = io(socketURL, options);
    if (!this.#socket)
      throw new Error("[ChatClient] Failed to connect to the server");

    this.#socket.on("connect", () => {
      console.log("[ChatClient] Connected to chat server.");
      this.isClientReady = true;
    });

    this.#socket.on("disconnect", () => {
      this.isClientReady = false;
      this.#user.connected(false);
      console.log("[ChatClient] Disconnected from the chat server.");
    });

    this.registerUser();
  }

  registerUser() {
    this.#socket.emit("register_user", this.#user, (isAckDone) => {
      if (!isAckDone)
        throw new Error("User could not be registered to the server.");
    });
  }

  async getRooms() {
    try {
      await this.IOgetAvailableRooms(); // Await for the asynchronous operation to complete
      return this.availableRoomList; // Return the available rooms
    } catch (error) {
      throw error; // Throw any errors encountered during the process
    }
  }

  async IOgetAvailableRooms() {
    try {
      return new Promise((resolve, reject) => {
        this.#socket.emit("get_available_rooms", (roomList) => {
          this.setAvailableRooms(roomList); // Ensure proper binding of the callback function
          resolve(true); // Resolve the promise once roomList is received
        });
      });
    } catch (error) {
      throw error; // Throw any errors encountered during the process
    }
  }

  joinToRoom(roomName) {
    this.#socket.emit(
      "join_to_room",
      {
        user: this.#user,
        roomName: roomName,
      },
      (isAckDone) => {
        if (isAckDone && this.#user) {
          console.log(`[ChatClient] Joined to room "/general" `);
        }

        console.log("JOIN TO ROOM STATUS: ", isAckDone);
      }
    );
  }

  unRegisterUser() {
    this.#socket.emit("unregister_user", (isAckDone) => {
      console.log("[ChatClient] Removing user.");
      if (isAckDone) {
        console.log(`[ChatClient] User is unregistered from the server.`);
      }
    });
  }

  setAvailableRooms(roomList) {
    // console.log("[ChatClient] Available rooms from client: ", roomList);
    const array: Array<any> = Array.from(roomList);
    // array.forEach((item: any) => {
    //   this.availableRoomList.push(item);
    // });
    this.availableRoomList = array;
    if (
      this.availableRoomList === null &&
      this.availableRoomList === undefined
    ) {
      throw new Error("Room list could not be set.");
    }
    // ChatClientWithSocketIO.availableRoomList = roomList[0];
  }

  sendMessage(message, roomName = "general") {
    console.log("message: ", message);
    this.#socket.emit("send_message", { roomName: roomName, message: message });
  }

  getSocket() {
    return this.#socket;
  }
}
