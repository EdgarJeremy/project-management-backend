import os from "os";
import { folders } from "../../config.json";

export default (route) => {

    return `/**
* File : ./${folders.routes}/${route}.js 
* Tanggal Dibuat : ${(new Date()).toLocaleString()}
* Penulis : ${os.userInfo().username}
*/

function ${route}(app, models, socketListener) {
    let router = app.get("express").Router();

    /**
     * Router disini..
     */
    router.get("/index", (req, res) => {
        res.setStatus(res.OK);
        res.setData({});
        res.go();
    });

    return router;
}

module.exports = ${route};`;

};