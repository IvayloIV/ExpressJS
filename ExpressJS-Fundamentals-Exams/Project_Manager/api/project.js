const Project = require('../models/Project');

async function create(body) {
    return await Project.create(body);
}

async function getWithoutTeam() {
    return await Project.find({})
        .where('team').equals(undefined);
}

async function getById(projectId) {
    return await Project.findById(projectId);
}

async function manage(projectId, teamId) {
    let project = await getById(projectId);
    project.team = teamId;
    return await project.save();
}

async function getAll(name) {
    let obj = {};

    if (name && name !== '') {
        obj['name'] = { '$regex': name };
        obj['name']['$options'] = 'i';
    }

    return await Project.find(obj)
        .populate('team');
}

module.exports = {
    create,
    getWithoutTeam,
    manage,
    getAll
};