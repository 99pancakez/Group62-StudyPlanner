# Issue Report — Sprint 3 Week 2 (Group 62)

**Reporter:** Bohan Chen  
**Date:** 17 October 2026  
**Build:** main, commit c3c7be6 (Windows)

## ISS-13 — Programming Project 1 credit threshold warning no longer shown

| Field | Detail |
| --- | --- |
| Requirement | R5 (signed off on main 2fe011f, 10 October) |
| Assigned to | Jonathan |
| Severity | High — R5 regression |
| Steps | 1. Clear all. 2. Add Programming Project 1 to Year 1 Semester 1 only. |
| Expected | Credit threshold warning: COSC2408 needs 192 more. |
| Actual | No credit threshold warning. |
| Likely cause | Course data now loads from middlelayer/src/database/seed/data/course.json, where COSC2408 has credit_threshold null. The 192 value was set in cs_coreq_dump.sql, which no longer loads course rows. |
| Retest | Re-run Checklist_Sprint3_R5_Group62 after the fix. |
