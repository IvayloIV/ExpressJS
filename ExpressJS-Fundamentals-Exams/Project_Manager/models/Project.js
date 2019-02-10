const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: mongoose.Schema.Types.String, required: true, unique: true },
    description: { type: mongoose.Schema.Types.String, required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
});

projectSchema.path('description').validate(function() {
    return this.description.length <= 50;
}, 'Max length of description is 50 symbols.');

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
