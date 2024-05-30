"use strict";
// import { io } from "socket.io-client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SocketClient_class_1 = __importDefault(require("./SocketClient.class"));
const SocketUser_class_1 = __importDefault(require("./SocketUser.class"));
const readline = require("readline");
const CreateClient = () => {
    return new Promise((resolve, reject) => {
        try {
            const username = process.argv[3] ? process.argv[3] : "Anonymous";
            const user = new SocketUser_class_1.default(username);
            const client = new SocketClient_class_1.default(user, "ws://localhost:3000/chat");
            resolve(client);
        }
        catch (error) {
            console.log("Chat client has an internal error.");
            console.log(error);
        }
    });
};
const StartCLIClient = (chatClient) => {
    // console.log(chatClient);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        termina: false,
    });
    const clearLastLine = () => {
        process.stdout.moveCursor(0, -1); // up one line
        process.stdout.clearLine(0); // from cursor to end
    };
    const clearNextLine = () => {
        process.stdout.moveCursor(0, 1); // up one line
        process.stdout.clearLine(0); // from cursor to end
    };
    const exec_cmd = async (input) => {
        if (input) {
            if (input.startsWith("/c")) {
                chatClient.registerUser();
            }
            else if (input.startsWith("/dc")) {
                chatClient.unRegisterUser();
            }
            else if (input.startsWith("/gr") || input.startsWith("/getRooms")) {
                const rooms = await chatClient.getRooms();
                clearLastLine();
                process.stdout.write("---- \n  AVAILABLE ROOMS \n  ---- \n");
                rooms.forEach((room) => {
                    process.stdout.write(`  Room name: ${room[0]} \n`);
                    process.stdout.write(`  Online users: ${room[1].users ? room[1].users.length : "N/A"} \n`);
                    process.stdout.write("  ---- \n");
                });
                rl.prompt();
            }
            else if (input.startsWith("/joinRoom ")) {
                clearLastLine();
                const roomName = input.split(" ")[1];
                chatClient.joinToRoom(roomName);
            }
            else {
                // console.log("here");
                chatClient.sendMessage(input);
                // process.stdout.write(`> [YOU] ${input}`);
            }
        }
    };
    const cli = () => {
        rl.prompt();
        clearLastLine();
        rl.prompt();
        rl.on("line", exec_cmd);
        rl.on("line", async (input) => {
            rl.prompt();
            clearLastLine();
            rl.prompt();
        });
        rl.on("close", () => {
            console.log("And now we part company.");
            process.exit(0);
        });
    };
    const fixfunc = () => {
        //get first input
        var input = process.stdin.read();
        if (input == null)
            return;
        input = input.toString("utf-8");
        //No longer needed, so remove the listener
        process.stdin.removeListener("readable", fixfunc);
        process.stdin.resume();
        //do whatever you want with the input
        exec_cmd(input);
        //Initialize readline and let it do its job
        cli();
    };
    process.stdin.pause();
    process.stdin.on("readable", fixfunc);
    process.stdout.write("> Welcome, Commander!\n> ");
    // rl.setPrompt("Message> ");
    chatClient.getSocket().on("receive_message", (msgObj) => {
        // rl.clearLine(process.stdout, 0); //0 clears entire line
        // rl.setPrompt("");
        // clearLastLine();
        process.stdout.write(`[${msgObj.userName}] ${msgObj.message}\n`);
        // rl.prompt();
        // process.stdout.write(`\n`);
        rl.prompt();
        // clearLastLine();
        // rl.prompt();
        // clearNextLine();
        // rl.prompt();
        // console_out(messages);
        // Handle the received messages (e.g., display them in the UI)
    });
    // clearNextLine();
    // rl.prompt();
};
CreateClient()
    .then((client) => {
    const interval = setInterval(() => {
        console.log("[Main] Checking if client is ready..");
        if (client) {
            console.log("[Main] Client is Ready!");
            clearInterval(interval);
            StartCLIClient(client);
        }
        else {
            console.log("[Main] Waiting...");
        }
    }, 300);
    return client;
})
    .then((client) => { });
let receiverId;
