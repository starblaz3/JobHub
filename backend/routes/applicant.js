const express = require('express');
const router = express.Router();
const validator = require('validator');

const applicant = require("../models/applicant");
const recruiter = require("../models/recruiter");
const jobs = require("../models/jobs");
//validate email here and have to test cascading
router.patch("/:email/profile", async (req, res) => {
    try {   
        if(!(validator.isEmail(req.body.emailID)))         
        {
            throw "invalid email"
        }
        const updateApp = await applicant.updateOne({emailID: req.params.email},{            
            username: req.body.username,
            emailID: req.body.emailID,
            lang : req.body.lang,
            education: req.body.education
        });        
        const updateJobs= await jobs.updateOne({"link.appID":req.body.id},{"link.$.appName":req.body.username});
        res.status(200).json("updated applicant"+req.body.username);
    }
    catch (err) {
        console.log(err);
        res.status(500);
    }
});
router.get("/:email/profile", async(req,res) => {
    try{                
        const appDet = await applicant.findOne({emailID:req.params.email});
        console.log(appDet);
        res.status(200).json(appDet);
    }
    catch(err){
        res.status(500);
        console.log(err);
    }
});
router.get("/:id/dashboard", async (req,res) => {
    try{
        const allJobs = await jobs.find();
        var timeNow=new Date();
        var finalJobs=[];
        for(var i=0;i<allJobs.length;i++)
        {
            if((allJobs[i].positionsAvail>allJobs[i].numAppAccepted) && (allJobs[i].applicationsAllowed>allJobs[i].applicationsFilled) && (allJobs[i].deadline.getTime() > timeNow.getTime())){
                finalJobs.push(allJobs[i]);
            }
        }
        res.status(200).json(finalJobs);
    }
    catch(err){
        console.log(err);
        res.status(500);
    }
});
//part of it is untested
router.post("/:appID/dashboard/:jobID", async (req,res) => {
    try{
        const checker = await applicant.findOne({_id:req.params.appID});        
        var count=0;
        //only this part is untested
        for(var i =0; i<checker.job.length;i++)
        {
            if(checker.job[i].status=="applied" || checker.job[i].status=="short")
            {                
                count++;
            }
            if(checker.job[i].status=="accepted" || (checker.job[i].jobID.toString())==(req.params.jobID.toString())){                
                throw "he just cant apply!!";
            }
        }                
        if(count<=10)
        {            
            const jobDb= await jobs.updateOne(
                {_id: req.params.jobID},
                {
                    $push: {
                        link: {
                            appID: req.params.appID.toString(),
                            status: "applied",
                            SOP: req.body.SOP,
                            appName: checker.username
                        }
                    }
                }
            );            
            const appDb = await applicant.updateOne({_id:req.params.appID},{
                $push:{
                    job: {
                        jobID:req.params.jobID.toString(),
                        status:"applied",
                        SOP:req.body.SOP
                    }
                }                
            });
            res.status(200).json("application sent");
        }
        else
        {
            res.status(200).json("count is greater than 10");
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});
//works!!
router.get("/:id/myApplications", async (req,res) => {
    try{
        const appJobs= await applicant.findOne({_id:req.params.id});
        const jobList = await jobs.find();        
        var finalJobs=[];        
        for (var i=0;i < appJobs.job.length; i++)
        {
            var temp=appJobs.job[i].jobID.toString();
            for(var j=0;j< jobList.length; j++)
            {
                if((jobList[j]._id.toString())==temp)
                {
                    finalJobs.push(jobList[j]);
                    break;
                }
            }
        }        
        console.log(jobList[0]);
        res.status(200).json(finalJobs);
    }
    catch(err){
        res.status(500).json(err);
    }
});
//need to write rating route
router.post("/:id/myApplications/:jobId",async (req,res) => {
    try{
        if(req.body.rating < 0)
        {
            throw "cant be negative";
        }
        const x=await jobs.findOne({_id:req.params.jobId});
        var rating=(x.ratingJob*x.ratingDen+req.body.rating)/(x.ratingDen+1);
        var denom=x.ratingDen+1;
        const updateRating= await jobs.updateOne({_id:req.params.jobId},{
            ratingJob:rating,
            ratingDen:denom
        });
        res.status(200).json(updateRating);
    }catch(err){
        console.log(err);
        res.status(500);}
});
module.exports = router;