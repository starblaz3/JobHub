const express = require('express');
const router = express.Router();

const applicant = require("../models/applicant");
const recruiter = require("../models/recruiter");

router.post("/", async (req, res) => {
    try {
        if (req.body.type == "recruiter") {
            const email = await recruiter.findOne({ recEmail: req.body.recEmail });
            if (email.password == req.body.password) {
                res.status(200).json({body:"true",id:email._id});
            }
            else {
                res.status(200).json({body:"yeet him"});
            }
        }
        else {
            const email = await applicant.findOne({emailID: req.body.emailID});
            if(email.password == req.body.password){
                res.status(200).json({body:"true",id:email._id});
            } 
            else{
                res.status(200).json({body:"yeet him"});
            }
        }
    }
    catch(err){
        console.log(err);
        res.status(500);
    }
});
module.exports = router;