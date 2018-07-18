/**
* File : ./models/requirement.js
* Tanggal Dibuat : 2018-7-18 00:16:50
* Penulis : zero
*/

export default (sequelize, DataTypes) => {

    const Requirement = sequelize.define("requirement", {
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

    Requirement.associate = (models) => {
        /**
         * Definisi relasi tabel disini
         */
        let { Project } = models;
        Requirement.belongsTo(Project);
    }

    return Requirement;

}