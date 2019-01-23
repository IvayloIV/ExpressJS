module.exports = {
    isAuthed: (req, res, next) => {
        if (req.isAuthenticated()) {
            next();
        } else {
            req.session.message = 'First you must login!';
            res.redirect('/user/login');
        }
    },
    hasRole: (role) => (req, res, next) => {
        if (req.isAuthenticated() && req.user.role === role) {
            next();
        } else {
            req.session.message = 'You are not admin!';
            res.redirect('/user/login');
        }
    }
}