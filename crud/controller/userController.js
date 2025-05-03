const USER = require("../models/userModel");

/* --------------------------------- create --------------------------------- */

const createUser = async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const userExist = await USER.findOne({ email })
        if (userExist) {
            return res.status(400).json({ message: "User already exist" })
        }
        const newUser = new USER({ name, email, phone })
        const savedUser = await newUser.save();
        res.status(200).json(savedUser)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

/* ----------------------------------- get ---------------------------------- */
const fetchUsers = async (req, res) => {
    try {
        
        const users = await USER.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/* --------------------------------- update --------------------------------- */
const updateUser = async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        const updatedUser = await USER.findByIdAndUpdate(
            req.params.id,
            { name, email, phone },
            { new: true, runValidators: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/* --------------------------------- delete --------------------------------- */
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await USER.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { createUser, fetchUsers, updateUser, deleteUser }