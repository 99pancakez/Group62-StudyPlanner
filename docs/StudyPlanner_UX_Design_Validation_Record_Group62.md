# StudyPlanner - UX Design Validation Record (Group 62)

- **Project**: Developing StudyPlanner App version - Team A

- **Client**: Son Hoang Dau

- **Team**: Group 62

- **Author**: Bohan Chen (Business Analyst)

- **Sprint**: 1, Week 3

- **Date**: 10 September 2026

- **Validated against**: StudyPlanner Requirements (Group 62), confirmed with the client 20 August 2026

## Purpose

This record covers the business analyst review of the StudyPlanner interface design against the confirmed requirements. It states what was reviewed, which requirements are represented in the design, what gaps were found and how they were resolved, and records the business analyst approval for the design to go to the client.

## What was reviewed

The review covered two rounds of design work produced by the UX role.

- The UX and RMIT branding guidelines, covering typography, colour, buttons, layout, warning design and the planned screens.

- The screen designs: main planner, summer semester view, add course, co-requisite warning, Programming Project 1 eligibility warning, and clear plan confirmation.

- Screenshots of the current interface, included by the UX role for comparison.

## Requirements represented in the design

**R1 One-click launch:** Not applicable to the interface design. The launch method does not appear on screen.

**R2 Co-requisite support:** Represented. The warning names the missing bootcamp, states the same-semester-or-earlier rule, and offers Go Back and Continue Anyway. Studio courses remain selectable in the add course list.

**R3 Summer semester:** Represented. Summer appears after Semester 2 with the same card treatment as the other terms, and no limit is applied to the number of courses.

**R4 Course database:** Not applicable to the interface design, other than the admin portal, which is covered separately.

**R5 Eligibility guidance:** Represented. The warning states the 192 credit point threshold, explains that Programming Project 1 is normally taken after two years of study, and allows the student to continue.

**R6 Flex term handling:** Represented by absence. No flex term appears anywhere in the design, which is the required outcome.

**R7 UI/UX improvements:** Represented. Full course names, prerequisite information, a clear all option with confirmation, improved button hierarchy, RMIT visual style, and warnings that inform without blocking.

## Gaps identified and resolved

Four gaps were found in the first round of design. They came from design work started before the client feedback of 18 August 2026, which changed the co-requisite and eligibility requirements.

**Studio course locked in the add course dialog**

The studio course was greyed out with a lock icon until its bootcamp was selected. The client confirmed on 18 August that students sometimes fail the bootcamp but pass the studio, so the studio must stay selectable with a warning. Resolved: the studio is now selectable and the warning appears instead.

**Programming Project 1 shown as a year restriction**

The design stated the course was restricted to Year 2 and instructed the student to move it. R5 is based on accumulated credit points and does not block. Resolved: the warning now states the 192 credit point threshold and allows the student to continue.

**Underloading badges**

Underloading badges appeared on semester cards. Underloading is listed as out of scope in the requirements. Resolved: the badges have been removed.

**Summer semester labelled as optional**

The summer card is labelled "Summer Semester (Optional)". Summer credits count towards progress in the same way as other terms, and Semester 1 and Semester 2 can also be left empty without such a label. The UX role explained the label is intended to show students they can skip summer and move on. Accepted as designed.

## Warning behaviour confirmed

The requirements state that co-requisite and eligibility rules inform the student without blocking the action. This was checked specifically because it applies across R2, R5 and R7.

- Both warnings offer Go Back and Continue Anyway, so the student can always proceed.

- Both warnings state the reason and name the specific course or threshold involved.

- The warning text explicitly tells the student they can continue and save the plan.

- The status and warning components in the design guidelines are described as informing the student without unnecessarily blocking their actions.

## Flex term

The design contains no flex term, which is the required outcome under R6. A check of the shared database found that Flex Term 1 and Flex Term 2 exist as options in the availability table, but no course records use them. All course availability records are Semester 1, Semester 2, or unspecified. R6 therefore needs no data migration work and no design treatment.

## Notes for development

These are not design issues. They are points where the design uses placeholder content that should not be carried into the implementation.

- Course codes differ between screens. The main planner uses the codes from the client database, while the warning screens use placeholder codes. The implementation should use the client data throughout.

- The eligibility warning uses a red error icon while the co-requisite warning uses an amber warning icon. Both are warnings that do not block, so a consistent treatment is preferable.

- The summer card includes a Move to Next Semester action. The behaviour across academic years should be confirmed during implementation.

## Business analyst approval

The design reflects the requirements confirmed with the client on 20 August 2026. The three gaps that conflicted with the requirements have been resolved, and the fourth has been reviewed and accepted. The design is approved from a requirements perspective and is ready to go to the client for review.

**Approved by:** Bohan Chen, Business Analyst, Group 62

**Date:** 10 September 2026

## Client review
 
The client reviewed the design and confirmed it on 11 September 2026. No changes were requested. The formal client sign-off for Sprint 1 is recorded separately by the project manager.
