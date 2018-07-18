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
        const { User } = models;
    }));

    return router;
}

module.exports = role;