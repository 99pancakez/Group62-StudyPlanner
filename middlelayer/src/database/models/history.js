module.exports = (sequelize, DataTypes) => {
    const History = sequelize.define("history", {
        history_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        course_id: {
            type: DataTypes.STRING(50),
            allowNull: true,
            references: {
                model: 'course',
                key: 'course_id'
            }
        },
        program_code: {
            type: DataTypes.STRING(50),
            allowNull: true,
            references: {
                model: 'program_plan',
                key: 'program_code'
            }
        },
        admin_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'admin',
                key: 'admin_id'
            }
        },
        time_stamp: {
            type: DataTypes.DATE,
            allowNull: false
        },
        field_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        old_value: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        new_value: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    return History;
};