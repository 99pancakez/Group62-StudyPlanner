module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define("course", {
        course_id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        course_code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        course_title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        course_credit: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        web_url: {
            type: DataTypes.STRING(2048),
            allowNull: true
        },
        prerequisite: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        year: {
            type: DataTypes.INTEGER, 
            allowNull: true
        }
    }, {
        timestamps: false
    });
    return Course;
};