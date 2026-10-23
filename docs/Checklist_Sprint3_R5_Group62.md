# R5 Acceptance Test Checklist — Programming Project 1 Eligibility (Group 62)

**Tester:** Bohan Chen  
**Date:** 10 October 2026  
**Build:** main, commit 2fe011f (Windows)  
**Requirement:** R5 — warn when COSC2408 is planned before 192 credit points; never block.

Acceptance criteria: AC1 COSC2408 can be placed anywhere in the plan. AC2 Warning shown when fewer than 192 credit points have been accumulated at that point. AC3 Warning explains 192 has not been reached. AC4 Saving is never prevented by this warning.

Setup: February intake, CS Major. All courses 12 credits. Y1 S1: Introduction to Mathematics for Computing, Cloud Computing, Intelligent Decision Making, Social Media and Networks Analytics. Y1 S2: Foundations of Artificial Intelligence for STEM, Mathematics for Computing 1, Essentials of Computing, Computing Theory. Y2 S1: Software Engineering Fundamentals, Algorithms and Analysis, Innovation Ecosystem and the Future of Work, Machine Learning. Y2 S2: Operating Systems Principles, Deep Learning, Managing Semi-structured and Unstructured Data, Artificial Intelligence. Prerequisite and co-requisite warnings are out of scope.

Result: all 10 tests Pass. R5 can be signed off. Observations (not R5 failures): the summary warning bar above the footer lists prerequisites only, not the credit threshold; Clear all does not reset the selected major label; ISS-10 and ISS-11 remain open.

| ID | AC | Steps | Expected result | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| R5-T1 | AC1, AC2 | Empty plan. Add Programming Project 1 to Year 1 Semester 1 only. | Course is added. Credit threshold warning shows needs 192 more. | Pass |  |
| R5-T8 | AC3 | Read the R5-T1 warning. | Warning states 192 credit points not yet reached. | Pass |  |
| R5-T10 | AC2 | Remove Programming Project 1. Plan the 16 test courses (see Setup), skipping both Summer terms. | No credit threshold warning on any other course. | Pass |  |
| R5-T2 | AC2 | Add Programming Project 1 to Year 3 Semester 1 (192 credits before it). | No credit threshold warning. | Pass |  |
| R5-T7 | AC1 | Compare R5-T1 and R5-T2: Programming Project 1 placed in Year 1 Semester 1 and in Year 3 Semester 1. | Course can be placed in either term; warning shown only when below 192. | Pass |  |
| R5-T6 | AC2 | From R5-T2, remove Machine Learning from Year 2 Semester 1 (180 credits before). | Warning appears: needs 12 more. | Pass |  |
| R5-T3 | AC2 | State after R5-T6: 180 credits before Programming Project 1. | Warning: needs 12 more. | Pass | Same step as R5-T6. |
| R5-T5 | AC2 | Add Machine Learning to Year 3 Semester 1 (same term as Programming Project 1), then remove it. | Warning unchanged: needs 12 more. | Pass |  |
| R5-T4 | AC2 | Add Introduction to Cyber Security to Year 2 Summer Semester. | Course is added. Warning disappears (summer credits counted). | Pass |  |
| R5-T9 | AC4 | Refresh the page. With a warning showing, click Download study plan and open the PDF. | Plan remains after refresh. Dialog lists the warning but does not block. PDF downloads. | Pass | PDF still shows ISS-10 (wrong term headings, course IDs). |
