"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSocketDisconnection = void 0;
const handleSocketDisconnection = (socket, socketDataMap) => {
    socketDataMap.delete(socket.id);
};
exports.handleSocketDisconnection = handleSocketDisconnection;
//# sourceMappingURL=disconnect.js.map