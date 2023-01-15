const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recSchema = new Schema({
    recName: {
        type: String,
        required: true
    },
    recEmail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    contactNo: {
        type: Number,
        required: true
    },
    bio: String,
    jobID: [String]
})

module.exports = Recruiter = mongoose.model('recruiter',recSchema);