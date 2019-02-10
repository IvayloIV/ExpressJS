const Team = require('../models/Team');

async function create(body) {
    return await Team.create(body);
}

async function getAll() {
    return await Team.find({});
}

async function getById(id) {
    return await Team.findById(id);
}

async function addMember(team, userId) {
    team.members.push(userId);
    return await team.save();
}

async function addProject(teamId, projectId) {
    let team = await getById(teamId);
    team.projects.push(projectId);
    return await team.save();
}

async function getAllPopulated(name) {
    const obj = {};

    if (name && name !== '') {
        obj['name'] = { '$regex': name };
        obj['name']['$options'] = 'i';
    }

    return await Team.find(obj)
        .populate('projects')
        .populate('members');
}

async function userLeave(teamId, userId) {
    let team = await getById(teamId);
    let index = team.members.indexOf(userId);

    if (index === -1) {
        throw new Error('User missing in team.');
    }

    team.members.splice(index, 1);
    return await team.save();
}

module.exports = {
    create,
    getAll,
    getById,
    addMember,
    addProject,
    getAllPopulated,
    userLeave
};