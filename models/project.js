/**
* File : ./models/project.js
* Tanggal Dibuat : 2018-7-17 21:32:47
* Penulis : zero
*/

export default (sequelize, DataTypes) => {

    const Project = sequelize.define("project", {
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
        },
        deadline: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        underscored: true
    });

    Project.associate = (models) => {
        /**
         * Definisi relasi tabel disini
         */
        let { User, Participant, Requirement } = models;
        Project.belongsTo(User);
        Project.hasMany(Participant);
        Project.hasMany(Requirement);
    }

    return Project;

}