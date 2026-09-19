module.exports = (sequelize, DataTypes) => {
  const RequisiteGroup = sequelize.define(
    "requisite_group",
    {
      group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rule_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "requisite_rule",
          key: "rule_id",
        },
      },
      parent_group_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "requisite_group",
          key: "group_id",
        },
      },
      operator: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    },
  );

  return RequisiteGroup;
};
