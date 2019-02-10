const User = require('../models/User');

async function getAll() {
    return await User.find({});
}

async function getById(id) {
    return await User.findById(id);
}

async function addTeam(user, teamId) {
    user.teams.push(teamId);
    return await user.save();
}

async function getByUserId(userId) {
    return await User.findById(userId)
        .populate({
            path: 'teams',
            populate: {
                path: 'projects',
                model: 'Project'
            }
        });
}

async function leaveTeam(user, teamId) {
    let index = user.teams.indexOf(teamId);

    if (index === -1) {
        throw new Error('User team missing.');
    }

    user.teams.splice(index, 1);
    return await user.save();
}

module.exports = {
    getAll,
    getById,
    addTeam,
    getByUserId,
    leaveTeam
};