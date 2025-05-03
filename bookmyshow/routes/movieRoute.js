const express = require("express");
const { getAllRoles, createRole, createUser, loginUser, createMovie, getAllMovies, getMovieById, updateMovie, deleteMovie, bookTicket } = require("../controller/movieController");
const { auth, isAdmin, isUser } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const route = express.Router();

route.get("/role/get", getAllRoles)
route.post("/role/create", createRole)

route.post("/user/create", auth, createUser)
route.post("/user/login", loginUser)

route.get("/", auth, getAllMovies)
route.get("/fetch/:id", auth, getMovieById)
route.post("/create", auth, isAdmin,upload.single('image'), createMovie)
route.put("/update/:id", auth, isAdmin, updateMovie)
route.delete("/delete/:id", auth, isAdmin, deleteMovie)

route.post("/ticketbook", auth, isUser, bookTicket)

module.exports = route