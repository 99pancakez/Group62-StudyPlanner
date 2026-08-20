const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");


const db = {
 Op: Sequelize.Op
};


// Create Sequelize instance with error handling
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
 host: config.HOST,
 dialect: config.DIALECT,
 logging: console.log,
 define: {
   freezeTableName: true
 }
});

// Include models
db.Admin = require("./models/admin")(db.sequelize, DataTypes);
db.Course = require("./models/course")(db.sequelize, DataTypes);
db.Type = require("./models/type")(db.sequelize, DataTypes);
db.SubType = require("./models/sub_type")(db.sequelize, DataTypes);
db.CourseType = require("./models/course_type")(db.sequelize, DataTypes);
db.Group = require("./models/group")(db.sequelize, DataTypes);
db.PreRequisiteGroupAND = require("./models/pre_requisite_group_AND")(db.sequelize, DataTypes);
db.PreRequisiteGroupOR = require("./models/pre_requisite_group_OR")(db.sequelize, DataTypes);
db.Availability = require("./models/availability")(db.sequelize, DataTypes);
db.CourseAvailability = require("./models/course_availability")(db.sequelize, DataTypes);
db.ProgramPlan = require("./models/program_plan")(db.sequelize, DataTypes);
db.ProgramCourse = require("./models/program_course")(db.sequelize, DataTypes);
db.History = require("./models/history")(db.sequelize, DataTypes);
db.Combination = require("./models/combination")(db.sequelize, DataTypes);
db.CombinationGroup = require("./models/combination_group")(db.sequelize, DataTypes);
db.ComboGroupTypeMapping = require("./models/combo_group_type_mapping")(db.sequelize, DataTypes);
db.CombinationGroupMapping = require("./models/combination_group_mapping")(db.sequelize, DataTypes);


// Define associations

// admin to history (one-to-many)
db.Admin.hasMany(db.History, { foreignKey: { name: "admin_id", allowNull: false } });
db.History.belongsTo(db.Admin, { foreignKey: { name: "admin_id", allowNull: false } });


// admin to program_plan (one-to-many)
db.Admin.hasMany(db.ProgramPlan, { foreignKey: { name: "admin_id", allowNull: false } });
db.ProgramPlan.belongsTo(db.Admin, { foreignKey: { name: "admin_id", allowNull: false } });


// type to sub_type (one-to-many)
db.Type.hasMany(db.SubType, { foreignKey: { name: "course_type_id", allowNull: false } });
db.SubType.belongsTo(db.Type, { foreignKey: { name: "course_type_id", allowNull: false } });


// sub_type to course_type (one-to-many)
db.SubType.hasMany(db.CourseType, { foreignKey: { name: "sub_type_id", allowNull: false } });
db.CourseType.belongsTo(db.SubType, { foreignKey: { name: "sub_type_id", allowNull: false } });


// course to course_type (one-to-many)
db.Course.hasMany(db.CourseType, { foreignKey: { name: "course_id", allowNull: false } });
db.CourseType.belongsTo(db.Course, { foreignKey: { name: "course_id", allowNull: false } });


// group to pre_requisite_group_AND (one-to-many)
db.Group.hasMany(db.PreRequisiteGroupAND, { foreignKey: { name: "group_id", allowNull: false } });
db.PreRequisiteGroupAND.belongsTo(db.Group, { foreignKey: { name: "group_id", allowNull: false } });


// group to pre_requisite_group_OR (one-to-many)
db.Group.hasMany(db.PreRequisiteGroupOR, { foreignKey: { name: "group_id", allowNull: false } });
db.PreRequisiteGroupOR.belongsTo(db.Group, { foreignKey: { name: "group_id", allowNull: false } });


// course to pre_requisite_group_AND (one-to-many)
db.Course.hasMany(db.PreRequisiteGroupAND, { foreignKey: { name: "course_id", allowNull: false }, as: 'pre_requisite_group_ANDs' });
db.PreRequisiteGroupAND.belongsTo(db.Course, { foreignKey: { name: "course_id", allowNull: false } });


// course to pre_requisite_group_OR (one-to-many)
db.Course.hasMany(db.PreRequisiteGroupOR, { foreignKey: { name: "course_id", allowNull: false }, as: 'pre_requisite_group_ORs' });
db.PreRequisiteGroupOR.belongsTo(db.Course, { foreignKey: { name: "course_id", allowNull: false } });


// availability to course_availability (one-to-many)
db.Availability.hasMany(db.CourseAvailability, { foreignKey: { name: "semester_id", allowNull: false }, as: 'courseAvailabilities' });
db.CourseAvailability.belongsTo(db.Availability, { foreignKey: { name: "semester_id", allowNull: false }, as: 'availability' });


// course to course_availability (one-to-many)
db.Course.hasMany(db.CourseAvailability, { foreignKey: { name: "course_id", allowNull: false }, as: 'courseAvailabilities' });
db.CourseAvailability.belongsTo(db.Course, { foreignKey: { name: "course_id", allowNull: false }, as: 'course' });


// program_plan to program_course (one-to-many)
db.ProgramPlan.hasMany(db.ProgramCourse, { foreignKey: { name: "program_code", allowNull: false } });
db.ProgramCourse.belongsTo(db.ProgramPlan, { foreignKey: { name: "program_code", allowNull: false } });


// course to program_course (one-to-many)
db.Course.hasMany(db.ProgramCourse, { foreignKey: { name: "course_id", allowNull: false } });
db.ProgramCourse.belongsTo(db.Course, { foreignKey: { name: "course_id", allowNull: false } });


// program_plan to history (one-to-many)
db.ProgramPlan.hasMany(db.History, { foreignKey: { name: "program_code", allowNull: true } });
db.History.belongsTo(db.ProgramPlan, { foreignKey: { name: "program_code", allowNull: true } });


// course to history (one-to-many)
db.Course.hasMany(db.History, { foreignKey: { name: "course_id", allowNull: true } });
db.History.belongsTo(db.Course, { foreignKey: { name: "course_id", allowNull: true }, as: 'course' });


// course (as target) to pre_requisite_group_OR (foreign key: course_id)
db.PreRequisiteGroupOR.belongsTo(db.Course, { foreignKey: { name: "course_id", allowNull: false }, as: 'prereq_course' });

db.Course.hasMany(db.PreRequisiteGroupOR, { foreignKey: { name: "course_id", allowNull: false }, as: 'preReqOrCourses' });

// ProgramPlan → Combination (1:M)
db.ProgramPlan.hasMany(db.Combination, { foreignKey: { name: "program_code", allowNull: false } });
db.Combination.belongsTo(db.ProgramPlan, { foreignKey: { name: "program_code", allowNull: false } });

// Combination → CombinationGroupMapping (1:M)
db.Combination.hasMany(db.CombinationGroupMapping, { foreignKey: { name: "combination_id", allowNull: false } });
db.CombinationGroupMapping.belongsTo(db.Combination, { foreignKey: { name: "combination_id", allowNull: false } });

// CombinationGroup → CombinationGroupMapping (1:M)
db.CombinationGroup.hasMany(db.CombinationGroupMapping, { foreignKey: { name: "combo_group_id", allowNull: false } });
db.CombinationGroupMapping.belongsTo(db.CombinationGroup, { foreignKey: { name: "combo_group_id", allowNull: false } });

// CombinationGroup → ComboGroupTypeMapping (1:M)
db.CombinationGroup.hasMany(db.ComboGroupTypeMapping, { foreignKey: { name: "combo_group_id", allowNull: false } });
db.ComboGroupTypeMapping.belongsTo(db.CombinationGroup, { foreignKey: { name: "combo_group_id", allowNull: false } });

// Type → ComboGroupTypeMapping (1:M)
db.Type.hasMany(db.ComboGroupTypeMapping, { foreignKey: { name: "course_type_id", allowNull: false } });
db.ComboGroupTypeMapping.belongsTo(db.Type, { foreignKey: { name: "course_type_id", allowNull: false } });


// Include a sync option
db.sync = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Database connection has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

module.exports = db;