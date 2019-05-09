const Course = require('mongoose').model('Course');

module.exports = {
    index: async (req, res) => {
        if (req.user && req.user.roles.indexOf('Admin') !== -1) {
            res.redirect('/home/admin');
            return;
        }

        if (req.user) {
            res.redirect('/home/user');
            return;
        }

        try {
            const top3 = await Course.find()
                .where('isPublic').equals(true)
                .sort({'usersEnrolled': -1})
                .limit(3);
            res.render('home/index', { courses: top3 });
        }
        catch (e) {
            console.log(e);
        }
    },
    homeAdmin: async (req, res) => {
        try {
            const courses = await Course.find({});
            res.render('home/admin', { courses });
        } catch (err) {
            res.redirect('/');
        }
    },
    homeUser: async (req, res) => {
        const { search } = req.query;
        const obj = {};

        if (search && search !== '') {
            obj['title'] = { '$regex': search };
            obj['title']['$options'] = 'i';
        }

        try {
            const courses = await Course.find(obj)
                .where('isPublic').equals(true);
            
            res.render('home/user', { courses, search });
        } catch (err) {
            res.redirect('/');
        }
    }
};