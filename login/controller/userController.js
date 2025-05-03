const User = require("../models/userModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");

const fetch = async (req, res) => {
    try {
        const sort = {};
        if (req.query.sortBy) {
            const user = req.query.user === 'desc' ? -1 : 1;
            sort[req.query.sortBy] = user;
        }
        else {
            sort['createdAt'] = -1;
        }


        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page - 1) * limit;
        const user = await User.find()
            .sort(sort)
            .skip(skip)
            .limit(limit);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

const register = async (req, res) => {
    const { name, email, password } = req.body;
    const exist = await User.findOne({ email })
    if (exist) {
        return res.status(400).json({ message: "User already exist" })
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
        name,
        email,
        password: hashed,
        image: req.file ? req.file.path : ''
    })
    await user.save();

    res.status(201).json({ message: "registerd successfully" })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10d' })
    res.json(token)
}

const sendOtp = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(10000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();
    await sendMail(email, `your otp is ${otp}`)
    res.json("otp sent to mail")
}

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email })

    if (!user || user.otp !== otp || Date.now() > user.otpExpiry) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isOtpVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: 'OTP verified' });

}

const resetpassword = async (req, res) => {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerified) {
        return res.status(400).json({ message: "otp not verified" })
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.isOtpVerified = false;
    await user.save();

    res.json({ message: "password reset successfully" })

}

module.exports = { register, login, sendOtp, verifyOtp, resetpassword, fetch }

