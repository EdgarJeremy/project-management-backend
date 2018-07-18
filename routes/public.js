/**
 * Api routes
 */
import bcrypt from "bcrypt";
import { requiredPost } from "../middlewares/validator/request_fields";

function api(app, models, socketListener) {
    let router = app.get("express").Router();

    /**
     * Router disini..
     */

    router.post("/login", requiredPost(["username", "password"]), async (req, res) => {
        const { User, Token } = models;
        const body = req.body;
        const user = await User.findOne({
            include: [{ model: Token }],
            where: { username: body.username },
        });
        if(user) {
            if (bcrypt.compareSync(body.password, user.password)) {
                /** Invalidate old tokens */
                req.invalidateAllToken(user);
                delete user.dataValues.tokens;
                /** Generate new tokens */
                const userToken = await req.generateUserToken(user.id);
                res.setStatus(res.OK);
                res.setData({
                    user,
                    token: userToken.token,
                    refreshToken: userToken.refreshToken
                });
                res.go();
            } else {
                res.setStatus(res.GAGAL);
                res.setMessage("Username / Password salah");
                res.go();
            }
        } else {
            res.setStatus(res.GAGAL);
            res.setMessage("Username / Password salah");
            res.go();
        }
    });

    router.get("/check", (req, res) => {
        res.setStatus(req.user ? res.OK : res.GAGAL);
        res.setData(req.user);
        res.setMessage("Session habis");
        res.go();
    });

    router.get("/logout", (req, res) => {
        if(req.user)
            req.invalidateAllToken(req.user);
        res.set("Access-Control-Expose-Headers", "x-access-token, x-refresh-token");
        res.set("x-access-token", "");
        res.set("x-refresh-token", "");
        res.setStatus(res.OK);
        res.setData("Berhasil logout");
        res.go();
    });

    return router;
}

module.exports = api;
