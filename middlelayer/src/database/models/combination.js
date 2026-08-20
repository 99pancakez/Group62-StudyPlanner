module.exports = (sequelize, DataTypes) => {
  const Combination = sequelize.define("combination", {
    combination_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    combination_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    program_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'program_plan',
        key: 'program_code'
      }
    }
  }, {
    timestamps: false
  });

  return Combination;
};