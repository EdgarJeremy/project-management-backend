/**
* File : ./routes/project.js 
* Tanggal Dibuat : 2018-7-18 01:54:18
* Penulis : zero
*/
import { onlyAuth } from "../middlewares/validator/auth";
import { requiredPost } from "../middlewares/validator/request_fields";
import { a } from "../middlewares/wrapper/request_wrapper";

function project(app, models, socketListener) {
    let router = app.get("express").Router();
    router.use(onlyAuth());

    /**
     * Router disini..
     */
    router.get('/index', a(async (req, res) => {
        const { limit = 30, offset = 0 } = req.query;
        const { Project, Participant, User, Role, Requirement } = models;
        const { user } = req;
        let projects = [];
        if (user.type === 'manager') {
            projects = await Project.findAndCountAll({
                where: { user_id: user.id },
                include: [{
                    model: Participant,
                    include: [
                        { model: User, attributes: { exclude: ['password'] } },
                        { model: Role }
                    ]
                }, {
                    model: User,
                    attributes: { exclude: ['password'] }
                }, {
                    model: Requirement
                }],
                order: ['deadline'],
                limit: parseInt(limit, 10),
                offset: parseInt(offset, 10)
            });
        } else if(user.type === 'employee') {
            projects = await Project.findAndCountAll({
                include: [{
                    model: Participant,
                    where: { user_id: user.id },
                    include: [
                        { model: User, attributes: { exclude: ['password'] } },
                        { model: Role }
                    ]
                }, {
                    model: User,
                    attributes: { exclude: ['password'] }
                }, {
                    model: Requirement
                }],
                order: ['deadline'],
                limit: parseInt(limit, 10),
                offset: parseInt(offset, 10)
            })
        }
        
        res.setStatus(res.OK);
        res.setData(projects);
        res.go();
    }));

    router.get('/show/:id', a(async (req, res) => {
        const { id } = req.params;
        const { Project, Participant, User, Role } = models;
        const { id: user_id } = req.user;

        let project = await Project.findOne({
            where: { id, user_id },
            include: [{
                model: Participant,
                include: [
                    { model: User, attributes: { exclude: ['password'] } },
                    { model: Role }
                ]
            }, {
                model: User,
                attributes: { exclude: ['password'] }
            }],
        });
        if (project) {
            res.setStatus(res.OK);
            res.setData(project);
            res.go();
        } else {
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Project tidak ditemukan');
            res.go();
        }
    }));

    router.post('/create', requiredPost(['name', 'deadline', 'participants']), a(async (req, res) => {
        const { body } = req;
        const { Project, Participant, Requirement } = models;
        const { participants, requirements } = body;
        if (Array.isArray(participants)) {
            if (participants.length > 0) {
                body.user_id = req.user.id;
                let newProject = await Project.create(body,
                    { fields: ['name', 'description', 'deadline', 'user_id'] }
                );
                let newParticipants = [];
                participants.forEach(async (participant) => {
                    newParticipants.push(await Participant.create({
                        project_id: newProject.id,
                        user_id: participant.user_id,
                        role_id: participant.role_id
                    }));
                });
                if (Array.isArray(requirements)) {
                    let newRequirements = [];
                    requirements.forEach(async (requirement) => {
                        newRequirements.push(await Requirement.create({
                            name: requirement.name,
                            description: requirement.description,
                            project_id: newProject.id
                        }));
                    });
                }
                res.setStatus(res.OK);
                res.setData(newProject);
                res.go();
            } else {
                res.status(400);
                res.setStatus(res.GAGAL);
                res.setMessage('Sertakan peserta project (a)');
                res.go();
            }
        } else {
            res.status(400);
            res.setStatus(res.GAGAL);
            res.setMessage('Sertakan peserta project (b)');
            res.go();
        }
    }));

    router.put('/update/:id', requiredPost(['name', 'deadline']), a(async (req, res) => {
        const { body } = req;
        const { id } = req.params;
        const { Project } = models;
        const { id: user_id } = req.user;
        let project = await Project.findOne({ where: { id, user_id: user_id } });
        if (project) {
            let updated = await project.update(body, { fields: ['name', 'description', 'deadline'] });
            res.setStatus(res.OK);
            res.setData(updated);
            res.go();
        } else {
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Project tidak ditemukan');
            res.go();
        }
    }));

    router.delete('/destroy/:id', a(async (req, res) => {
        const { id } = req.params;
        const { id: user_id } = req.user;
        const { Project } = models;

        let project = await Project.findOne({ where: { id, user_id } });
        if (project) {
            let deleted = await project.destroy();
            res.setStatus(res.OK);
            res.setData(deleted);
            res.go();
        } else {
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Project tidak ditemukan');
            res.go();
        }
    }));

    return router;
}

module.exports = project;