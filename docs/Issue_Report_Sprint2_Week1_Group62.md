# StudyPlanner — Issue Report, Sprint 2 Week 1 (Group 62)

**Author**: Bohan Chen (BA) · **Date**: 20 September 2026

**Source**: Acceptance Test Checklists R1 and R2 (Group 62), 20 September 2026

None of these is a failure against the R1 or R2 acceptance criteria. Priorities are a suggestion; scheduling is the PM's call.

| ID | Issue | For | Priority |
| --- | --- | --- | --- |
| ISS-1 | Launch does not stop when a step fails | Jonathan | Medium |
| ISS-2 | Launch instructions incomplete | Jonathan | High — blocks R1 sign-off |
| ISS-3 | Frontend install fails on a clean machine | Finn | High — see section 2 |

## 1. Issues

### ISS-1 — Launch does not stop when a step fails

**For**: Jonathan · **Found in**: R1-T4 · **Branch**: feature/packaged-programs-ocl

**Reproduce**: On a machine that has not run the application, disconnect the network and double-click the launch file.

**Observed**: MySQL started. The backend window reported it could not reach the npm registry and aborted. The main window kept waiting on port 3000 and never stopped; the browser never opened.

**Why it matters**: To the user the application looks like it is still starting. Any failure of the backend produces this, not just the missing network — the launch waits on the port rather than on whether the previous step succeeded.

### ISS-2 — Launch instructions incomplete

**For**: Jonathan · **Relates to**: R1-T9 (not run) · **Requirement**: R1 AC5

**Missing from the instructions**: that the first launch needs an internet connection; that it takes noticeably longer than later launches; that several console windows open and must stay open; how to close the application.

**Next step**: Once updated, R1-T9 is run — someone outside the project starts the application on another machine using the instructions alone. R1 is signed off at that point if it passes.

### ISS-3 — Frontend install fails on a clean machine

**For**: Finn · **Found in**: setting up for R2 testing · **Branch**: main

**Reproduce**: On a machine that has not installed this project's packages, run npm install in frontend.

**Observed**: ERESOLVE error. The project requires eslint-plugin-jest 29; react-scripts 5.0.1 depends on a package requiring version 25. --legacy-peer-deps works around it.

**Why it matters**: Only appears on a first install, so a machine that already has the packages will not see it.

## 2. ISS-1 and ISS-3 together

Worth looking at before the branches are merged. The one-click launch runs npm install when packages are missing. After a merge, a student's first launch would hit the ISS-3 conflict, the install would fail, and the launch would then behave as in ISS-1 — waiting with nothing on screen.

Neither issue is visible on a machine that already has the packages, so the combination would most likely first appear on a student's computer rather than a developer's.

## 3. Status

| ID | Raised with | Date | Status |
| --- | --- | --- | --- |
| ISS-1 | Jonathan | 20 September 2026 | Closed |
| ISS-2 | Jonathan | 20 September 2026 | Closed |
| ISS-3 | Finn | 20 September 2026 | Closed |
