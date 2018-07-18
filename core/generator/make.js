import fs from "fs";
import path from "path";
import makeRoutes from "../templates/routes";
import makeModels from "../templates/models";
import utils from "../utils";
import config from "../../config.json";

let argv = process.argv[2];
let action = argv.split(":")[0];
let name = argv.split(":")[1];

if (action === "route") {
    /**
     * Make route
     */
    let folder = path.join(__dirname, "..", "..", config.folders.routes);
    fs.writeFile(`${folder}/${name.toLowerCase()}.js`, makeRoutes(name), (err) => {
        if(err) {
            utils.log(err, "error");
        }
        utils.log(`Route '${name}' berhasil dibuat`, "success");
    });
} else if(action === "model") {
    /**
     * Make model
     */
    let folder = path.join(__dirname, "..", "..", config.folders.models);
    fs.writeFile(`${folder}/${name.toLowerCase()}.js`, makeModels(name), (err) => {
        if(err) {
            utils.log(err, "error");
        }
        utils.log(`Model '${name}' berhasil dibuat`, "success");
    });
}