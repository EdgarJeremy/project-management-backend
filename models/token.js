/**
* File : ./models/token.js
* Tanggal Dibuat : 2018-7-16 15:08:25
* Penulis : zero
*/

export default (sequelize, DataTypes) => {

    const Token = sequelize.define("token", {
        /**
         * Kolom tabel disini..
         */
        refresh_token: {
            type: DataTypes.STRING(191),
            allowNull: false
        },
        used: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        underscored: true
    });

    Token.associate = (models) => {
        /**
         * Definisi relasi tabel disini
         */
        let { User } = models;
        Token.belongsTo(User);
    }

    return Token;

}