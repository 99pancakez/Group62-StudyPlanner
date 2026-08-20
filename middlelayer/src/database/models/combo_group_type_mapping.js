module.exports = (sequelize, DataTypes) => {
    const ComboGroupTypeMapping = sequelize.define("combo_group_type_mapping", {
      combo_group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'combination_group',
          key: 'combo_group_id'
        }
      },
      course_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'type',
          key: 'course_type_id'
        }
      }
    }, {
      timestamps: false
    });
  
    return ComboGroupTypeMapping;
  };
  