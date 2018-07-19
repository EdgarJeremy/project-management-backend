/**
* File : ./routes/job.js 
* Tanggal Dibuat : 2018-7-18 21:02:54
* Penulis : zero
*/
import { onlyAuth } from "../middlewares/validator/auth";
import { a } from "../middlewares/wrapper/request_wrapper";
import { requiredPost, requiredGet } from "../middlewares/validator/request_fields";

function job(app, models, socketListener) {
    let router = app.get("express").Router();
    router.use(onlyAuth());

    /**
     * Router disini..
     */
    router.get('/index', requiredGet(['project_id']), a(async (req, res) => {
        const { limit = 30, offset = 0, project_id } = req.query;
        const { Job, Project } = models;
        const { id: user_id } = req.user;

        let project = await Project.findOne({ where: { id: parseInt(project_id, 10) } });

        if (project) {
            let participant = await project.getParticipants({ where: { user_id } });
            if (participant.length > 0) {
                let jobs = await Job.findAndCountAll({
                    order: ['name'],
                    where: { participant_id: participant[0].id },
                    limit: parseInt(limit, 10),
                    offset: parseInt(offset, 10)
                });
                res.setStatus(res.OK);
                res.setData(jobs);
                res.go();
            } else {
                res.status(404);
                res.setStatus(res.GAGAL);
                res.setMessage('Anda tidak terdaftar di project ini');
                res.go();
            }
        } else {
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Project tidak ditemukan');
            res.go();
        }

    }));

    router.get('/show/:id', a(async (req, res) => {
        const { id } = req.params;
        const { Job } = models;
        let job = await Job.findOne({ where: { id } });
        if (job) {
            res.setStatus(res.OK);
            res.setData(job);
            res.go();
        } else {
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Job tidak ditemukan');
            res.go();
        }
    }));

    router.post('/create', requiredPost(['project_id', 'name', 'description', 'start', 'finish']), a(async (req, res) => {
        let { body } = req;
        const { Job, Participant } = models;
        const { id: user_id } = req.user;
        body = { ...body };
        const { project_id } = body;
        let participant = await Participant.findOne({ where: { project_id, user_id } });
        let job = await Job.create({
            participant_id: participant.id,
            ...body
        }, { fields: ['name', 'description', 'start', 'finish', 'participant_id'] });

        if (job) {
            res.setStatus(res.OK);
            res.setData(job);
            res.go();
        } else {
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Terjadi kesalahan saat menyimpan job');
            res.go();
        }
    }));

    router.put('/update/:id', requiredPost(['name', 'description', 'start', 'finish']), a(async (req, res) => {
        let { body } = req;
        const { id } = req.params;
        const { Job } = models;
        let job = await Job.findOne({ where: { id } });
        if (job) {
            let updated = await job.update(body, { fields: ['name', 'description', 'start', 'finish'] });
            res.setStatus(res.OK);
            res.setData(updated);
            res.go();
        } else {
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Job tidak ditemukan');
            res.go();
        }
    }));

    router.delete('/destroy/:id', a(async (req, res) => {
        const { id } = req.params;
        const { Job } = models;
        let job = await Job.findOne({ where: { id } });
        if(job) {
            let deleted = await job.destroy();
            res.setStatus(res.OK);
            res.setData(deleted);
            res.go();
        } else {
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('User tidak ditemukan');
            res.go();
        }
    }));

    return router;
}

module.exports = job;