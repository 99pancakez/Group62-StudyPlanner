module.exports = (sequelize, DataTypes) => {
    const CourseType = sequelize.define("course_type", {
        course_id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            references: {
                model: 'course',
                key: 'course_id'
            }
        },
        sub_type_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'sub_type',
                key: 'sub_type_id'
            }
        }
    }, {
        timestamps: false
    });

    return CourseType;
};