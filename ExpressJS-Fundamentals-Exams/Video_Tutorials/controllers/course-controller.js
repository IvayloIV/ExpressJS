const Course = require('mongoose').model('Course');
const User = require('mongoose').model('User');

module.exports = {
    createCourseGet: (req, res) => {
        res.render('course/create');
    },
    createCoursePost: async (req, res) => {
        const body = req.body;
        
        try {
            await Course.create({
                title: body.title,
                description: body.description,
                imageUrl: body.imageUrl,
                isPublic: body.isPublic === 'on'
            });

            req.session.message = 'Successful created.';
            res.redirect('/');
        } catch (e) {
            res.render('course/create', { message: e.message });
        }
    },
    editCourseGet: async (req, res) => {
        const id = req.params['id'];

        try {
            const course = await Course.findById(id);
            if (!course) {
                req.session.message = 'Course not exist.';
                res.render('/');
                return;
            }

            res.render('course/edit', course);
        } catch (err) {
            req.session.message = err;
            res.redirect('/');
        }
    },
    editCoursePost: async (req, res) => {
        const id = req.params['id'];
        const body = req.body;
        
        try {
            let course = await Course.findById(id);

            if (!course) {
                req.session.message = 'Course not exist.';
                res.redirect('/');
                return;
            }

            course.title = body.title;
            course.description = body.description;
            course.imageUrl = body.imageUrl;
            course.isPublic = body.isPublic === 'on';
            await course.save();

            req.session.message = 'Successful edited!';
            res.redirect('/');
        } catch (e) {
            res.render('/', { message: e.message });
        }
    },
    lecturePanel: async (req, res) => {
        const courseId = req.params['id'];

        try {
            const course = await Course.findById(courseId)
                .populate('lectures');

            if (!course) {
                req.session.message = 'Course not exist.';
                res.redirect('/');
                return;
            }  
            
            res.render('course/panel', { course });
        } catch (err) {
            res.redirect('/', { message: err });
        }
    },
    courseDetails: async (req, res) => {
        const courseId = req.params['id'];

        try {
            const course = await Course.findById(courseId)
                .populate('lectures');

            const isEnrolled = course.usersEnrolled.indexOf(req.user.id) !== -1;
            res.render('course/details', { course, isEnrolled });
        } catch (err) {
            res.redirect('/');
        }
    },
    enroll: async (req, res) => {
        const courseId = req.params['id'];
        const userId = req.user.id;

        try {
            const course = await Course.findById(courseId);
            course.usersEnrolled.push(userId);
            await course.save();

            const user = await User.findById(userId);
            user.enrolledCourses.push(course._id);
            await user.save();

            res.redirect(`/course/details/${courseId}`);
        } catch (err) {
            res.redirect('/');
        }
    }
};