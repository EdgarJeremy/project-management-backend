import os from "os";
import { folders } from "../../config.json";
import _ from "lodash";

export default (model) => {

    return `/**
* File : ./${folders.models}/${model}.js
* Tanggal Dibuat : ${(new Date()).toLocaleString()}
* Penulis : ${os.userInfo().username}
*/

export default (sequelize, DataTypes) => {

    const ${_.capitalize(model)} = sequelize.define("${model.toLowerCase()}", {
        /**
         * Kolom tabel disini..
         */
    }, {
        underscored: true
    });

    ${_.capitalize(model)}.associate = (models) => {
        /**
         * Definisi relasi tabel disini
         */
    }

    return ${_.capitalize(model)};

}`;

}