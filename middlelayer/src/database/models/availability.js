module.exports = (sequelize, DataTypes) => {
    const Availability = sequelize.define("availability", {
        semester_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        semester_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        }
    }, {
        timestamps: false
    });

    return Availability;
};