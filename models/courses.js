const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    cname: {
        type: String,
        required: true
    },
    cdescription: {
        type: String,
        required: true
    },
    clink: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

const Course = mongoose.model('courses', courseSchema);
module.exports = Course;