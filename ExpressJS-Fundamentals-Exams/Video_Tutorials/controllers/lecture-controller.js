const Lecture = require('mongoose').model('Lecture');
const Course = require('mongoose').model('Course');
const User = require('mongoose').model('User');

module.exports = {
    lectureCreatePost: async (req, res) => {
        const courseId = req.params['id'];
        const body = req.body;

        try {
            const newLecture = await Lecture.create({
                title: body.title,
                videoUrl: body.videoUrl,
                course: courseId
            });

            let course = await Course.findById(courseId);
            course.lectures.push(newLecture);
            await course.save();

            res.redirect(`/course/planer/${courseId}`);
        } catch (err) {
            res.redirect('/');
        }
    },
    removeLecture: async (req, res) => {
        const lectureId = req.params['id'];

        try {
            const lecture = await Lecture.findById(lectureId);

            let course = await Course.findById(lecture.course);
            const indexLecture = course.lectures.indexOf(lecture.id);
            course.lectures.splice(indexLecture , 1);
            await course.save();

            await Lecture.findByIdAndDelete(lectureId);
            req.session.message = 'Removed successful.';
            res.redirect(`/course/planer/${course._id}`);
        } catch (err) {
            req.redirect('/');
        }
    },
    playVideo: async (req, res) => {
        const lectureId = req.params['id'];
        const userId = req.user._id;
        
        try {
            const lecture = await Lecture.findById(lectureId);
            const user = await User.findById(userId);
            const course = await Course.findById(lecture.course)
            .populate('lectures');
            
            if (!course.isPublic) {
                req.session.message = 'Course is not public.';
                res.redirect('/');
                return;
            }
            
            if (course.usersEnrolled.indexOf(user._id) === -1) {
                req.session.message = 'First you must enroll for the course.';
                res.redirect('/');
                return;
            }

            res.render('lecture/play-video', { lecture, lectures: course.lectures });
        } catch (err) {
            res.redirect('/');
        }
    }
};