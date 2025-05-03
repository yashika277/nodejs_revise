const express = require("express");
const { fetchUsers, createUser, updateUser, deleteUser } = require("../controller/userController");

const router = express.Router();

router.get("/", fetchUsers);
router.post("/create", createUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser)

module.exports = router;