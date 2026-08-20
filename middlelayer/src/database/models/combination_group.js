module.exports = (sequelize, DataTypes) => {
    const CombinationGroup = sequelize.define("combination_group", {
      combo_group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      combo_group_label: {
        type: DataTypes.STRING(100),
        allowNull: false
      }
    }, {
      timestamps: false
    });
  
    return CombinationGroup;
  };
  