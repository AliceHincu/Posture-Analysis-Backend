import express from "express";
import { random, authentication } from "../helpers";
import { getUserBySessionToken } from "../../use-cases/actions/userActions";

// controllers/authController.js
const User = require("../../entities/models/User"); // Point to your user model file

// Login Controller
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.sendStatus(404);
    }

    const expectedHash = authentication(user.salt, password);

    if (user.password !== expectedHash) {
      return res.sendStatus(401);
    }

    const salt = random();
    user.sessionToken = authentication(salt, user.id.toString());

    await user.save();

    res.cookie("ALICE-AUTH", user.sessionToken, { domain: "localhost", path: "/" });
    // res.cookie("ALICE-AUTH", user.sessionToken);

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// Register Controller
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.sendStatus(409);
    }

    const salt = random();
    const hashedPassword = authentication(salt, password);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      salt,
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const validateSessionToken = async (req: express.Request, res: express.Response) => {
  const token = req.cookies["ALICE-AUTH"]; // get the cookie
  if (!token) {
    return res.status(200).json({ isAuthenticated: false });
  }

  const existingUser = await getUserBySessionToken(token);

  if (existingUser) {
    return res.status(200).json({ isAuthenticated: true, token });
  } else {
    return res.status(401).json({ isAuthenticated: false });
  }
};
