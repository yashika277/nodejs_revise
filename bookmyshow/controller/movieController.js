const Movie = require("../models/movieModel");
const Role = require("../models/roleModel");
const User = require("../models/userModel");
const { encryptData } = require("../utils/encrypt");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            res.status(400).json({ success: false, message: "All Fields are required" })
        }

        const newEmail = email.toLowerCase()
        const userExists = await User.findOne({ email: newEmail });
        if (userExists) {
            return res.status(400).send('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            name,
            email: newEmail,
            password: hashedPassword,
            role: req.body.role,

        })
        // console.log(newUser);

        await newUser.save();

        const roleFind = await Role.findById(req.body.role)
        res.status(201).json({ success: true, message: `${roleFind.name} created` })

    } catch (error) {
        res.status(500).json({ success: false, message: "server error" })
    }

}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "email or password required" })
        }

        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid user" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "password not match" })
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        const encryptToken = encryptData(token)

        res.cookie('token', encryptToken, {
            httpOnly: true
        })

        res.status(200).json({ success: true, message: "Login successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const createMovie = async (req, res) => {
    try {
        const {
            movieName, description, theaterName, location, releaseDate, language, seatsAvailable
        } = req.body;

        if (!movieName || !theaterName || !location || !seatsAvailable) {
            return res.status(400).json({ success: false, message: 'movieName, theaterName, location, and seatsAvailable are required.' });
        }

        const movieExist = await Movie.findOne({ movieName });
        if (movieExist) {
            return res.status(400).json({ success: false, message: "movie already exists" });
        }

        const newMovie = new Movie({
            movieName,
            description,
            theaterName,
            location,
            releaseDate,
            language,
            seatsAvailable,
            createdBy: req.user._id
        });

        await newMovie.save();
        res.status(201).json({ success: true, message: "movie created successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "server error", error: error.message });
    }
};

const getAllMovies = async (req, res) => {
    try {
        const query = { isDeleted: false }
        let { sortBy, page, limit, search, movie } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 2;
        sortBy = sortBy || 'createdAt';
        movie = movie === 'desc' ? -1 : 1;

        const skip = (page - 1) * limit;

        // if (search) {
        //     query.bookname = { $regex: search, $options: 'i' };
        // }


        // search filter

        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedSearch, "i");
            query.$or = [
                { movieName: regex }
            ];
        }

        const totalMovie = await Movie.countDocuments(query)
        const movies = await Movie.find(query)
            .sort({ [sortBy]: movie })
            .skip(skip)
            .limit(limit)
            .populate("createdBy", "email")


        res.status(200).json({ success: true, totalMovie, movies });
    } catch (error) {
        res.status(500).json({ success: false, message: "server error", error: error.message });
    }
};

const createRole = async (req, res) => {
    try {
        const { name } = req.body;
        await Role.create({ name });
        res.status(200).json({ success: true, message: "role added " });
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const getAllRoles = async (req, res) => {
    try {
        const role = await Role.find();
        res.status(200).json({ success: true, role })
    } catch (error) {
        return res.status(500).json({ success: false, message: "server err" })
    }
}

const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ success: false, message: "Movie not found" });
        }
        res.status(200).json({ success: true, data: movie });
    } catch (error) {
        res.status(500).json({ success: false, message: "server error", error: error.message });
    }
};

const updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body);
        if (!movie) {
            return res.status(404).json({ success: false, message: "Movie not found" });
        }
        res.status(200).json({ success: true, message: "movie updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "server error", error: error.message });
    }

}

const deleteMovie = async (req, res) => {
    try {
        await Movie.updateOne(
            {
                _id: req.params.id
            },
            {
                isDeleted: true,
                deletedBy: req.user._id,
                deletedAt: new Date()
            })
        res.status(200).json({ success: true, message: "movie deleted successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const bookTicket = async (req, res) => {

    const { movieId, userId, seatsBooked } = req.body;

    const movie = await Movie.findById(movieId)
    if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    if (movie.seatsAvailable < seatsBooked) {
        return res.status(400).json({ message: 'Not enough seats available' });
    }

    const booking = {
        userId,
        seatsBooked
    }
    movie.bookings.push(booking)
    movie.seatsAvailable -= seatsBooked;

    await movie.save()
    res.status(200).json({ success: true, message: "ticket booked" })
}

module.exports = { createMovie, getAllMovies, getMovieById, updateMovie, deleteMovie, createUser, createRole, getAllRoles, loginUser, bookTicket }