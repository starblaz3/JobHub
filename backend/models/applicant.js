const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appSchema = new Schema({
    username : {
        type: String,
        required: true
    },
    emailID: {
        type: String,
        required: true,
        unique: true
    },
    rating: {
        type: Number,
        default:0
    },
    password: {
        type: String,
        required: true
    },
    ratingDen: {
        type: Number,
        default:0
    },
    accepted: String,
    lang: [String],
    education:[{name:String,startYear: Number}],
    job: [{jobID: String, status: String, SOP:String}] 
})

module.exports = Applicant = mongoose.model('applicant',appSchema);