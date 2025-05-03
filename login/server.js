require("dotenv").config();
const http = require("http");
const express = require("express")
const mongoose = require("mongoose");
const dbConnect = require("./db/dbConnect");
const userRoute=require("./routes/userRoute")

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use('/uploads', express.static('uploads'));

app.use("/api/auth",userRoute)

dbConnect();

http.createServer(app).listen(process.env.PORT,()=>{
    console.log(`server started on port no ${process.env.PORT}`);
    
})