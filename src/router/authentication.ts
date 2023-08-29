import express from "express";

import { login, register, validateSessionToken } from "../controllers/authentication";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.get("/auth/validate", validateSessionToken);
};
