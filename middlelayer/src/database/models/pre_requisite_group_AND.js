module.exports = (sequelize, DataTypes) => {
    const PreRequisiteGroupAND = sequelize.define("pre_requisite_group_AND", {
        group_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'group',
                key: 'group_id'
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

    return PreRequisiteGroupAND;
};