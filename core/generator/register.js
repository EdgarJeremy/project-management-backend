import bcrypt from "bcrypt";
import models from "../importer/model";
import { encryption } from "../../config.json";
import utils from "../utils";

const { salt_rounds } = encryption;
const args = process.argv[2];

if (args) {
    const name = args.split(":")[0]
    const username = args.split(":")[1];
    const password = bcrypt.hashSync(args.split(":")[2], salt_rounds);
    const type = args.split(":")[3];
    const { User } = models;

    if (name && username && password && type) {
        User.create({
            name, username, password, type
        }).then((user) => {
            utils.log(`User ${name} tersimpan! Login dengan username ${username} dan password ${args.split(":")[2]}`, "success");
        });
    } else {
        utils.log(`Argumen tidak lengkap! Sertakan argumen (name:username:password:type)`, "error");
    }
} else {
    utils.log(`Argumen tidak lengkap! Sertakan argumen (name:username:password:type)`, "error");
}