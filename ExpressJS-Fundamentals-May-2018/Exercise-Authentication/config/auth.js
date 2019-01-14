module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            next();
        } else {
            req.session.message = 'You must login first!';
            res.redirect('/users/login');
        }
    },
    isInRole: (role) => {
        return (req, res, next) => {
            if (req.user && req.user.roles.indexOf(role) > -1) {
                next();
            } else {
                req.session.message = 'You are not admin!';
                res.redirect('/');
            }
        };
    }
};