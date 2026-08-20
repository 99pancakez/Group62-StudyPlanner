module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define("group", {
        group_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        group_type: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    }, {
        timestamps: false
    });

    return Group;
};