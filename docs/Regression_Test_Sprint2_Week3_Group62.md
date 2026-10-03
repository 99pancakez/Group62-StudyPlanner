# StudyPlanner — Sprint 2 Regression Test (Group 62)

**Author**: Bohan Chen (BA) · **Sprint**: 2, Week 3 · **Date**: 3 October 2026

**Source**: StudyPlanner Requirements (Group 62), 20 August 2026; User Stories (US-3 revised 25 September 2026); Summer Semester Business Rules; Week 1 and Week 2 acceptance test checklists; Calvier's QA Results Table V2

**Build**: feature/ui-ux-changes, commit ff6bbba — includes the Sprint 2 merge (PR #6) and the UX implementation · **Test machine**: Windows

**How the application was started**: the one-click launch failed (R1 AC1). The remaining tests ran after starting MySQL, the backend and the frontend by hand with the project's own scripts; no code was changed.

**Result values**: Pass, Fail, Partial, Blocked, Not re-run (passed in an earlier week), or Exception — not tested in Sprint 2 for an agreed reason, recorded in section 8

## 1. R1 — One-click launch

| ID | Criterion | Steps | Expected | Result |
| --- | --- | --- | --- | --- |
| AC1 | Starts with a single action | Double-click start.bat. | The planner opens in the browser. | Fail — ISS-8, ISS-9 |
| AC2 | No terminal use | — | No commands typed. | Blocked by AC1 |
| AC3 | Dependencies handled by the application | Run on a machine with no Node.js or MySQL. | Starts and is usable. | Blocked by AC1 |
| AC4 | Database available without import | Browse the course list after launch. | Courses listed; no import step. | Blocked by AC1 |
| AC5 | Launch steps documented | Someone outside the project follows the README (R1-T9). | They start the application without help. | Blocked by AC1 |
| — | macOS | — | — | Exception — ISS-7, Sprint 3 |

## 2. R2 — Co-requisite support

| ID | Criterion | Steps | Expected | Result |
| --- | --- | --- | --- | --- |
| AC1 | Co-requisites stored | In the admin portal, open Java Programming Studio's co-requisites. | Its bootcamp is shown. | Pass |
| AC2 | No warning with or after the bootcamp | Java Bootcamp and Studio in the same semester. | No warning. | Pass |
| AC3 | Warning when the bootcamp is missing or later | Studio alone; then studio Sem 1, bootcamp Sem 2. | Warning both times. | Pass |
| AC4 | Warning names the missing course | Read the warning. | The bootcamp is named. | Pass |
| AC5 | Saving never blocked | With a warning showing, Download study plan; Go Back, then Continue Anyway. | Dialog appears; Go Back leaves the plan unchanged; Continue Anyway downloads. | Pass |
| AC6 | Prerequisite checking unaffected | Database Systems with and without C++ Programming Studio planned earlier. | Not met, then met. | Not re-run — passed Week 2 (R2-T13) |
| BR7 | Co-requisites with summer | C++ Bootcamp in Sem 2, C++ Programming Studio in Summer of the same year. | No warning. | Pass |
| — | Bootcamp removed after the studio is planned | — | — | Exception — behaviour undefined |

## 3. R3 — Summer semester

| ID | Criterion | Steps | Expected | Result |
| --- | --- | --- | --- | --- |
| AC1 | Summer shown after Semester 2 | Look at the terms in Year 1 and Year 2. | Each year: Semester 1, Semester 2, then Summer as a full-width row. | Pass — also Calvier QA-10 |
| AC2 | Summer courses can be added and removed | Open the summer course list; add a course; remove it. | Only summer courses listed; add and remove work as in other terms. | Pass |
| AC3 | No limit on summer courses | Add every summer course available. | All accepted; no message about the number. | Partial — two summer courses in the data |
| AC4 | Summer in prerequisite and co-requisite checking | Cyber Security Attack Analysis in Year 1 Sem 1 and in Year 2 Sem 1, with Introduction to Cyber Security in Year 1 Summer. Co-requisites: R2 row BR7. | Not met in Year 1; met in Year 2. | Pass |
| AC5 | Credits include summer | Compare the credit total with a summer course planned. | The total includes the summer course. | Pass |
| — | Summer availability in the admin portal | — | — | Exception — R4-2, outside Sprint 2 |
| — | Real summer offerings | — | — | Exception — awaiting the client's list |

## 4. R4 — Course database

| ID | Criterion | Steps | Expected | Result |
| --- | --- | --- | --- | --- |
| AC1 | Course data available on start | Browse courses after startup. | Courses load with no import step. | Pass — launch scripts started by hand |
| AC2 | No database installation or import | Covered by R1 AC3. | — | Blocked by R1 AC1 |
| AC3 | Client's data, not the outdated data | The merged build uses main's course data. Check three courses against the client's file. (ISS-6) | Semester availability matches the client's file. | Pending — development team to confirm |
| AC4 | Database can be exported and shared | Look for an export in the admin portal. | An export is available. | Exception — R4-2, outside Sprint 2 |
| AC5 | Admin portal changes | Change a course's semester availability and reload. | The change is saved. | Partial — availability change saved; adding and removing courses not re-run |

## 5. R7 — UI/UX improvements

AC1 and AC2 (items in the Sprint 1 design, approved by the client) are verified by the UX Design Validation Record, 10 September, and the client's confirmation of 11 September.

| ID | Criterion | Steps | Expected | Result |
| --- | --- | --- | --- | --- |
| R7-1 | Full course names | Look at planned courses. | Names shown in full, with the course code. | Pass |
| R7-2 | Prerequisites shown with names | Look at a course with prerequisites or co-requisites. | Course names shown, not only codes. | Fail — ISS-11 |
| R7-3 | Co-requisite identified | Look at Java Programming Studio. | Its co-requisite is shown. | Pass |
| R7-4 | Clear All with confirmation | Clear all and cancel; then confirm. | Cancel removes nothing; confirm clears the plan. | Pass — also Calvier QA-09 |
| R7-5 | Main actions visible | Find add, remove, clear and download. | All clearly visible. | Pass |
| R7-6 | Button hierarchy | Compare the buttons; find Add Course. | Distinct button styles; Add Course inside each semester card. | Pass |
| R7-7 | RMIT visual style | Move through each screen. | Consistent RMIT style. | Pass — Calvier QA-01, QA-11 |
| R7-8 | Warnings for planning rules | Prerequisite and co-requisite warnings. | Shown for both. | Pass — credit point warning is R5, outside Sprint 2 |
| R7-9 | Warnings do not block | As R2 AC5. | The action completes. | Pass |
| R7-10 | Existing functions still work | Course selection, prerequisite checking, semester availability, credit total, course removal. | All work. | Pass — changing the major or minor not re-run |

## 6. End-to-end scenario

| Step | Covers | Action | Expected | Result |
| --- | --- | --- | --- | --- |
| 1 | R1 | Double-click start.bat. | The planner opens. | Fail — ISS-8, ISS-9 |
| 2 | R4 | Choose a program and major. | Courses load. | Pass |
| 3 | R2 | Year 1 Sem 1: Java Programming Studio, then its bootcamp. | Warning, then no warning. | Pass |
| 4 | R2, R3 | Year 1 Sem 2: C++ Programming Bootcamp. Summer: C++ Programming Studio. | No warning; Summer full width after Sem 2; credits include summer. | Pass |
| 5 | R3 | Year 2 Sem 1: Cyber Security Attack Analysis. | Prerequisite met. | Pass |
| 6 | R3 | Leave the Year 2 summer empty; Skip Summer. | Moves on to Year 3. | Pass |
| 7 | R7 | Throughout: course names, prerequisite names, buttons. | As section 5. | Fail — ISS-11 |
| 8 | R7 | Download study plan. | The plan downloads with correct term labels. | Fail — ISS-10 |
| 9 | R7 | Clear all, cancel; Clear all, confirm. | Nothing removed; then the plan is cleared. | Pass |

## 7. Results — playback summary

| Requirement | Criteria | Verified | Not verified | Status |
| --- | --- | --- | --- | --- |
| R1 One-click launch | 5 | 0 | AC1 Fail; AC2–AC5 blocked | Not signed off |
| R2 Co-requisite support | 6 | 6 | — | Signed off with exceptions |
| R3 Summer semester | 5 | 4 | AC3 partial (data) | Signed off with exceptions |
| R4 Course database | 5 | 1 | AC3 pending; AC5 partial; AC2 blocked | Not signed off |
| R7 UI/UX improvements | 10 | 9 | R7-2 | Not signed off |
| End-to-end | 9 steps | 6 | Steps 1, 7, 8 | — |

Tested by Bohan Chen, 3 October 2026.

## 8. Sign-off

A requirement is signed off when every criterion passes or is an accepted exception, and no issue against it is open.

| Requirement | Decision | Accepted exceptions | Reason if not signed off | Date |
| --- | --- | --- | --- | --- |
| R1 | Not signed off | macOS — Sprint 3 (ISS-7) | Launch fails on the final build (ISS-8, ISS-9) | 3 October 2026 |
| R2 | Signed off with exceptions | Bootcamp removed after the studio — behaviour undefined | — | 3 October 2026 |
| R3 | Signed off with exceptions | Summer in the admin portal (R4-2); real summer list from the client; only two summer courses in the data | — | 3 October 2026 |
| R4 | Not signed off | Export (R4-2) | Data source to be confirmed (ISS-6) | 3 October 2026 |
| R7 | Not signed off | Credit point warning — R5 | R7-2 fails (ISS-11) | 3 October 2026 |

Signed by Bohan Chen, Business Analyst.

## 9. Issues

| ID | Issue | Status |
| --- | --- | --- |
| ISS-5 | Empty summer from Year 2 blocks the next year | Closed — Skip Summer works in every year, retested 3 October |
| ISS-6 | Course availability differs between branches | Open — the merge used main's data; awaiting confirmation against the client's file |
| ISS-7 | One-click launch works on Windows only | Open — Sprint 3 |
| ISS-8 to ISS-12 | New — see the Week 3 Issue Report | Open |
