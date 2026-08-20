module.exports = (sequelize, DataTypes) => {
    const SubType = sequelize.define("sub_type", {
        sub_type_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sub_type_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: false
        },
        course_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'type',
                key: 'course_type_id'
            }
        }
    }, {
        timestamps: false
    });

    return SubType;
};