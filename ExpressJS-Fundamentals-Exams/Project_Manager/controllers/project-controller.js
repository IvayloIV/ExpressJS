const apiProject = require('../api/project');
const apiTeam = require('../api/team');

module.exports = {
    createGet: async (req, res) => {
        res.render('project/create');
    },
    createPost: async (req, res) => {
        const body = req.body;

        try {
            await apiProject.create({
                name: body.name,
                description: body.description
            });
            req.session.message = 'Project created successful.';
            res.redirect('/');
        } catch (err) {
            console.log(err);
            body.message = err;
            res.render('project/create', body);
        }
    },
    manageGet: async (req, res) => {
        try {
            const teams = await apiTeam.getAll();
            const projects = await apiProject.getWithoutTeam();

            res.render('project/manage', { teams, projects });
        } catch (err) {
            console.log(err);
        }
    },
    managePost: async (req, res) => {
        const {project, team} = req.body;

        try {
            await apiProject.manage(project, team);
            await apiTeam.addProject(team, project);

            req.session.message = 'Project managed.';
            res.redirect('/');
        } catch (err) {
            console.log(err);
            req.session.message = err;
            res.redirect('/project/manage');
        }
    },
    userProjects: async (req, res) => {
        const { name } = req.query;

        try {
            const projects = await apiProject.getAll(name);
            res.render('project/all', { projects, name });
        } catch (err) {
            console.log(err);
        }
    }
};