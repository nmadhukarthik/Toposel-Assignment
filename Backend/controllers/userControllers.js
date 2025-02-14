import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists)
            return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user)
            return res
                .status(400)
                .json({ message: "Invalid email or password" });

        if (!user.password) {
            return res
                .status(500)
                .json({ message: "User password is missing in database" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res
                .status(400)
                .json({ message: "Invalid email or password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const searchUser = async (req, res) => {
    const { query } = req.query;
    try {
        const users = await User.find({ name: new RegExp(query, "i") }).select(
            "+password"
        );
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
