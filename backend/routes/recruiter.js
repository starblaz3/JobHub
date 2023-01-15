const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const applicant = require("../models/applicant");
const recruiter = require("../models/recruiter");
const jobs = require("../models/jobs");
const { findOne } = require('../models/jobs');
const validator = require('validator');
// need to validate the create job
//works
router.get("/:email/profile", async (req,res) => {
    try{
        const temp = await recruiter.findOne({recEmail:req.params.email});
        res.status(200).json(temp);
    }catch(err){
        res.status(500);
        console.log(err);
    }
});
//untested
router.patch("/:id/profile", async (req, res) => {
    try {      
        if(!(validator.isEmail(req.body.recEmail)))
        {
            throw "invalid email"
        }      
        const update = await recruiter.updateOne({_id: req.params.id},{            
            recName: req.body.recName,
            recEmail: req.body.recEmail,            
            contactNo: req.body.contactNo,
            bio: req.body.bio
        });
        //have to test multiple jobs posted by recruiter
        const updateJob = await jobs.updateMany({recID:req.params.id.toString()},{
            nameRec:req.body.recName,
            emailRec: req.body.recEmail
        });
        res.status(200).json("updated recruiter "+req.body.recName);
    }
    catch (err) {
        console.log(err);
        res.status(500);
    }
});
router.post("/:id/dashboard",async (req,res) => {
    try{
        console.log(req.body.emailRec);
        if(!(validator.isEmail(req.body.emailRec)))
        {
            throw "invalid email";
        }
        var timeNow = new Date();
        var deadlineDate=Date.parse(req.body.deadline);
        console.log(typeof deadlineDate,timeNow);
        if(deadlineDate<timeNow.getTime())
        {
            throw "invalid deadline";
        }
        const item = new jobs({
            title: req.body.title,
            nameRec: req.body.nameRec,
            emailRec: req.body.emailRec,
            salary: req.body.salary,
            applicationsAllowed: req.body.applicationsAllowed,
            positionsAvail: req.body.positionsAvail,
            recID: req.params.id,
            duration: req.body.duration,
            deadline: req.body.deadline,
            typeJob: req.body.typeJob,
            skills: req.body.skills            
        });
        const rec= await recruiter.updateOne({_id: req.params.id},
            {
                $push:{
                jobID:item._id.toString()
                }
            }
        );        
        const temp = await item.save();
        res.status(200).json(temp);
    }catch(err){
        res.status(500);
        console.log(err);
    }
});
//works...noice
router.get("/:id/active",async (req,res) => {
    try{
        var jobIds= await recruiter.findOne({_id:req.params.id});
        var jobList= await jobs.find();        
        var temp=[];
        for(var i=0;i<jobList.length;i++){
            for(var j=0;j<jobIds.jobID.length;j++){
                if((jobList[i]._id.toString())==(jobIds.jobID[j].toString())&& (jobList[i].positionsAvail-jobList[i].numAppAccepted)>0.01)
                {                    
                    temp.push(jobList[i]);
                    break;
                }
            }            
        }
        jobList=temp;
        res.status(200).json(jobList);
    } catch(err){
        console.log(err);
        res.status(500);
    }
});
//yass fucking works
router.delete("/:id/active/delete/:jobId", async (req,res) => {
    try{
        const deleted= await jobs.findOne({_id:req.params.jobId});
        var temp=[];
        for(var i=0;i<deleted.link.length;i++)
        {
            temp.push(mongoose.Types.ObjectId(deleted.link[i].appID));
        }
        const remApp = await applicant.updateMany({_id:{$in:temp}},{$pull: {job: {jobID:req.params.jobId} } });
        const remRec = await recruiter.updateOne({_id: req.params.id},{$pull: {jobID:req.params.jobId}});
        const useless= await jobs.deleteOne({_id:req.params.jobId});
        res.status(200).json("job deleted");        
    }catch(err){ 
        res.status(500); 
        console.log(err);
    }
});
//works
router.patch("/:id/active/edit/:jobId",async (req,res) =>{
    try{        
        const edited= await jobs.updateOne({_id:req.params.jobId},{
            applicationsAllowed:req.body.applicationsAllowed,
            positionsAvail: req.body.positionsAvail,
            deadline: req.body.deadline            
        });
        res.status(200).json("job edited");
    }catch(err){
        res.status(500);
        console.log(err);
    }
});
//works
router.get("/:id/active/viewApp/:jobId", async (req,res) => {
    try{
        const applicants = await applicant.find();
        var finalApp=[];
        for(var i=0;i<applicants.length;i++)
        {
            for(var j=0;j<applicants[i].job.length;j++)
            {
                if((applicants[i].job[j].jobID.toString())==(req.params.jobId.toString()) && applicants[i].job[j].status!="rejected")
                {
                    finalApp.push(applicants[i]);
                }
            }
        }
        res.status(200).json(finalApp);
    }catch(err){
        console.log(err);
        res.status(500);
    }
});
//works
router.patch("/:id/active/viewApp/:jobId/:appId", async (req,res) => {
    try{
        const updateApp = await applicant.updateOne({_id:req.params.appId,"job.jobID":req.params.jobId},{"job.$.status":req.body.status});
        if(req.body.status="accepted")
        {
            const updateJob = await jobs.updateOne({_id:req.params.jobId,"link.appID":req.params.appId},{"link.$.status":req.body.status,"link.$.dateJoin":new Date()});
        }
        else{
            const updateJob = await jobs.updateOne({_id:req.params.jobId,"link.appID":req.params.appId},{"link.$.status":req.body.status});
        }
        res.status(200).json("updated status");
    }catch(err){
        console.log(err);
        res.status(500);
    }
});
//works
router.get("/:id/accepted",async (req,res) => {
    try{
        const x= await jobs.find({recID:req.params.id,"link.status":"accepted"});
        console.log(x);
        res.status(200).json(x);
    }catch(err){
        console.log(err);
        res.status(500);
    }
});
//ofc it works
router.post("/:id/accepted/:appId",async (req,res) => {
    try{
        if(req.body.rating < 0)
        {
            throw "cant be negative";
        }
        const y= await applicant.findOne({_id:req.params.appId});
        if(y== null)
        {
            y.rating=0,
            y.ratingDen=0
        }
        console.log(y.rating);
        var ratingx,denom;
        ratingx=(((y.rating)*(y.ratingDen))+req.body.rating)/(y.ratingDen+1);
        denom= y.ratingDen +1;
        console.log(ratingx+" "+denom);
        const z= await applicant.updateOne({_id:req.params.appId},{rating:ratingx,ratingDen:denom});
        res.status(200).json(z);
    }catch(err){
        console.log(err);
        res.status(500);
    }
});
module.exports = router;