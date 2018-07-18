import path from "path";
import fs from "fs";
import { folders } from "../../config.json";

let folder = path.join(__dirname, "..", "..", folders.routes);
const routes = {};

fs.readdirSync(folder).forEach((file) => {
    if(file.indexOf(".js") !== -1) {
        let name = file.split(".")[0];
        let route = require(`${folder}/${file}`);
        if(typeof route === "function")
            routes[name] = require(`${folder}/${file}`);
    }
});

export default routes;