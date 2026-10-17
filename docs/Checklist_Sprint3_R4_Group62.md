# R4 Acceptance Test Checklist — Course Database and Admin Portal (Group 62)

**Tester:** Bohan Chen  
**Date:** 17 October 2026  
**Build:** main, commit c3c7be6 (Windows)  
**Requirement:** R4 — course database included in the launch, exportable, and maintained through the admin portal.

Acceptance criteria: AC1 Course data is available as soon as the application starts. AC2 No database installation or manual import is required by the user. AC3 The course data is the client's version (StudyPlanner-Student_9Nov2025.zip), not the outdated data. AC4 The course database can be exported and shared. AC5 The admin portal allows prerequisites and semester availability to be changed, and courses to be added or removed.

Setup: fresh Download ZIP of main (record the commit), Windows, launched with start.bat. Admin portal at localhost:3001/admin. Test course: code TEST1234, title Test Course, 12 credits. Data folder: middlelayer/src/database/seed/data. Result values: Pass, Fail, Partial, Blocked, Not re-run, Exception.

Result: 9 tests Pass. R4-T2 (AC3, client data version) removed and not tested, so AC3 has no evidence and ISS-6 stays open. R4 can be signed off for AC1, AC2, AC4 and AC5 only.

| ID | AC | Steps | Expected result | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| R4-T1 | AC1, AC2 | Double-click start.bat. When the planner opens, add a course to Year 1 Semester 1. | Course list loads. No database install or import step. | Pass | Evidence: course search in R6-T5. |
| R4-T3 | AC5 | Open localhost:3001/admin. | Admin portal opens with the course table. No login needed. | Pass | Evidence: admin portal opened in R6-T2. |
| R4-T4 | AC5 | Click + Add Course. Create TEST1234 Test Course, 12 credits, Semester 1 ticked. Then search for it in planner Year 1 Semester 1. | Course appears in the admin table and is offered in planner Semester 1. | Pass |  |
| R4-T5 | AC5 | In the admin table, tick Semester 2 for Test Course. Search for it in planner Year 1 Semester 2. | Course is now offered in Semester 2. | Pass |  |
| R4-T6 | AC5 | In the admin portal, set Introduction to Mathematics for Computing as a prerequisite of Test Course. In the planner, add Test Course to Year 1 Semester 1 alone. | Planner shows a prerequisite warning for Test Course (MATH2466). | Pass |  |
| R4-T7 | AC4 | Close the middlelayer (Backend) window first, then the other windows. Open data/course.json in the data folder and search for TEST1234. | TEST1234 is saved in course.json. | Pass |  |
| R4-T8 | AC4 | Launch again with start.bat. Search for Test Course in the planner. | Test Course is still there, with Semester 1 and 2 and the prerequisite. | Pass |  |
| R4-T9 | AC4 | Unzip a second fresh copy of main. Replace its data folder with the one from R4-T7. Launch the second copy. | Test Course appears in the second copy (database shared). | Pass |  |
| R4-T10 | AC5 | In the admin portal, select Test Course and delete it. Search for it in the admin table and the planner. | Test Course is gone from both. | Pass |  |
