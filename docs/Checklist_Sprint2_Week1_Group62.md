# StudyPlanner — Acceptance Test Checklists R1 and R2 (Group 62)

**Author**: Bohan Chen (BA) · **Sprint**: 2, Week 1 · **Date**: 20 September 2026

**Source**: StudyPlanner Requirements (Group 62), 20 August 2026; User Stories, 10 September 2026

**Tested on**: Windows machine with no prior Node.js or MySQL installation

**Branches**: R1 on feature/packaged-programs-ocl; R2 on main. No single build has both

**Source column**: AC = requirements document, US = user story, Supp = added by the BA

Findings outside the acceptance criteria are listed in section 4 and do not count as a Fail.

## 1. R1 — One-click launch (Jonathan Fazzari)

| ID | Test | Steps | Expected | Source | Result |
| --- | --- | --- | --- | --- | --- |
| R1-T1 | Single-action launch | Double-click the launch file. Do nothing else. | Planner opens in a browser with no further action. | AC1, US-1 | Pass |
| R1-T2 | No terminal use | Repeat T1, record every action taken. | No commands typed at any point. | AC2, US-1 | Pass |
| R1-T3 | No preinstalled software | Run T1 on a machine with no Node.js or MySQL. | Application starts and is usable. | AC3, US-1 | Pass |
| R1-T4 | No internet connection | Disconnect the network. Run T1 on a machine that has not run it before. | Starts, or explains what is missing. An indefinite wait is a Fail. | Supp | Pass — OBS-1 |
| R1-T5 | Course data on launch | Browse the course list after startup. | Courses are listed with no import step. | AC4, US-1 | Pass |
| R1-T6 | Data matches the client's file | Check course details against the client's data. | Details match. | US-6 | Pass — see note |
| R1-T7 | Starting again | Close everything, run T1 again. | Starts with no error, no repeated setup. | Supp | Pass |
| R1-T8 | Study plan after restart | Add courses, close everything, restart, reopen the planner. | Courses are still in the plan. | Supp | Pass |
| R1-T9 | Someone else can follow it | Give the instructions to a person outside the project; they start it on another machine. | They succeed using the instructions alone. | AC5, US-1 | Not tested — OBS-2 |

*R1-T6 recorded as Pass on the development team's confirmation that the client's database is in use. No course-by-course comparison was made.*

## 2. R2 — Co-requisite support (Finn Gurry)

### 2.1 Data and admin portal (R2-1)

| ID | Test | Steps | Expected | Source | Result |
| --- | --- | --- | --- | --- | --- |
| R2-T1 | Confirmed pairs present | Open the admin portal, check Java and C++ Programming Studio. | Each shows its matching bootcamp. | AC1 | Pass |
| R2-T2 | A new pair can be added | Add a co-requisite to a course that has none. Save, reload. | The co-requisite is saved and still shown. | R2 note | Pass |
| R2-T3 | A pair can be removed | Remove the co-requisite added in T2. Save, reload. | Back to its original state. | R2 note | Pass |
| R2-T4 | Prerequisites unchanged | Check five courses with prerequisites, including AND/OR cases, against the client's data. | All match. Nothing missing or added. | AC6 | Pass |
| R2-T5 | Other studios unaffected | Check a studio the client did not name as part of a pair. | No co-requisite shown. | AC1 | Pass |

### 2.2 Checking in the planner (R2-2) — not delivered

| ID | Test | Steps | Expected | Source | Result |
| --- | --- | --- | --- | --- | --- |
| R2-T6 | Bootcamp same semester | Plan bootcamp and studio in the same semester. | No warning. | AC2, US-2 | Not yet testable |
| R2-T7 | Bootcamp earlier | Bootcamp in Sem 1, studio in Sem 2. | No warning. | AC2, US-2 | Not yet testable |
| R2-T8 | Bootcamp missing | Plan the studio with no bootcamp in the plan. | Warning names the missing bootcamp. | AC3, US-3 | Not yet testable |
| R2-T9 | Bootcamp later | Studio in Sem 1, bootcamp in Sem 2. | Same warning. | AC3, US-3 | Not yet testable |
| R2-T10 | Both pairs alike | Repeat T6–T9 with the C++ pair. | Same results as the Java pair. | US-2 | Not yet testable |
| R2-T11 | Summer in the order | Bootcamp in Sem 1 or 2, studio in Summer of the same year. | No warning. | US-5, BR7 | Not yet testable |
| R2-T12 | Across academic years | Bootcamp in Sem 2 or Summer, studio in Sem 1 the next year. | No warning. | R3-2, BR7 | Not yet testable |
| R2-T13 | Prerequisite checks intact | Plan a course whose prerequisite is missing. | Behaves as before co-requisite support. | AC6 | Not yet testable |
| R2-T14 | Bootcamp removed after studio | Plan both, then remove the bootcamp. | Not defined — see section 5. | — | Blocked |

### 2.3 Warning in the interface (R2-3) — Week 2

| ID | Test | Steps | Expected | Source | Result |
| --- | --- | --- | --- | --- | --- |
| R2-T15 | Warning names the course | Plan a studio without its bootcamp, read the warning. | The specific bootcamp is named. | AC4, US-3 | Not yet testable |
| R2-T16 | Continue Anyway | Choose Continue Anyway, save. | Course added, plan saves. | US-3 | Not yet testable |
| R2-T17 | Go Back | Choose Go Back. | Course not added. | US-3 | Not yet testable |
| R2-T18 | Saving never blocked | Save with an unmet co-requisite. | The plan saves. | AC5, US-3 | Not yet testable |
| R2-T19 | Not colour alone | Look at the warning. | Icon and text, not just colour. | US-12 | Not yet testable |

## 3. Results

**R1 —** AC1 to AC4 verified. AC5 outstanding: R1-T9 cannot run until the launch instructions are updated. The packaged approach works; the application ran on a machine that had never had Node.js or MySQL, which is R1's central claim.

**R2 —** AC1 verified. AC6 verified on the data side; planner behaviour is covered by R2-T13. AC2 to AC5 depend on Week 2 work and are not failures at this point.

|  | R1 | R2 |
| --- | --- | --- |
| Passed | T1, T2, T3, T4, T5, T6, T7, T8 | T1, T2, T3, T4, T5 |
| Failed |  | None |
| Not tested / testable | T9 | T6–T13, T15–T19 |
| Blocked | — | T14 |
| Signed off | Pending AC5 | Pending 2.2 and 2.3 |

Tested by Bohan Chen, 20 September 2026.

## 4. Observations

Outside the acceptance criteria. Detail and reproduction steps are in the Issue Report.

**OBS-1 —** When the backend fails to start, the launch keeps waiting on port 3000 indefinitely with nothing on screen to explain why. Not specific to the no-internet case that reproduced it. Fixed

**OBS-2 —** The launch instructions do not mention that the first launch needs internet, that it is slower, that console windows must stay open, or how to close the application. Fixed

**OBS-3 —** npm install in the frontend fails on a clean machine with an ERESOLVE conflict. --legacy-peer-deps works around it. Invisible on a machine that already has the packages. Fixed

## 5. Open items

1. Bootcamp removed after the studio is planned — behaviour undefined, so R2-T14 has no expected result. Raised in the Sprint 2 Work Items document; needs a team decision.

2. R1-T9 — run once the instructions are updated; Calvier or Asra would be suitable testers.

3. Branches not merged — results recorded before the merge may need confirming afterwards.
