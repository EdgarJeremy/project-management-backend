/**
* File : ./routes/role.js 
* Tanggal Dibuat : 2018-7-18 19:09:38
* Penulis : zero
*/
import { onlyAuth, onlyManager } from "../middlewares/validator/auth";
import { requiredPost } from "../middlewares/validator/request_fields";
import { a } from "../middlewares/wrapper/request_wrapper";


function role(app, models, socketListener) {
    let router = app.get("express").Router();
    router.use(onlyAuth());
    router.use(onlyManager());

    /**
     * Router disini..
     */
    router.get('/index', a(async (req, res) => {
        const { limit = 30, offset = 0 } = req.query;
        const { Role } = models;
        let roles = await Role.findAndCountAll({
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10)
        });
        res.setStatus(res.OK);
        res.setData(roles);
        res.go();
    }));

    router.get('/show/:id', a(async (req, res) => {
        const { id } = req.params;
        const { Role } = models;
        let role = await Role.findOne({ where: { id } });
        if (role) {
            res.setStatus(res.OK);
            res.setData(role);
            res.go();
        } else {
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Role tidak ditemukan');
            res.go();
        }
    }));

    router.post('/create', requiredPost(['name', 'description']), a(async (req, res) => {
        const { body } = req;
        const { Role } = models;
        let newRole = await Role.create(body, { fields: ['name', 'description'] });
        if (newRole) {
            res.setStatus(res.OK);
            res.setData(newRole);
            res.go();
        } else {
            res.status(500);
            res.setStatus(res.GAGAL);
            res.setMessage('Terjadi kesalahan saat menyimpan role');
            res.go();
        }
    }));

    router.put('/update/:id', requiredPost(['name', 'description']), a(async (req, res) => {
        const { body } = req;
        const { id } = req.params;
        const { Role } = models;
        let role = await Role.findOne({ where: { id } });
        if (role) {
            let updated = await role.update(body, { fields: ['name', 'description'] });
            res.setStatus(res.OK);
            res.setData(updated);
            res.go();
        } else {
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Role tidak ditemukan');
            res.go();
        }
    }));

    router.delete('/destroy/:id', a(async(req, res)=>{
        const { id } = req.params;
        const { Role } = models;
        let role = await Role.findOne({ where: { id }});
        if(role) {
            let deleted = await role.destroy();
            res.setStatus(res.OK);
            res.setData(deleted);
            res.go();
        } else {
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Role tidak ditemukan');
            res.go();
        }
    }));

    return router;
}

module.exports = role;