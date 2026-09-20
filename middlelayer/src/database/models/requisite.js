module.exports = (sequelize, DataTypes) => {
  const Requisite = sequelize.define(
    "requisite",
    {
      group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "requisite_group",
          key: "group_id",
        },
      },
      course_id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        references: {
          model: "course",
          key: "course_id",
        },
      },
      relation: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      sort_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
    },
  );

  return Requisite;
};
