/**
* File : ./models/job.js
* Tanggal Dibuat : 2018-7-18 00:53:59
* Penulis : zero
*/

export default (sequelize, DataTypes) => {

    const Job = sequelize.define("job", {
        /**
         * Kolom tabel disini..
         */
        name: {
            type: DataTypes.STRING(191),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        start: {
            type: DataTypes.DATE,
            allowNull: false
        },
        finish: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        underscored: true
    });

    Job.associate = (models) => {
        /**
         * Definisi relasi tabel disini
         */
        let { Participant } = models;
        Job.belongsTo(Participant);
    }

    return Job;

}