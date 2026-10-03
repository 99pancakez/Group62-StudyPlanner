# StudyPlanner — Issue Report, Sprint 2 Week 3 (Group 62)

**Author**: Bohan Chen (BA) · **Date**: 3 October 2026

**Source**: Sprint 2 Regression Test (Group 62), 3 October 2026 · **Build**: feature/ui-ux-changes, commit ff6bbba

Issue numbers continue from Week 2. Priorities are a suggestion; scheduling is the PM's call.

| ID | Issue | For | Priority |
| --- | --- | --- | --- |
| ISS-8 | start.bat does not run | Finn | High |
| ISS-9 | Backend never starts after the database import | Jonathan, Finn | High |
| ISS-10 | PDF shows wrong term labels and course IDs | Finn | Medium |
| ISS-11 | Prerequisites shown as codes only | Finn | Medium |
| ISS-12 | Underloading message still shown | Finn | Low |

## 1. Issues

### ISS-8 — start.bat does not run

**For**: Finn · **Found in**: R1 AC1, end-to-end step 1

**Reproduce**: Double-click start.bat on Windows.

**Observed**: Every line fails with "not recognised as a command", each missing its first letters (for example 'xist', 'rrorlevel'). The file contains a leftover "…unchanged…" line and a repeated MySQL start block.

**Why it matters**: The one-click launch does not work on the final build, so R1 cannot be signed off.

### ISS-9 — Backend never starts after the database import

**For**: Jonathan, Finn · **Found in**: R1 AC1

**Reproduce**: Start the backend with startmiddlelayer.bat.

**Observed**: The database import finishes but never exits, so the server never starts and the planner shows "Failed to fetch". Jonathan's fix (commit 106ddc3) was made after PR #6 was merged, so it is not on main or feature/ui-ux-changes.

**Why it matters**: Even with ISS-8 fixed, the planner would not load.

### ISS-10 — PDF shows wrong term labels and course IDs

**For**: Finn · **Found in**: end-to-end step 8

**Reproduce**: Plan courses in Year 1 and Year 2, including summer, then Download study plan.

**Observed**: Each table has an old "Semester 1–4" heading above it and the correct label below it, so "Summer Semester (Year 1)" appears above Year 2's table. Courses are listed by ID (for example 054081) instead of code (COSC2803).

**Why it matters**: The downloaded plan is what students share with advisers; it must match the screen.

### ISS-11 — Prerequisites shown as codes only

**For**: Finn · **Found in**: R7-2 · **Earlier**: OBS-3 (Week 2)

**Observed**: Course cards read, for example, "Prerequisites: COSC2801", with no course name.

**Why it matters**: R7 (US-10) requires names so students know which course is meant.

### ISS-12 — Underloading message still shown

**For**: Finn · **Found in**: during testing, outside the acceptance criteria · **Earlier**: OBS-2 (Week 2); Calvier's QA N-05

**Observed**: A red box reads "12 of 48 credits. Taking fewer needs Program Manager approval".

**Why it matters**: Underloading is out of scope, the approved design removed it, and the approval rule has not been confirmed by the client.

## 2. Status of earlier issues

| ID | Issue | Status |
| --- | --- | --- |
| ISS-5 | Empty summer blocks the next year | Closed — Skip Summer works from Year 2 onwards, retested 3 October |
| ISS-6 | Course availability differs between branches | Open — the merge kept main's data; development team to confirm against the client's file |
| ISS-7 | One-click launch works on Windows only | Open — Sprint 3 |
