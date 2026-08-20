const { Course, ProgramCourse, ProgramPlan, CourseType, Type, SubType, CourseAvailability, Availability, PreRequisiteGroupAND, PreRequisiteGroupOR } = require('../database');

// PDF Generator
const PDFDocument = require('pdfkit');

// Generate Courses PDF
exports.downloadCoursesPDF = async (req, res) => {
    console.log('✅ PDF route hit with programCode:', req.params.programCode);
    try {
        const { programCode } = req.params;

        const program = await ProgramPlan.findOne({ where: { program_code: programCode } });
        if (!program) {
            return res.status(404).json({ success: false, message: `Program ${programCode} not found` });
        }

        const programCourses = await Type.findAll({
            include: [{
                model: SubType,
                include: [{
                    model: CourseType,
                    include: [{
                        model: Course,
                        as: 'course',
                        include: [
                            {
                                model: ProgramCourse,
                                where: { program_code: programCode },
                                required: true
                            },
                            {
                                model: CourseAvailability,
                                as: 'courseAvailabilities',
                                include: [{ model: Availability, as: 'availability' }],
                            },
                            {
                                model: PreRequisiteGroupAND,
                                as: 'pre_requisite_group_ANDs',
                            },
                            {
                                model: PreRequisiteGroupOR,
                                as: 'pre_requisite_group_ORs',
                            },
                        ]
                    }]
                }]
            }]
        });

        const formattedCourses = [];

        for (const type of programCourses) {
            for (const subType of type.sub_types || []) {
                for (const courseType of subType.course_types || []) {
                    const course = courseType.course;
                    if (!course) continue;

                    const courseTypeId = type.course_type_id || 'N/A';
                    const courseTypeName = type.course_type || 'N/A';
                    const subTypeId = subType.sub_type_id || null;
                    const subTypeName = subType.sub_type_name || null;

                    const semesters = course.courseAvailabilities?.map(ca => ca.availability?.semester_name) || [];
                    const isSemester1 = semesters.includes('Semester 1');
                    const isSemester2 = semesters.includes('Semester 2');
                    const isFlexTerm = semesters.includes('Flex Term');

                    const andGroupIds = course.pre_requisite_group_ANDs?.map(g => g.group_id) || [];
                    const orGroupIds = course.pre_requisite_group_ORs?.map(g => g.group_id) || [];

                    let structuredPrereqs = []; // For PDF in-page navigations linking : Array

                    if (course.prerequisite) {
                        structuredPrereqs = [];

                        // AND groups
                        if (andGroupIds.length > 0) {
                            for (const groupId of andGroupIds) {
                                const orCourses = await PreRequisiteGroupOR.findAll({
                                    where: { group_id: groupId },
                                    include: [{ model: Course, attributes: ['course_code'] }],
                                });

                                const courseCodes = orCourses.map(oc => oc.course.course_code);
                                if (courseCodes.length > 0) {
                                    structuredPrereqs.push(courseCodes); // OR group
                                }
                            }
                            prerequisites = structuredPrereqs.map(g => `(${g.join(' OR ')})`).join(' AND ');
                        }
                        // OR groups only
                        else if (orGroupIds.length > 0) {
                            const orCourses = await PreRequisiteGroupOR.findAll({
                                where: { group_id: orGroupIds },
                                include: [{ model: Course, attributes: ['course_code'] }],
                            });

                            const courseCodes = orCourses.map(oc => oc.course.course_code);
                            structuredPrereqs = [courseCodes]; // One OR group
                            prerequisites = courseCodes.join(' OR ');
                        }
                    }

                    formattedCourses.push({
                        course_code: course.course_code,
                        title: course.course_title,
                        url: course.web_url,
                        type_id: courseTypeId,
                        type_name: courseTypeName,
                        sub_type_id: subTypeId,
                        sub_type_name: subTypeName,
                        s1: isSemester1 ? 'Yes' : 'No',
                        s2: isSemester2 ? 'Yes' : 'No',
                        flex: isFlexTerm ? 'Yes' : 'No',
                        structuredPrereqs,
                    });
                }
            }
        }

        const groupedCourses = {};

        formattedCourses.forEach(course => {
            const { type_name, sub_type_name } = course;

            if (!groupedCourses[type_name]) {
                groupedCourses[type_name] = {};
            }

            const subtypeKey = sub_type_name;

            if (!groupedCourses[type_name][subtypeKey]) {
                groupedCourses[type_name][subtypeKey] = [];
            }

            groupedCourses[type_name][subtypeKey].push(course);
        });

        // ─── Build the PDF ───
        const doc = new PDFDocument({ margin: 40 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${programCode}_Courses.pdf`);
        doc.pipe(res);

        // ─── A. TITLE on Page 1 ───
        doc.fontSize(20).fillColor('black')
            .text(`Courses for Program: ${programCode}`, { align: 'center' })
            .moveDown(1);

        // ─── B. TABLE OF CONTENTS ───
        doc.fontSize(16).fillColor('black').text('Table of Contents', { underline: false }).moveDown(0.5);

        // 2) Draw a red line beneath “Contents”
        const leftMargin = doc.page.margins.left;
        const pageWidth = doc.page.width - doc.page.margins.right;  // total usable width
        const y = doc.y + 2;                                // a couple of points below the last text

        doc
            .save()                        // remember previous color/line width
            .strokeColor('red')            // set the line color to red
            .lineWidth(10)                  // 1pt thick
            .moveTo(leftMargin, y)         // start at left margin, at vertical position y
            .lineTo(pageWidth, y)          // draw to far right margin, same y
            .stroke()                      // actually paint the line
            .restore();                    // go back to whatever color/lineWidth you had before

        doc.moveDown(2);                 // leave some space before listing Contents items

        const excluded = ['core', 'university elective'];

        Object.entries(groupedCourses).forEach(([typeName, subTypeGroup]) => {
            // Print each Type name in bold
            doc.fontSize(14).fillColor('black').text(typeName);
            Object.entries(subTypeGroup).forEach(([subTypeName, courses]) => {
                // Exclude duplication for same Type and Subtype names. E.g. Core - Core
                if (!excluded.includes(subTypeName.toLowerCase())) {
                    doc.fontSize(12).fillColor('blue').text(`  • ${subTypeName}`);
                }

                // Now list all courses under this subtype
                courses.forEach((course) => {
                    // We use `goTo: "course_<course_code>"` to jump to that anchor later
                    const tocLine = subTypeName && subTypeName.trim() !== ''
                        ? `         ${course.course_code} - ${course.title}`
                        : `         ${course.course_code} - ${course.title}`;

                    doc.fontSize(11)
                        .fillColor('gray')
                        .text(tocLine, {
                            goTo: `course_${course.course_code}`,
                            underline: false,
                        });
                });
                doc.moveDown(0.5);
            });

            doc.moveDown(0.5);
        });

        // ─── C. PAGE BREAK: Start actual course details on next Page ───
        doc.addPage();

        function getCourseTitle(course_code) {
            return formattedCourses
                .find(item => item.course_code === course_code)
                ?.title || null;
        }

        Object.entries(groupedCourses).forEach(([typeName, subTypeGroup]) => {
            Object.entries(subTypeGroup).forEach(([subTypeName, courses]) => {
                if (!excluded.includes(subTypeName.toLowerCase())) {
                    doc.fontSize(16).fillColor('black').text(`\n${typeName} : ${subTypeName}`).moveDown(0.5);
                } else {
                    doc.fontSize(16).fillColor('black').text(`\n${typeName}`).moveDown(0.5);
                }

                courses.forEach((course) => {
                    const courseTitleText = `${course.course_code} - ${course.title}`;
                    doc.addNamedDestination(`course_${course.course_code}`);
                    doc.fontSize(12).fillColor('blue').text(courseTitleText, {
                        link: course.url,
                        underline: false,
                    });

                    doc.fillColor('black');
                    doc.text(`Semester 1: ${course.s1}`);
                    doc.text(`Semester 2: ${course.s2}`);
                    doc.text(`Flex Term: ${course.flex}`);

                    if (course.structuredPrereqs && course.structuredPrereqs.length > 0) {
                        doc.text('Pre-requisites:');

                        course.structuredPrereqs.forEach((orGroup, groupIndex) => {
                            orGroup.forEach((cid, cidIndex) => {
                                doc.fillColor('green').text(`${cid} - ${getCourseTitle(cid)}`, {
                                    goTo: `course_${cid}`,
                                    underline: false,
                                    continued: cidIndex < orGroup.length - 1,
                                });

                                if (cidIndex < orGroup.length - 1) {
                                    doc.fillColor('black').text(' OR ', { continued: true });
                                }
                            });

                            if (groupIndex < course.structuredPrereqs.length - 1) {
                                doc.fillColor('black').text(' AND ');
                            } else {
                                doc.text('');
                            }
                        });
                    } else {
                        doc.text('Pre-requisites: None');
                    }

                    doc.moveDown(1);
                });
            });
        });

        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};