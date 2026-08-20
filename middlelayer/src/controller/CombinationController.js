const db = require("../database");
const Combination = db.Combination;
const CombinationGroupMapping = db.CombinationGroupMapping;
const CombinationGroup = db.CombinationGroup;
const ComboGroupTypeMapping = db.ComboGroupTypeMapping;
const SubType = db.SubType;
const Type = db.Type;

exports.getAllCombinations = async (req, res) => {
  try {
    const combinations = await Combination.findAll({
      include: [
        {
          model: CombinationGroupMapping,
          include: [
            {
              model: CombinationGroup,
              include: [
                {
                  model: ComboGroupTypeMapping,
                  include: [
                    {
                      model: Type,
                      include: [{ model: SubType }]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const formatted = combinations.map(combo => {
      return {
        id: combo.combination_id,
        name: combo.combination_name,
        credit: combo.total_credit,
        groups: combo.combination_group_mappings.map(mapping => {
          const group = mapping.combination_group;
          const types = group.combo_group_type_mappings;
          const subTypes = types.flatMap(t => t.type.sub_types);
          return {
            label: group.combo_group_label,
            credit: mapping.total_credit,
            options: subTypes.map(s => ({
              sub_type_id: s.sub_type_id,
              sub_type_name: s.sub_type_name,
              course_type_id: s.course_type_id
            }))
          };
        })
      }
    });

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching combinations:", err);
    res.status(500).json({ error: "Failed to fetch combinations" });
  }
};
