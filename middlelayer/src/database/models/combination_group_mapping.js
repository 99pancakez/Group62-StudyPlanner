module.exports = (sequelize, DataTypes) => {
    const CombinationGroupMapping = sequelize.define("combination_group_mapping", {
      combination_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'combination',
          key: 'combination_id'
        }
      },
      combo_group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'combination_group',
          key: 'combo_group_id'
        }
      },
      total_credit: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      timestamps: false
    });
  
    return CombinationGroupMapping;
  };