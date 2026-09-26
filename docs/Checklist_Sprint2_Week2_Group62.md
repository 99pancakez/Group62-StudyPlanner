# StudyPlanner — Acceptance Test Checklists R2 and R3 (Group 62)

**Author**: Bohan Chen (BA) · **Sprint**: 2, Week 2 · **Date**: 26 September 2026

**Source**: StudyPlanner Requirements (Group 62), 20 August 2026; User Stories, 10 September 2026 (US-3 revised 25 September 2026); Summer Semester Business Rules, 4 September 2026

**Branches**: R2 on feature/corequisite-ux, started manually, tested 25 September · R3 on feature/packaged-programs-ocl, started with the one-click launch, tested 26 September; T6 and T15 retested after commit 60dfc86

**Source column**: AC = requirements document, US = user story, BR = summer semester business rules, Supp = added by the BA

Findings outside the acceptance criteria are listed in section 4 and do not count as a Fail. Issues are detailed in the Week 2 Issue Report.

## 1. R2 — Co-requisite support (Finn Gurry)

Test IDs continue from the Week 1 checklist. The warning appears in two places: inline on the course card when a course is added, and in a dialog when the plan is downloaded.

### 1.1 Checking in the planner (R2-2)

| ID | Test | Steps | Expected | Source | Result |
| --- | --- | --- | --- | --- | --- |
| R2-T6 | Bootcamp same semester | Plan bootcamp and studio in the same semester. | No warning. | AC2, US-2 | Pass |
| R2-T7 | Bootcamp earlier | Bootcamp in Sem 1, studio in Sem 2. | No warning. | AC2, US-2 | Pass |
| R2-T8 | Bootcamp missing | Plan the studio with no bootcamp in the plan. | Warning names the missing bootcamp. | AC3, US-3 | Pass |
| R2-T9 | Bootcamp later | Studio in Sem 1, bootcamp in Sem 2. | Same warning. | AC3, US-3 | Pass |
| R2-T10 | Both pairs alike | Repeat T6–T9 with the C++ pair. | Same results as the Java pair. | US-2 | Pass |
| R2-T11 | Summer in the order | Bootcamp in Sem 1 or 2, studio in Summer of the same year. | No warning. | US-5, BR7 | Blocked — needs merge |
| R2-T12 | Across academic years | Bootcamp in Sem 2 or Summer, studio in Sem 1 the next year. | No warning. | BR7 | Blocked — needs merge |
| R2-T13 | Prerequisite checks intact | Add a course with its prerequisite missing, then with it planned earlier. | Not met, then met, as before co-requisite support. | AC6 | Pass |
| R2-T14 | Bootcamp removed after studio | Plan both, then remove the bootcamp. | Not defined — see section 5. | — | Blocked |

### 1.2 Warning in the interface (R2-3)

| ID | Test | Steps | Expected | Source | Result |
| --- | --- | --- | --- | --- | --- |
| R2-T15 | Warning names the course | Plan a studio without its bootcamp, read the warning. | The specific bootcamp is named. | AC4, US-3 | Pass |
| R2-T16 | Continue Anyway | With a studio missing its bootcamp, choose Download (PDF), then Continue Anyway. | The download goes ahead. | US-3 | Pass |
| R2-T17 | Go Back | As T16, but choose Go Back. | Dialog closes; plan unchanged, so it can be adjusted. | US-3 (revised) | Pass |
| R2-T18 | Saving never blocked | Download the plan with an unmet co-requisite. | The plan downloads. | AC5, US-3 | Pass |
| R2-T19 | Not colour alone | Look at the warning. | Icon and text, not just colour. | US-12 | Pass |

## 2. R3 — Summer semester (Jonathan Fazzari)

Tested on feature/packaged-programs-ocl, which includes a first version of the summer interface. This branch was created before co-requisite support, so co-requisite checks in summer wait for the merge.

### 2.1 Summer in the course data

| ID | Test | Steps | Expected | Source | Result |
| --- | --- | --- | --- | --- | --- |
| R3-T1 | Summer availability in the admin portal | Open the admin portal and look at the availability columns. | A Summer column appears alongside Semester 1 and Semester 2. | BR3, BR4 | Deferred — R4-2 |
| R3-T2 | Client's example courses | Check whether Introduction to Cyber Security, Cloud Computing and Software Engineering Fundamentals are offered in summer. | Each is offered in summer. | BR3 | N/A — OBS-4 |
| R3-T3 | Availability can be changed | Mark a course as available in summer in the admin portal, save, reload. Then unmark it. | Both changes are saved. | BR4, US-7 | Deferred — R4-2 |
| R3-T4 | Summer is not hard-coded | Use T3 on a course the client did not name. | It can be made available in summer through the admin portal alone. | BR3, BR4 | Deferred — R4-2 |
| R3-T5 | Existing availability intact | Compare Semester 1 and Semester 2 availability for five courses before and after summer was added. | Unchanged. | Supp | Pass — see ISS-6 |

### 2.2 Summer in the planner

| ID | Test | Steps | Expected | Source | Result |
| --- | --- | --- | --- | --- | --- |
| R3-T6 | Summer appears after Semester 2 | Look at the terms in Year 1 and Year 2. | Each year shows Semester 1, Semester 2, then a term labelled Summer. | AC1, BR1, US-4 | Pass — retested after ISS-4 fix |
| R3-T7 | A summer course can be added | Add Introduction to Cyber Security to the summer term. | It is accepted. | AC2, US-4 | Pass |
| R3-T8 | A course not offered in summer | Open the summer term's course list. | Only courses offered in summer are listed. | BR3 | Pass |
| R3-T9 | No limit on summer courses | Add every summer course available and save. | All are accepted; no warning about the number. | AC3, BR2, US-4 | Partial — two summer courses in the data |
| R3-T10 | Credits include summer | Compare the credit total with and without summer courses. | The total includes summer credits. | AC5, BR5, US-4 | Pass |
| R3-T11 | Summer satisfies a later prerequisite | Intro to Cyber Security in Year 1 Summer. Add Cyber Security Attack Analysis in Year 2 Sem 1, then in Year 1 Sem 1. | Met in Year 2; not met in Year 1. | AC4, BR6, US-5 | Pass |
| R3-T12 | Summer comes after Semester 2 | C++ Programming Studio in Year 1 Summer. Add Database Systems in Year 1 Sem 2, then in Year 2 Sem 2. | Not met in Year 1; met in Year 2. | AC4, BR6, US-5 | Pass |
| R3-T13 | Co-requisite in summer | Plan a studio in Summer with its bootcamp in an earlier term. | No warning. | AC4, BR7, US-5 | Blocked — needs merge |
| R3-T14 | PP1 warning and summer credits | Reach 192 credit points only through summer courses, then add Programming Project 1. | No credit point warning. | BR8, US-8 | Blocked — R5 not in Sprint 2 |
| R3-T15 | Skipping summer | Leave a summer term empty and choose Move to Next Semester. | The student moves on to the next year. | Supp, design | Pass — retested after ISS-5 fix |

## 3. Results

**R2 —** All six acceptance criteria verified: AC1 and the data side of AC6 in Week 1, the rest this week. Not yet signed off: T11 and T12 need summer and co-requisites in one build, and T14 needs a team decision.

**R3 —** AC1, AC2, AC5 and the prerequisite side of AC4 verified. The two failures found this week (ISS-4, ISS-5) were fixed and retested the same day. AC3 partly verified, limited by the summer data. Co-requisite checking in summer waits for the merge.

| | R2 | R3 |
| --- | --- | --- |
| Passed | T6–T10, T13, T15–T19 | T5–T8, T10–T12, T15 |
| Failed | None | None |
| Partial / N/A | — | T9 partial; T2 N/A |
| Deferred | — | T1, T3, T4 (admin portal, R4-2) |
| Blocked | T11, T12 (merge); T14 (undefined) | T13 (merge); T14 (R5) |
| Signed off | Pending | Pending |

Tested by Bohan Chen, 25–26 September 2026.

## 4. Observations

**OBS-1 —** US-3 assumed the co-requisite warning would appear when a course is added, with Go Back removing it. The implementation warns inline when the course is added and confirms in a dialog on download, where Go Back returns to the plan. US-3 has been revised to match; R2-T17 is tested against the revised criterion.

**OBS-2 —** Semester cards, including summer, show Underloading and Overloading labels. The approved design removed these, since underloading is out of scope, and on a summer card the label suggests the student has taken too little. Likely addressed with the Week 3 UX work.

**OBS-3 —** Prerequisites are shown as course IDs or codes rather than course names. This is part of R7 (US-10), scheduled for the Week 3 UX work.

**OBS-4 —** The summer course list in this build is simulated: Introduction to Cyber Security and C++ Programming Studio. The client's database has no summer offerings, so the real list is still needed — see section 5.

**OBS-5 —** The admin portal has no Summer column, so summer availability cannot be seen or changed there. Admin portal work (R4-2) is outside Sprint 2, so T1, T3 and T4 are deferred. BR4 depends on it.

**Week 1 issues —** All three closed. ISS-1: a backend failure is now reported and the launch closes (commit 6e130bf). ISS-2: the launch instructions now cover all four missing points; R1-T9 is still run to verify AC5. ISS-3: the frontend installed on a fresh copy of feature/corequisite-ux with no workaround.

## 5. Open items

1. Bootcamp removed after the studio is planned — behaviour undefined, so R2-T14 has no expected result. Needs a team decision before R2 can be signed off.

2. Real summer offerings — the requirements document (section 6) assumes the client's data includes summer availability; it does not. The actual list is needed from the client or program managers, and the assumption should be corrected.

3. Course data differs between branches (ISS-6) — confirm which branch matches the client's file before merging. R1-T6 relied on the development team's confirmation, so this check confirms it as well.

4. After the merge — run R2-T11, R2-T12 and R3-T13.

5. R1-T9 — run with Calvier or Asra to close out R1.
