const express = require("express");
const user = require("../controller/userController");
const upload = require("../middleware/multer");
const router = express.Router();

router.get("/fetch",user.fetch)
router.post("/register",upload.single('image'), user.register);
router.post("/login", user.login)
router.post("/sendotp", user.sendOtp)
router.post("/verifyotp",user.verifyOtp)
router.post("/resetpassword",user.resetpassword)

module.exports = router;