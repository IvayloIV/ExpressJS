const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
    title: { type: mongoose.Schema.Types.String, required: true },
    videoUrl: { type: mongoose.Schema.Types.String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }
});

const Lecture = mongoose.model('Lecture', lectureSchema);

module.exports = Lecture;
