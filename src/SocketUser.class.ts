export default class SocketUser {
  id = null;
  name = null;
  isConnected = false;
  constructor(name) {
    this.id = Math.random().toString(36).substr(-9); // Generate a unique id for user
    this.name = name;
  }

  connected(status) {
    console.log(
      `[SocketUser] User ${this.name} is now ${
        status ? "Connected" : "Disconnected"
      } to the chat`
    );
    this.isConnected = status;
  }
}
