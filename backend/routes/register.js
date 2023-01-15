const express = require('express');
const { findOne } = require('../models/applicant');
const router = express.Router();
const validator = require('validator');

const applicant = require("../models/applicant");
const recruiter = require("../models/recruiter");
//add validation here (validate email if email format and check if email already exists)
router.post("/", async (req, res) => {
    try {
        if (req.body.type == "applicant") {
            const checker = await applicant.findOne({emailID:req.body.emailID});
            console.log(checker);
            if(checker!=null || !(validator.isEmail(req.body.emailID)))
            {                
                throw "invalid email";
            }            
            const newApp = new applicant({
                username: req.body.username,
                emailID: req.body.emailID,
                password: req.body.password,
                lang: req.body.lang,
                education: req.body.education
            });            
            const nothing=await newApp.save();
            res.status(200).json("applicant added");     
        }
        else {
            const checker = await recruiter.findOne({recEmail:req.body.recEmail});
            if(checker!=null || !(validator.isEmail(req.body.recEmail)))
            {
                throw "invalid email";
            }
            const newRec = new recruiter({
                recName: req.body.recName,
                recEmail: req.body.recEmail,
                password: req.body.password,
                contactNo: req.body.contactNo,
                bio: req.body.bio
            });
            const nothingx=await newRec.save();
            res.status(200).json("recruiter added");
        }
    }
    catch (err) {
        console.log(err);
        res.status(500);
    }
});
module.exports = router;