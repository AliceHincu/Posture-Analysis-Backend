const User = require("../models/User");

// User Actions
export const getUsers = () => User.findAll();

export const getUserByEmail = (email: string) => User.findOne({ where: { email } });

export const getUserBySessionToken = (sessionToken: string) => User.findOne({ where: { sessionToken } });

export const getUserById = (id: string) => User.findByPk(id);

export const createUser = (values: Record<string, any>) => User.create(values);

export const deleteUserById = (id: string) => User.destroy({ where: { id } });

export const updateUserById = (id: string, values: Record<string, any>) => User.update(values, { where: { id } });
