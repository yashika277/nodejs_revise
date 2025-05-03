let mongoose = require("mongoose");

let dbConnect = () => {
    mongoose.connect(process.env.DB_URL)
        .then(() => {
            console.log("db connected");
        })
        .catch((err) => {
            console.log(err, "err");

        })
}
module.exports = dbConnect