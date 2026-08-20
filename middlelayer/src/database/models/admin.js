module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("admin", {
        admin_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        admin_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        admin_email: {
            type: DataTypes.STRING(254),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(200),
            allowNull: false
        }
    }, {
        timestamps: false
    });

    return Admin;
};