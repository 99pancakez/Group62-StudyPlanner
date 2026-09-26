# StudyPlanner — Issue Report, Sprint 2 Week 2 (Group 62)

**Author**: Bohan Chen (BA) · **Date**: 26 September 2026

**Source**: Acceptance Test Checklists R2 and R3 (Group 62), 26 September 2026

Issue numbers continue from Week 1. No issues were found in R2 this week. Priorities are a suggestion; scheduling is the PM's call.

| ID | Issue | For | Priority |
| --- | --- | --- | --- |
| ISS-4 | Summer not labelled after Year 1 | Jonathan | Medium |
| ISS-5 | An empty summer term blocks the next year | Jonathan | High |
| ISS-6 | Course availability differs between branches | PM, with both developers | High — resolve before merge |

## 1. Issues

### ISS-4 — Summer not labelled after Year 1

**For**: Jonathan · **Found in**: R3-T6 · **Branch**: feature/packaged-programs-ocl

**Reproduce**: Plan courses into Year 2 and look at the third term of each year.

**Observed**: Year 1's third term is labelled "Summer Semester (Year 1)". Year 2's is labelled "Semester 6 (Year 2)".

**Why it matters**: From Year 2 onwards a student cannot tell which term is summer.

### ISS-5 — An empty summer term blocks the next year

**For**: Jonathan · **Found in**: R3-T15 · **Branch**: feature/packaged-programs-ocl

**Reproduce**: Leave a summer term empty.

**Observed**: The summer card's Move to Next Semester button is disabled, so the following year cannot be reached.

**Why it matters**: Summer is optional. A student who does not take summer cannot plan the rest of the degree. Also noted in the developer's completion comment.

### ISS-6 — Course availability differs between branches

**For**: PM, with both developers · **Found in**: R3-T5, comparing against the Week 1 admin portal

**Observed**: Data Communication and Net-Centric Computing, Algorithms and Analysis, and Software Engineering Fundamentals run in Semester 1 and Semester 2 on main, but Semester 1 only on feature/packaged-programs-ocl. The difference predates the summer change and is wider than these three courses.

**Why it matters**: The two branches cannot both match the client's file. One set has to be chosen at the merge; the wrong one would show students incorrect semester availability.

**Next step**: Check these courses against StudyPlanner-Student_9Nov2025.zip before merging.

## 2. Week 1 issues

| ID | Issue | Status |
| --- | --- | --- |
| ISS-1 | Launch does not stop when a step fails | Closed — backend failure now reported and the launch closes (commit 6e130bf) |
| ISS-2 | Launch instructions incomplete | Closed — instructions cover all four points; R1-T9 still run to verify AC5 |
| ISS-3 | Frontend install fails on a clean machine | Closed 25 September — installs with no workaround |

## 3. Status

| ID | Raised with | Date | Status |
| --- | --- | --- | --- |
| ISS-4 | Jonathan | 26 September 2026 | Closed — retested 26 September |
| ISS-5 | Jonathan | 26 September 2026 | Closed — retested 26 September |
| ISS-6 |  | 26 September 2026 | Open |
