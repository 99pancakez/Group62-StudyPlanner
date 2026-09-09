# StudyPlanner - User Stories (Group 62)

- **Project**: Developing StudyPlanner App version - Team A

- **Client**: Son Hoang Dau

- **Team**: Group 62

- **Author**: Bohan Chen (Business Analyst)

- **Sprint**: 1, Week 3

- **Date**: 10 September 2026

- **Source**: StudyPlanner Requirements (Group 62), confirmed with the client 20 August 2026

## Purpose

This document turns the confirmed requirements into user stories with testable acceptance criteria, so that the development team has a clear description of each feature from the user’s point of view.

Every requirement from R1 to R7 is covered by at least one story. Acceptance criteria are written as Given, When, Then so they can be tested directly.

## R1 - One-click launch

### US-1: Start the application in one click

As a student, I want to start StudyPlanner in one click, so that I can plan my courses without installing packages or using the terminal.

**Acceptance criteria**

- Given the application is installed, when I open a single file or shortcut, then the application starts.

- Given I have never used a terminal, when I start the application, then no command line step is required of me.

- Given the application starts, when it loads, then all required packages and dependencies are already handled.

- Given the application starts, when it loads, then course data is available without a manual database import.

- The installation and launch steps are documented for the client.

## R2 - Co-requisite support

### US-2: Plan a studio course with its bootcamp

As a student, I want to plan a studio course together with its bootcamp, so that my study plan follows the normal course sequence.

**Acceptance criteria**

- Given the bootcamp is planned in the same semester as the studio, when I add the studio, then no warning appears.

- Given the bootcamp is planned in an earlier semester, when I add the studio, then no warning appears.

- Given either confirmed pair is planned correctly, being Java Bootcamp with Java Programming Studio or C++ Bootcamp with C++ Studio, when I save, then the plan is accepted without a warning.

### US-3: Be warned when a co-requisite is missing

As a student, I want to be told when I plan a studio course without its bootcamp, so that I know my plan is unusual but can still continue if I have a reason.

**Acceptance criteria**

- Given the bootcamp is not in my plan, when I add the studio, then a warning names the missing bootcamp.

- Given the bootcamp is planned in a later semester than the studio, when I save, then the same warning appears.

- Given the warning is shown, when I choose Continue Anyway, then the plan saves successfully.

- Given the warning is shown, when I choose Go Back, then the course is not added.

- The plan is never blocked from saving because of a co-requisite warning.

## R3 - Summer semester

### US-4: Plan courses in a summer semester

As a student, I want to plan courses in a summer semester, so that I can study over summer and progress through my degree sooner.

**Acceptance criteria**

- Given I am viewing my study plan, when the plan is displayed, then a summer semester appears after Semester 2.

- Given a course is available in summer, when I add it to the summer semester, then it is accepted.

- Given I add several courses to summer, when I save, then no limit is applied to how many I can plan.

- Given I have courses planned in summer, when the credit total is calculated, then those courses are included.

### US-5: Have summer courses recognised in planning rules

As a student, I want to have my summer courses counted towards prerequisites and co-requisites, so that my plan is checked correctly across the whole year.

**Acceptance criteria**

- Given a course is planned in summer, when I plan a course in the following Semester 1 that requires it, then the prerequisite is satisfied.

- Given a studio is planned in summer with its bootcamp in the same summer term or earlier, when I save, then no warning appears.

- Given the checking order, when rules are evaluated, then the order used is Semester 1, Semester 2, Summer.

## R4 - Course database

### US-6: Have course data available on launch

As a student, I want to have course data ready as soon as the application opens, so that I can start planning straight away.

**Acceptance criteria**

- Given I open the application, when it starts, then course data is available with no separate installation.

- Given I open the application, when it starts, then no manual data import is required of me.

- Given the application is running, when course data is used, then it is the version provided by the client rather than the outdated data from the previous version.

### US-7: Update and share the course data

As a program manager, I want to update the course data and share it with students, so that the planner reflects the current course offerings each year.

**Acceptance criteria**

- Given I open the admin portal, when I edit a course, then I can change its prerequisites and semester availability.

- Given I open the admin portal, when I manage the course list, then I can add and remove courses.

- Given I have updated the data, when I export the database, then the file can be shared with students.

- Given a student receives an updated database, when they use it, then their own local copy reflects the new data.

- Given the application requires no login, when the admin portal is opened, then no access control step is required.

## R5 - Programming Project 1 eligibility

### US-8: Be warned when Programming Project 1 is planned too early

As a student, I want to be told when I plan Programming Project 1 before I have enough credit points, so that I understand the course is normally taken later but can still plan it if I choose.

**Acceptance criteria**

- Given my accumulated credit points at that point in the plan are below 192, when I add Programming Project 1, then a warning appears stating I have not yet reached 192 credit points.

- Given my accumulated credit points are 192 or above, when I add Programming Project 1, then no warning appears.

- Given the warning is shown, when I choose to continue, then the plan saves successfully.

- Given I have taken summer courses, when my credit points are counted, then those credits are included and the warning stops once 192 is reached.

- The plan is never blocked from saving because of this warning.

## R6 - Flex term handling

### US-9: Plan without flex terms

As a student, I want to plan my courses using only Semester 1, Semester 2 and Summer, so that I am not shown a term that does not reflect how courses actually run.

**Acceptance criteria**

- Given I am viewing my study plan, when the terms are displayed, then no flex term appears as a separate planning term.

- Given a course was previously listed under a flex term, when I look for it, then it can still be planned as a Semester 1 or Semester 2 course.

- Given a course has a flex term label in the data, when planning rules are checked, then the label does not affect prerequisite or co-requisite checking.

- Given flex terms are not shown, when I browse the course list, then no course has become unavailable as a result.

## R7 - Interface improvements

### US-10: Read course information clearly

As a student, I want to see course information in full and in plain language, so that I can understand my plan without looking up course codes.

**Acceptance criteria**

- Given a course is in my plan, when it is displayed, then its full name is shown rather than a shortened name.

- Given a course has prerequisites, when they are displayed, then course names are shown rather than course codes only.

- Given a course has a co-requisite, when the course is displayed, then the co-requisite is identified.

### US-11: Manage my study plan easily

As a student, I want to find the main actions easily and use them safely, so that I can build and change my plan with confidence.

**Acceptance criteria**

- Given I am viewing my plan, when I look for the main actions, then adding, removing, clearing and downloading are all clearly visible.

- Given I choose to clear my plan, when I select the option, then a confirmation step appears before anything is removed.

- Given the confirmation is shown, when I cancel, then nothing is removed.

- Given I have a plan, when I download it, then the existing PDF download still works.

- Given the interface has changed, when I use the planner, then the existing features still work: major and minor selection, course selection, prerequisite checking, semester availability, credit and progress calculation, PDF download, and course removal.

### US-12: Be informed without being blocked

As a student, I want to be given warnings that explain the problem and let me decide, so that I can plan around real situations that the rules do not cover.

**Acceptance criteria**

- Given a prerequisite, co-requisite or credit point rule is not met, when I take the action, then a warning explains what the issue is.

- Given a warning is shown, when I choose to continue, then the action completes and the plan saves.

- Given a warning is shown, when it is displayed, then it uses text and an icon rather than colour alone.

### US-13: Use an interface that is easy to read and act on

As a student, I want to use a clear layout with visible buttons, so that I can find what I need without hunting around the page.

**Acceptance criteria**

- Given I am viewing my plan, when I look at the buttons available, then primary, secondary and destructive buttons are visually distinct and easy to identify.

- Given I am viewing a semester card, when I look for the add course action, then it is within that card rather than elsewhere on the page.

- Given I am reading my plan, when information is displayed, then the layout, spacing and colour scheme make course details easy to scan.

- Given the RMIT visual style is applied, when I use the planner, then the styling is consistent across screens.

## Coverage check

Every confirmed requirement is covered by at least one story: R1 by US-1, R2 by US-2 and US-3, R3 by US-4 and US-5, R4 by US-6 and US-7, R5 by US-8, R6 by US-9, and R7 by US-10, US-11, US-12 and US-13.
