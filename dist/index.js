"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const result = require("dotenv").config();
if (result.error) {
    throw result.error;
}
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const routers_1 = __importDefault(require("./interface-adapters/routers"));
const websocket_1 = require("./interface-adapters/controllers/websocket");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
const socketDataMap = new Map();
(0, websocket_1.setupSocketEvents)(io, socketDataMap);
server.listen(process.env.PORT, () => {
    console.log("Server running ");
});
app.use("/", (0, routers_1.default)());
//# sourceMappingURL=index.js.map