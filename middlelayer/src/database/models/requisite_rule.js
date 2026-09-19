module.exports = (sequelize, DataTypes) => {
  const RequisiteRule = sequelize.define(
    "requisite_rule",
    {
      rule_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      target_course_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
          model: "course",
          key: "course_id",
        },
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      timestamps: false,
    },
  );

  return RequisiteRule;
};
