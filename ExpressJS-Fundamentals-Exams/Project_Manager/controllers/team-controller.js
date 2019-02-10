const apiTeam = require('../api/team');
const apiUser = require('../api/user');

module.exports = {
    createGet: async (req, res) => {
        res.render('team/create');
    },
    createPost: async (req, res) => {
        const body = req.body;

        try {
            await apiTeam.create({
                name: body.name
            });
            req.session.message = 'Team created successful.';
            res.redirect('/team/create');
        } catch (err) {
            console.log(err);
            body.message = err;
            res.render('team/create', body);
        }
    },
    manageGet: async (req, res) => {
        try {
            const teams = await apiTeam.getAll();
            const users = await apiUser.getAll();

            res.render('team/manage', { teams, users });
        } catch (err) {
            console.log(err);
        }
    },
    managePost: async (req, res) => {
        const { userId, teamId } = req.body;

        try {
            const user = await apiUser.getById(userId);
            const team = await apiTeam.getById(teamId);

            if (user.teams.indexOf(teamId) !== -1) {
                req.session.message = 'User is already in this team.';
                res.redirect('/team/manage');
                return;
            }

            await apiTeam.addMember(team, userId);
            await apiUser.addTeam(user, teamId);
            req.session.message = 'Added successful.';
            res.redirect('/');
        } catch (err) {
            console.log(err);
            req.session.message = err;
            res.redirect('/team/manage');
        }
    },
    userTeams: async (req, res) => {
        const { name } = req.query;
        try {
            const teams = await apiTeam.getAllPopulated(name);
            res.render('team/all', { teams, name });
        } catch (err) {
            console.log(err);
        }
    }
};