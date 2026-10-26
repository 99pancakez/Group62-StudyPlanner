# Final Test Report — Sprint 3 (Group 62)

**Author:** Bohan Chen (Business Analyst)  
**Date:** 26 October 2026  
**Builds tested:** main 29ab4d8 (25 October; R1, R3, R5, R7 and issue retests), main c3c7be6 (17 October; R4, R6). Windows, Microsoft Edge.  
**Method:** Manual black-box testing from the student's view, against the acceptance checklists in the docs folder.

A requirement is signed off when every criterion passes or is an accepted exception, and no issue against it is open.

## 1. Results by requirement

| Requirement | Status | Evidence / open item |
| --- | --- | --- |
| R1 One-click launch | Partially signed off | Windows AC1–AC4 Pass (25 Oct). AC5 / R1-T9 not tested. macOS reported working by Jonathan; not tested by the BA. |
| R2 Co-requisites | Signed off with exception | R2-T14 (bootcamp removed after its studio is planned): fix merged 25 Oct (PR #17), not tested. |
| R3 Summer semester | Signed off with exception | Real summer course list not yet received from the client. Summer availability in the admin portal now works (25 Oct). |
| R4 Course database | Signed off | All criteria Pass (17 Oct). AC3: course data confirmed as the client's version by the BA (26 Oct); ISS-6 closed. |
| R5 PP1 eligibility | Signed off | Regression ISS-13 fixed; R5 checklist re-run and passed (25 Oct). |
| R6 Flex terms | Signed off | All 10 tests Pass (17 Oct). |
| R7 UI/UX | Signed off | ISS-10 and ISS-11 fixed and retested (25 Oct). Other criteria passed in Sprint 2. |

## 2. Issues

| ID | Issue | Final status |
| --- | --- | --- |
| ISS-1 to ISS-5 | Sprint 2 launch, instructions, install and summer issues | Closed |
| ISS-6 | Course data not confirmed against the client's file | Closed — confirmed as the client's data (26 Oct) |
| ISS-7 | One-click launch on macOS | Resolved per developer report; not tested by the BA |
| ISS-8, ISS-9 | start.bat does not run; backend hangs after import | Closed — Windows launch passed 25 Oct |
| ISS-10 | PDF term headings and course IDs | Closed — retested 25 Oct |
| ISS-11 | Prerequisites shown as codes only | Closed — retested 25 Oct |
| ISS-12 | Underloading warning still shown | Closed — retested 25 Oct |
| ISS-13 | PP1 credit warning missing after data change | Closed — retested 25 Oct |

## 3. Not tested or still open

- R1-T9: someone outside the team follows the README on a clean machine.
- macOS launch tested by the BA.
- R2-T14: test the removal warning merged on 25 October.
- Real summer course list from the client.
- Unmerged launch changes (hotfix/site-auto-launch, hotfix/panel-names): R1 and R4-T7 need a retest if merged.

Signed by Bohan Chen, Business Analyst, 26 October 2026.
