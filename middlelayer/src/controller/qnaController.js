const db = require('../database');
const { Course } = db;

const qnaController = {
  getCourses: async (req, res) => {
    try {
      const courses = await Course.findAll({
        attributes: ['course_id', 'course_code', 'course_title', 'course_credit', 'web_url', 'prerequisite', 'year'],
        include: [
          {
            model: db.CourseType,
            attributes: ['course_id', 'sub_type_id'],
            include: [
              {
                model: db.SubType,
                attributes: ['sub_type_id', 'sub_type_name', 'course_type_id'],
                include: [
                  {
                    model: db.Type,
                    attributes: ['course_type_id', 'course_type'],
                    include: [
                      {
                        model: db.ComboGroupTypeMapping,
                        attributes: ['combo_group_id', 'course_type_id'],
                        include: [
                          {
                            model: db.CombinationGroup,
                            attributes: ['combo_group_id', 'combo_group_label'],
                            include: [
                              {
                                model: db.CombinationGroupMapping,
                                attributes: ['combination_id', 'combo_group_id'],
                                include: [
                                  {
                                    model: db.Combination,
                                    attributes: ['combination_id', 'combination_name']
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      });

      const plainCourses = courses.map(course => {
        const {
          course_id,
          course_code,
          course_title,
          course_credit,
          web_url,
          prerequisite,
          year,
          course_types
        } = course.get({ plain: true });

        const subTypeMap = {};

        course_types.forEach(ct => {
          const { sub_type } = ct;
          if (!sub_type || !sub_type.type) return;

          const subTypeId = sub_type.sub_type_id;
          if (!subTypeMap[subTypeId]) {
            subTypeMap[subTypeId] = {
              sub_type_id: sub_type.sub_type_id,
              sub_type_name: sub_type.sub_type_name,
              type: {
                course_type_id: sub_type.type.course_type_id,
                course_type: sub_type.type.course_type,
                combo_groups: []
              }
            };
          }

          const { combo_group_type_mappings } = sub_type.type;
          if (!combo_group_type_mappings) return;

          combo_group_type_mappings.forEach(mapping => {
            const group = mapping.combination_group;
            if (!group) return;

            const existingGroup = subTypeMap[subTypeId].type.combo_groups.find(g => g.combo_group_id === group.combo_group_id);
            if (!existingGroup) {
              subTypeMap[subTypeId].type.combo_groups.push({
                combo_group_id: group.combo_group_id,
                combo_group_label: group.combo_group_label,
                combinations: []
              });
            }

            const comboGroup = subTypeMap[subTypeId].type.combo_groups.find(g => g.combo_group_id === group.combo_group_id);
            group.combination_group_mappings?.forEach(mapping => {
              const combination = mapping.combination;
              if (combination && !comboGroup.combinations.some(c => c.combination_id === combination.combination_id)) {
                comboGroup.combinations.push({
                  combination_id: combination.combination_id,
                  combination_name: combination.combination_name
                });
              }
            });
          });
        });

        return {
          course_id,
          course_code,
          course_title,
          course_credit,
          web_url,
          prerequisite,
          year,
          sub_types: Object.values(subTypeMap)
        };
      });

      res.json(plainCourses);
    } catch (error) {
      console.error('❌ Sequelize deep join error:', error);
      res.status(500).json({ error: 'Failed to fetch courses with mappings' });
    }
  }
};

module.exports = qnaController;
