/**
* File : ./models/participant.js
* Tanggal Dibuat : 2018-7-17 23:10:39
* Penulis : zero
*/

export default (sequelize, DataTypes) => {

    const Participant = sequelize.define("participant", {
        /**
         * Kolom tabel disini..
         */
    }, {
        underscored: true
    });

    Participant.associate = (models) => {
        /**
         * Definisi relasi tabel disini
         */
        let { Project, User, Role, Job } = models;
        Participant.belongsTo(Project);
        Participant.belongsTo(User);
        Participant.belongsTo(Role);
        Participant.hasMany(Job);
    }

    return Participant;

}