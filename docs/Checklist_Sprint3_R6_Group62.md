# R6 Acceptance Test Checklist — Flex Term Handling (Group 62)

**Tester:** Bohan Chen  
**Date:** 17 October 2026  
**Build:** main, commit c3c7be6 (Windows)  
**Requirement:** R6 — flex terms ignored; Semester 1 / Semester 2 availability follows the course database.

Acceptance criteria: AC1 No flex term is shown as a separate term in the planner. AC2 Courses previously listed under a flex term can still be planned as Semester 1 or Semester 2 courses. AC3 Flex term labels do not affect prerequisite or co-requisite checking. AC4 Semester availability for each course follows the course database.

Setup: February intake. Expected availability is from the course database on main c3c7be6: Introduction to Mathematics for Computing (MATH2466) Semester 1 only; Mathematics for Computing 1 (MATH2411) Semester 2 only; Java Programming Bootcamp (COSC2801), C++ Programming Bootcamp (COSC2802), Java Programming Studio (COSC2803), C++ Programming Studio (COSC2804) both semesters. Start each test from an empty plan unless stated. Result values: Pass, Fail, Partial, Blocked, Not re-run, Exception.

Result: all 10 tests Pass. R6 can be signed off.

| ID | AC | Steps | Expected result | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| R6-T1 | AC1 | Open the planner. Click Move to Next Semester / Skip Summer until Semester 1 (Year 3) is shown. | Only Semester 1, Semester 2 and Summer Semester terms appear. No Flex Term. | Pass |  |
| R6-T2 | AC1 | Open localhost:3001/admin. Check the column headers. | Columns show Semester 1, Semester 2 and Summer Term. No Flex Term column. | Pass |  |
| R6-T3 | AC1 | In the admin portal, click + Add Course. Check the availability options. | Options are Semester 1, Semester 2 and Summer Term. No Flex Term option. | Pass |  |
| R6-T4 | AC1 | In the planner, click Download Official Program Course List (PDF). Search the PDF for "Flex". | No Flex Term text in the PDF. | Pass |  |
| R6-T5 | AC4 | Year 1 Semester 1: Add Course, search Introduction to Mathematics for Computing. Then do the same in Year 1 Semester 2. | Offered in Semester 1. Not offered in Semester 2. | Pass |  |
| R6-T6 | AC4 | Year 1 Semester 1: Add Course, search Mathematics for Computing 1. Then do the same in Year 1 Semester 2. | Not offered in Semester 1. Offered in Semester 2. | Pass |  |
| R6-T7 | AC2, AC4 | Search each bootcamp and studio course (COSC2801, COSC2802, COSC2803, COSC2804) in Year 1 Semester 1 and in Year 1 Semester 2. | All four are offered in both semesters. | Pass |  |
| R6-T8 | AC4 | In the admin portal, find the six courses from R6-T5 to R6-T7 and read their Semester 1 / Semester 2 ticks. | Ticks match the Setup line and what the planner showed. | Pass |  |
| R6-T9 | AC2, AC3 | Add Java Programming Studio to Year 1 Semester 2 only. Then add Java Programming Bootcamp to the same term. | Co-requisite warning shown first (COSC2801). Warning clears after the bootcamp is added. | Pass |  |
| R6-T10 | AC3 | Add Mathematics for Computing 1 to Year 1 Semester 2. Then add Introduction to Mathematics for Computing to Year 1 Semester 1. | Prerequisite warning shown first (MATH2466). Warning clears after MATH2466 is added. | Pass |  |
