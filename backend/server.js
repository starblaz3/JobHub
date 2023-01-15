const express= require('express');
const mongoose = require('mongoose');
const cors= require('cors');
require('dotenv').config();
const app= express();
app.use(express.json());
const port= process.env.PORT || 5000;
const db = require('./config/keys').mongoURI;

//routes

const login = require('./routes/login');
const register = require('./routes/register');
const applicant= require('./routes/applicant');
const recruiter = require ('./routes/recruiter');

//mongoDB

mongoose
.connect(db,{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("mongo connected"))
.catch(err => console.log(err));

//middleware

app.use("/api/login",login);
app.use("/api/register",register);
app.use("/api/applicant",applicant);
app.use("/api/recruiter",recruiter);

app.get("/",(req,res) => {
    res.send("hello");
});

//port 

app.listen(port,() => {
    console.log(`server is running on port : ${port}`);
});