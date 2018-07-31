export default (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        name: {
            type: DataTypes.STRING(191),
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(191),
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(191),
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM(['employee', 'manager', 'admin'])
        }
    }, {
        underscored: true
    });

    User.associate = (models) => {
        let { Token, Project } = models;
        User.hasMany(Token);
        User.hasMany(Project);
    }

    return User;
}