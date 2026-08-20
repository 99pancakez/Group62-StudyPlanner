module.exports = (sequelize, DataTypes) => {
    const Type = sequelize.define("type", {
        course_type_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        course_type: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        }
    }, {
        timestamps: false
    });

    return Type;
};