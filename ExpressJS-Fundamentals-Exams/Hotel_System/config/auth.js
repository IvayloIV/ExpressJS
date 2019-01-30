module.exports = {
    isAuthed: (req, res, next) => {
        if (req.isAuthenticated()) {
            next();
        } else {
            req.session.message = 'First you must login!';
            res.redirect('/loginRegister');
        }
    },
    hasRole: (role) => (req, res, next) => {
        if (req.isAuthenticated() &&
            req.user.roles.indexOf(role) > -1) {
            next();
        } else {
            req.session.message = 'You are not admin!';
            res.redirect('/loginRegister');
        }
    },
    isAnonymous: (req, res, next) => {
        if (!req.isAuthenticated()) {
            next();
        } else {
            req.session.message = 'You are logged!';
            res.redirect('/');
        }
    }
};