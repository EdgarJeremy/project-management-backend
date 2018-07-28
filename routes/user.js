/**
* File : ./routes/user.js 
* Tanggal Dibuat : 2018-7-18 01:50:20
* Penulis : zero
*/
import { onlyAuth, onlyManager } from "../middlewares/validator/auth";
import { requiredPost } from "../middlewares/validator/request_fields";
import { a } from "../middlewares/wrapper/request_wrapper";
import { encryption } from "../config.json";
import bcrypt from "bcrypt";

function user(app, models, socketListener) {
    let router = app.get("express").Router();
    router.use(onlyAuth());
    router.use(onlyManager());

    /**
     * Router disini..
     */
    router.get('/index', a(async (req, res) => {
        const { limit = 30, offset = 0 } = req.query;
        const { User } = models;
        const { not } = models.Sequelize.Op;
        const { user } = req;
        let where = {};
        if(user.type === 'manager') {
            where = {
                id: {
                    [not]: user.id
                },
                type: 'employee'
            }
        }
        let users = await User.findAndCountAll({
            attributes: { exclude: ['password'] },
            order: ['name'],
            where,
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10)
        });
        res.setStatus(res.OK);
        res.setData(users);
        res.go();
    }));

    router.get('/show/:id', a(async (req, res) => {
        const { id } = req.params;
        const { User } = models;
        let user = await User.findOne({ where: { id }, attributes: { exclude: ['password'] } });
        if (user) {
            res.setStatus(res.OK);
            res.setData(user);
            res.go();
        } else {
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('User tidak ditemukan');
            res.go();
        }
    }));

    router.post('/create', requiredPost(['name', 'username', 'password', 'type']), a(async (req, res) => {
        let { body } = req;
        const { salt_rounds } = encryption;
        const { User } = models;
        body = { ...body };
        body.password = bcrypt.hashSync(body.password, salt_rounds);
        let newUser = await User.create(body, { fields: ['name', 'username', 'password', 'type'] });
        if (newUser) {
            res.setStatus(res.OK);
            res.setData(newUser);
            res.go();
        } else {
            res.status(500);
            res.setStatus(res.GAGAL);
            res.setMessage('Terjadi kesalahan saat menyimpan user');
            res.go();
        }
    }));

    router.put('/update/:id', requiredPost(['name', 'username', 'type']), a(async (req, res) => {
        const { body } = req;
        const { id } = req.params;
        const { User } = models;
        let user = await User.findOne({ where: { id } });
        if (user) {
            if (body.password) {
                const { salt_rounds } = encryption;
                body.password = bcrypt.hashSync(body.password, salt_rounds);
            }
            let updated = await user.update(body, { fields: ['name', 'username', 'password', 'type'] });
            res.setStatus(res.OK);
            res.setData(updated);
            res.go();
        } else {
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('User tidak ditemukan');
            res.go();
        }
    }));

    router.delete('/destroy/:id', a(async (req, res) => {
        const { id } = req.params;
        const { User } = models;
        let user = await User.findOne({ where: { id } });
        if(user) {
            let deleted = await user.destroy();
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

module.exports = user;