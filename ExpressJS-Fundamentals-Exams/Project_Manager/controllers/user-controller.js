const encryption = require('../util/encryption');
const User = require('mongoose').model('User');
const apiUser = require('../api/user');
const apiTeam = require('../api/team');

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },
    registerPost: async (req, res) => {
        const reqUser = req.body;
        if (!reqUser.password) {
            res.render('user/register', { user: reqUser, message: 'Please fill all fields' });
            return;
        }

        const salt = encryption.generateSalt();
        const hashedPass =
            encryption.generateHashedPassword(salt, reqUser.password);

        try {
            const user = await User.create({
                username: reqUser.username,
                profilePicture: reqUser.profilePicture,
                hashedPass,
                salt,
                firstName: reqUser.firstName,
                lastName: reqUser.lastName,
                roles: ['User']
            });
            req.logIn(user, (err, user) => {
                if (err) {
                    res.render('user/register', { user: reqUser, message: err });
                } else {
                    req.session.message = 'Successful register!';
                    res.redirect('/');
                }
            });
        } catch (e) {
            res.render('user/register', { user: reqUser, message: e.message });
        }
    },
    logout: (req, res) => {
        req.logout();
        req.session.message = 'Successful logout!';
        res.redirect('/');
    },
    loginGet: (req, res) => {
        res.render('user/login');
    },
    loginPost: async (req, res) => {
        const reqUser = req.body;
        try {
            const user = await User.findOne({ username: reqUser.username });
            if (!user) {
                errorHandler('Invalid user data');
                return;
            }
            if (!user.authenticate(reqUser.password)) {
                errorHandler('Invalid user data');
                return;
            }
            req.logIn(user, (err, user) => {
                if (err) {
                    errorHandler(err);
                } else {
                    req.session.message = 'Successful login!';
                    res.redirect('/');
                }
            });
        } catch (e) {
            errorHandler(e);
        }

        function errorHandler(error) {
            res.render('user/login', { user: reqUser, message: error });
        }
    },
    myProfile: async (req, res) => {
        const userId = req.user._id;

        try {
            const user = await apiUser.getByUserId(userId);
            let projects = [];

            for (let team of user.teams) {
                for (let project of team.projects) {
                    projects.push(project);
                }
            }

            res.render('user/profile', {
                teams: user.teams,
                imageUser: user.profilePicture,
                projects
            });
        } catch (err) {
            console.log(err);
        }
    },
    leaveTeam: async (req, res) => {
        const teamId = req.params.id;
        const userId = req.user._id;

        try {
            await apiUser.leaveTeam(req.user, teamId);
            await apiTeam.userLeave(teamId, userId);
            
            req.session.message = 'Leaved successful.';
            res.redirect('/user/my');
        } catch (err) {
            console.log(err);
            req.session.message = err;
            res.redirect('/user/my');
        }
    }
};