"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSessionToken = exports.register = exports.login = void 0;
const helpers_1 = require("../helpers");
const userActions_1 = require("../../use-cases/actions/userActions");
// controllers/authController.js
const User = require("../../entities/models/User"); // Point to your user model file
// Login Controller
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.sendStatus(400);
        }
        const user = yield User.findOne({ where: { email } });
        if (!user) {
            return res.sendStatus(404);
        }
        const expectedHash = (0, helpers_1.authentication)(user.salt, password);
        if (user.password !== expectedHash) {
            return res.sendStatus(401);
        }
        const salt = (0, helpers_1.random)();
        user.sessionToken = (0, helpers_1.authentication)(salt, user.id.toString());
        yield user.save();
        res.cookie("ALICE-AUTH", user.sessionToken, { domain: "localhost", path: "/" });
        // res.cookie("ALICE-AUTH", user.sessionToken);
        return res.status(200).json(user).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.login = login;
// Register Controller
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res.sendStatus(400);
        }
        const existingUser = yield User.findOne({ where: { email } });
        if (existingUser) {
            return res.sendStatus(409);
        }
        const salt = (0, helpers_1.random)();
        const hashedPassword = (0, helpers_1.authentication)(salt, password);
        const user = yield User.create({
            username,
            email,
            password: hashedPassword,
            salt,
        });
        return res.status(200).json(user).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.register = register;
const validateSessionToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies["ALICE-AUTH"]; // get the cookie
    if (!token) {
        return res.status(200).json({ isAuthenticated: false });
    }
    const existingUser = yield (0, userActions_1.getUserBySessionToken)(token);
    if (existingUser) {
        return res.status(200).json({ isAuthenticated: true, token });
    }
    else {
        return res.status(401).json({ isAuthenticated: false });
    }
});
exports.validateSessionToken = validateSessionToken;
//# sourceMappingURL=authentication.js.map