/** 
 * Utilities
*/
import bcrypt from "bcrypt";
import config from "../config.json";
import models from "./importer/model";
import colors from "colors";

export default {

    table_prefix: function (fields, prefix) {
        let newFields = {};
        Object.keys(new Object(fields)).forEach((field, index) => {
            newFields[`${prefix}.${field}`] = fields[field];
        });
        return newFields;
    },

    check_props: function (obj, proper = []) {
        obj = new Object(obj);
        for (var i = 0; i < proper.length; i++) {
            if (!obj.hasOwnProperty(proper[i])) {
                return proper[i];
            }
        }
        return null;
    },

    num_pad: function (num, size) {
        var s = String(num);
        while (s.length < (size || 2)) { s = "0" + s }
        return s;
    },

    format_date: function (waktu = new Date()) {
        return `${waktu.getFullYear()}-${this.num_pad(waktu.getMonth() + 1)}-${this.num_pad(waktu.getDate())}`;
    },

    hash: function (password) {
        const { salt_rounds } = config.encryption;
        return bcrypt.hashSync(password, salt_rounds);
    },

    verify: function (hashed, plain) {
        return bcrypt.compareSync(plain, hashed);
    },

    craft_seed_data: async function (target) {
        let data = {};
        let keys = Object.keys(target);
        for(let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let field = target[keys[i]];
            if(typeof field === "function") {
                data[key] = field();
            } else {
                if(typeof field === "object") {
                    if(field.wrap) {
                        data[key] = field.wrap(field.method());
                    } else if(field.table) {
                        let rel = await models[field.table].findOne({attributes: ["id"], order: models.Sequelize.literal("rand()")});
                        data[key] = rel.id;
                    }
                }
            }
        }
        return data;
    },

    log: function(message, status, color = "white", nl = "\n\n") {
        let tick = "";
        if(status === "success"){
            color = "green";
            tick = "✓";
        } else if(status === "error") {
            color = "red";
            tick = "✗";
        }
        let out = color ? `${tick} ${message}`[color] : `${tick} ${message}`;
        if(nl)
            console.log(nl);
        console.log(out);
    }

}