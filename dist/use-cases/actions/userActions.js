"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserById = exports.deleteUserById = exports.createUser = exports.getUserById = exports.getUserBySessionToken = exports.getUserByEmail = exports.getUsers = void 0;
const User = require("../../entities/models/User");
// User Actions
const getUsers = () => User.findAll();
exports.getUsers = getUsers;
const getUserByEmail = (email) => User.findOne({ where: { email } });
exports.getUserByEmail = getUserByEmail;
const getUserBySessionToken = (sessionToken) => User.findOne({ where: { sessionToken } });
exports.getUserBySessionToken = getUserBySessionToken;
const getUserById = (id) => User.findByPk(id);
exports.getUserById = getUserById;
const createUser = (values) => User.create(values);
exports.createUser = createUser;
const deleteUserById = (id) => User.destroy({ where: { id } });
exports.deleteUserById = deleteUserById;
const updateUserById = (id, values) => User.update(values, { where: { id } });
exports.updateUserById = updateUserById;
//# sourceMappingURL=userActions.js.map