module.exports = (sequelize, DataTypes) => {
    const ProgramPlan = sequelize.define("program_plan", {
        program_code: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },
        admin_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'admin',
                key: 'admin_id'
            }
        }
    }, {
        timestamps: false
    });

    return ProgramPlan;
};