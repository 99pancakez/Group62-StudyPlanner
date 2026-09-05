# StudyPlanner - Summer Semester Business Rules (Group 62)

- **Project**: Developing StudyPlanner App version - Team A

- **Client**: Son Hoang Dau

- **Team**: Group 62

- **Author**: Bohan Chen (Business Analyst)

- **Sprint**: 1, Week 2

- **Date**: 4 September 2026

- **Related requirement**: R3 in the StudyPlanner Requirements document

## 1. Purpose

This document lists the business rules for the summer semester. The design and development work has a single agreed description of what the summer semester will be like. It covers what the client has confirmed and what follows from those confirmations.

It does not cover the technical implementation. The database changes for the summer semester are part of the schema design task.

## 2. What the client confirmed

- Summer is a separate semester at the same level as Semester 1 and Semester 2. It is not a flex term and is not related to the flex term concept.

- Summer runs after Semester 2, so the planning order is Semester 1, Semester 2, then Summer.

- Summer offerings change each year. Courses given as examples were Introduction to Cyber Security, Cloud Computing, and Software Engineering Fundamentals.

- There is no maximum number of courses a student can take in summer.

- Program managers maintain the course data and share the updated database with students. Students can also update their own local copy.

## 3. Business rules

### BR1 - Summer is a planning term in its own right

The summer semester appears in the study plan alongside Semester 1 and Semester 2. It is always shown after Semester 2 within the same academic year.

### BR2 - No limit on summer courses

The planner applies no maximum to the number of courses a student places in summer. No warning is shown for planning a large number of summer courses. This follows the client's confirmation and is deliberate: the system does not judge how many summer courses is reasonable.

### BR3 - Summer courses come from the course data

The course database determines which courses are available in summer, in the same way as Semester 1 and Semester 2 availability. No course is hard-coded as a summer course in the application.

### BR4 - Summer offerings must be updatable

Because offerings change every year, the list of summer courses must be able to change without rebuilding the application. Program managers update the course data through the admin portal and share the updated database. A student can also update their own local copy.

### BR5 - Summer counts towards credit and progress

Courses planned in summer are included in credit point totals and progress calculation in the same way as courses in Semester 1 and Semester 2. Summer is not treated as extra or optional study for calculation purposes.

### BR6 - Summer participates in prerequisite checking

A course planned in summer must have its prerequisites satisfied by courses in earlier terms, using the order Semester 1, Semester 2, Summer. A course planned in Semester 1 of the following year may use a summer course as a prerequisite.

### BR7 - Summer participates in co-requisite checking

The same ordering applies to co-requisites. A studio course planned in summer is satisfied by its bootcamp being planned in the same summer term or any earlier term. As with all co-requisite rules, an unmet co-requisite produces a warning and does not block the student.

### BR8 - Summer affects eligibility guidance

The Programming Project 1 warning is based on accumulated credit points at that point in the plan, not on how many years the student has studied. A student who takes summer courses therefore reaches 192 credit points earlier than a student who does not, and the warning stops appearing at that point. This is the intended behaviour and follows directly from R5.

## 4. Impact on other requirements

| Requirement | Impact |
|---|---|
| R4 Course database | Summer availability is part of the course data. The requirement that the data can be updated and shared is what makes BR4 possible. |
| R5 Eligibility guidance | Summer study can bring a student to 192 credit points sooner, as described in BR8. |
| R6 Flex term handling | Summer is separate from flex terms. Removing flex terms does not remove or change summer. |
| R7 UI/UX | The summer semester needs the same card treatment as Semester 1 and Semester 2, positioned after Semester 2, and should not be labelled as optional. |

## 5. Open point

### How a summer term is labelled across the academic year

In Australia the summer term runs from the end of one calendar year into the next, so it sits between Semester 2 of one year and Semester 1 of the following year. The client has confirmed the planning order but has not commented on labelling.

The team's current approach is to show the summer term within the same academic year block as the Semester 2 that precedes it, labelled simply as Summer. This does not affect any of the rules above. It can be raised with the client if the design work suggests a clearer alternative.
