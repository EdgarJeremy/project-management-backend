/**
* File : ./models/role.js
* Tanggal Dibuat : 2018-7-17 23:14:19
* Penulis : zero
*/

export default (sequelize, DataTypes) => {

    const Role = sequelize.define("role", {
        /**
         * Kolom tabel disini..
         */
        name: {
            type: DataTypes.STRING(191),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        underscored: true
    });

    Role.associate = (models) => {
        /**
         * Definisi relasi tabel disini
         */
    }

    return Role;

}