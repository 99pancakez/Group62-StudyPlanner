module.exports = (sequelize, DataTypes) => {
    const CourseAvailability = sequelize.define("course_availability", {
        course_id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            references: {
                model: 'course',
                key: 'course_id'
            }
        },
        semester_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'availability',
                key: 'semester_id'
            }
        }
    }, {
        timestamps: false
    });

    return CourseAvailability;
};