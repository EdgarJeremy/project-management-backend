/**
 * Packages & modules
 */
import express from "express";
import http from "http";
import socketio from "socket.io";
import sirius from "sirius-express";
import cors from "cors";
import session from "express-session";
import bodyParser from "body-parser";
import Table from "cli-table";
import ip from "ip";

import config from "./config.json";
import packageInfo from "./package.json";
import socketListener from "./websocket/listener";
import models from "./core/importer/model";
import routes from "./core/importer/route";
import getRoutesData from "./core/inspector/route";
import utils from "./core/utils";
import user_token from "./core/middlewares/user_token";

const app = express();
const server = http.Server(app);
const io = socketio(server);

/**
 * App constants
 */
app.set("express", express);

/**
 * Middlewares
 */
app.use(bodyParser.json({ limit: config.request.limit }));
app.use(bodyParser.urlencoded({ limit: config.request.limit, extended: true }));
app.use(cors({
    origin: config.cors,
    credentials: true
}));
app.use(session({
    secret: config.session.secret,
    cookie: {
        maxAge: config.session.maxAge
    },
    resave: true,
    saveUninitialized: false
}));
app.use(sirius({
    showPost: config.request.show_post,
    showGet: config.request.show_get,
    secret: config.session.secret
}));
if(config.user_token.use) {
    const { tokenSecret, refreshTokenSecret, userModel, tokenModel, tokenExpire, refreshTokenExpire } = config.user_token;
    if(tokenSecret && refreshTokenSecret && models[userModel] && tokenExpire && refreshTokenExpire) {   
        app.use(user_token({
            tokenSecret: tokenSecret,
            refreshTokenSecret: refreshTokenSecret,
            userModel: models[userModel],
            tokenModel: models[tokenModel],
            tokenExpire: tokenExpire,
            refreshTokenExpire: refreshTokenExpire
        }));
    }
}

/**
 * Load semua routes
 */
Object.keys(routes).forEach(function (route) {
    app.use(`/api/${route}`, routes[route](app, models, socketListener));
});

/**
 * Root routes
 */
app.get("/", function (req, res) {
    res.setStatus(res.OK);
    res.setData({
        app: packageInfo.name,
        version: packageInfo.version
    });
    res.go();
});

/**
 * Synchronize & motd 
 */
models.sequelize.sync({
    alter: config.migration.watch,
    force: config.migration.renew
}).then(() => {
    server.listen(config.server.port);
    socketListener.listen(io);
    console.log('\x1Bc');
    const motd = new Table();
    motd.push(
        { ["Nama App".blue.bold]: packageInfo.name },
        { ["Versi".blue.bold]: packageInfo.version },
        { ["Running Port".blue.bold]: config.server.port },
        { ["Entrypoint".blue.bold]: `${config.server.protocol}://${ip.address()}:${config.server.port}/` }
    );
    const routesData = getRoutesData(app);
    utils.log("Server berhasil dijalankan!\nAkses semua endpoint yang terdaftar melalui entrypoint yang tertera dibawah.\nGunakan Postman (https://www.getpostman.com/) untuk mendebug API.\nSelamat bekerja :)", "success", "", "");
    utils.log("Info Aplikasi : ", "", "", " ");
    console.log(motd.toString());
    
    if (process.argv[2] === "inspect") {
        utils.log("Daftar endpoint : ", "", "", "");
        console.log(routesData.string);
    } else {
        utils.log("\bGunakan perintah:\n`npm run inspect routes` untuk melihat daftar endpoint yang terdaftar,\n`npm start inspect` untuk langsung menampilkan dafar endpoint pada saat server berjalan", "", "yellow", "");
    }
});