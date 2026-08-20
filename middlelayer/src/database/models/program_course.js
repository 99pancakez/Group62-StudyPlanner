module.exports = (sequelize, DataTypes) => {
    const ProgramCourse = sequelize.define("program_course", {
        program_code: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            references: {
                model: 'program_plan',
                key: 'program_code'
            }
        },
        course_id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            references: {
                model: 'course',
                key: 'course_id'
            }
        }
    }, {
        timestamps: false
    });

    return ProgramCourse;
};