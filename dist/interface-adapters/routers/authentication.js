"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("../controllers/authentication");
exports.default = (router) => {
    router.post("/auth/register", authentication_1.register);
    router.post("/auth/login", authentication_1.login);
    router.get("/auth/validate", authentication_1.validateSessionToken);
};
//# sourceMappingURL=authentication.js.map