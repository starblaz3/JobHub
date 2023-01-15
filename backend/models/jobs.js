const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    nameRec: {
        type: String,
        required: true
    },
    emailRec: {
        type: String,
        required: true
    },
    ratingJob: {
        type: Number,
        default:0
    },
    ratingDen:{
        type: Number,
        default:0
    },
    salary:{
        type: Number,
        required: true
    },
    applicationsAllowed: {
        type: Number,
        required: true
    },
    applicationsFilled: {
        type:Number,
        default:0
    },
    positionsAvail:{
        type: Number,
        required: true
    },
    numAppAccepted:{
        type: Number,
        default: 0
    },
    recID:{
        type:String
    },
    duration:{
        type: Number,
        required: true
    },
    datePost: {
        type: Date,
        default: new Date()
    },
    deadline:{
        type: Date
    },
    typeJob:{
        type: String
    },
    skills : [String],
    link : [{
        appID: String,
        status:{type: String, default: "applied"},
        SOP: String,
        appName: String,        
        dateApplication: {type: Date, default: new Date()},
        dateJoin: Date
    }]
})

module.exports = Jobs = mongoose.model('jobs',jobSchema);