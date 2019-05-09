const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: mongoose.Schema.Types.String, required: true, unique: true },
    description: { type: mongoose.Schema.Types.String, required: true, maxlength: 50 },
    imageUrl: { type: mongoose.Schema.Types.String, required: true },
    isPublic: { type: mongoose.Schema.Types.Boolean, default: false },
    lectures: [{ type: mongoose.Schema.ObjectId, ref: 'Lecture' }],
    usersEnrolled: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
