import express from "express";
import { autenticate } from "../middlewares/authMiddleware.js";
import {
    registerUser,
    loginUser,
    searchUser,
} from "../controllers/userControllers.js";

export const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/search", autenticate, searchUser);
