const nodemailer = require("nodemailer")

const sendMail = async (to, text) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });
    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to,
        subject: 'OTP Verification',
        text
    })
}

module.exports = sendMail