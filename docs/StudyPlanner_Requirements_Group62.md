# StudyPlanner - Requirements (Group 62)

- **Project**: Developing StudyPlanner App version - Team A

- **Client**: Son Hoang Dau

- **Team**: Group 62

- **Author**: Bohan Chen (Business Analyst)

- **Sprint**: 1, Week 1

- **Date**: 20 August 2026

- **Status**: Confirmed with the client on 20 August 2026

## Who should read what

UX: sections 2, 3 and R7. Also read R2 and R5, because R2, R5 and R7 all use warnings that inform the student without blocking the action.

Developers: section 0 for the repository, baseline, course data and technology decisions, then R1 to R6 for the functional detail. R2 and R4 have the largest impact on the data model.

Project manager: sections 3, 5 and 7 for scope, exclusions and the record of what the client has confirmed.

Client: sections 1, 2 and 3 for a summary of what will be delivered.

## 0. Baseline version

### Repository

The team will create a new GitHub repository for this project. The previous Capstone team and Syed's contribution will be acknowledged in the repository. The client will be added as an admin so that access can be granted to future student teams.

### Baseline code

The old Capstone submission zip is not used, as the client has confirmed it is not fully functional. The versions provided by Syed are the development starting point. The client has not chosen between V1 and V2, so the development team decides which version to continue from.

### Course data

The course database bundled with Syed's versions is out of date and must not be used. The client has provided the current data in StudyPlanner-Student_9Nov2025.zip, which contains updated course information, prerequisites and semester availability. This is the source of course data for the project.

### Technology stack

The client does not require any particular technology stack. The development team chooses the stack and architecture.

### Deployment

The application is expected to run locally on the student's computer. The team may explore a hosted solution if it turns out to give a better result.

### Technical observations from the shared code

These observations come from the Capstone submission zip. They describe how the previous system worked and are kept as background, not as a specification.

- Previous technology stack: React frontend (Create React App), Node.js and Express middle layer, Sequelize ORM, MySQL database. PDF export used jsPDF and pdfkit.

- Previous launch process: Node.js installed manually, packages installed through the terminal, the database imported by command, and the frontend and middle layer started in two separate terminals. This is the problem R1 addresses.

- Semester data: The previous database held Semester 1, Semester 2, Flex Term 1 and Flex Term 2, with no summer semester.

- Co-requisites: No co-requisite support existed in the data model or the logic. Only prerequisite AND/OR groups were present.

- Login and admin portal: The previous system included a login screen, password encryption and an admin portal. The client has since confirmed the login screen is not needed, while the admin portal is kept so that the course database can be maintained.

## 1. Problem statement

The current StudyPlanner provides the main course planning functions, but has usability and planning limitations. Users need to install packages manually and use the terminal to launch it. Some planning rules are not supported, including co-requisites, course eligibility guidance and summer semester availability. The interface also makes course information hard to read and study plans hard to manage.

## 2. Target users

The users are RMIT students and academic staff.

Students plan their own study program. This includes students who need to plan courses with co-requisites, students affected by course eligibility guidance, and students who want to include summer courses.

Academic staff are also users. The client has confirmed that staff use the same functions as students, so no separate staff features are required.

The application must be easy to launch and easy to use, so that it is accessible to all users.

## 3. Key improvements for Sprint 2

The following improvements were identified from the client discussion and are the focus of the Sprint 2 MVP.

**Confirmed must-have improvements**

- R1 One-click launch - Users can start the application in one click, without manual package installation or terminal commands.

- R2 Co-requisite support - The planner recognises co-requisite pairs and warns the student when a studio course is planned without its bootcamp. Two pairs are confirmed: Java Bootcamp with Java Programming Studio, and C++ Bootcamp with C++ Studio.

- R3 Summer courses and summer semester - Users can plan summer courses in a separate summer semester, in addition to Semester 1 and Semester 2.

**Additional improvements**

- R4 Course database included in the one-click launch - Course data is available immediately after launch, with no separate setup.

- R5 Programming Project 1 eligibility guidance - The planner warns when Programming Project 1 is planned too early, based on accumulated credit points, but does not block it.

- R6 Flex term handling - Flex term courses are planned as normal Semester 1 and Semester 2 courses. Flex terms are not shown as separate terms.

- R7 UI/UX improvements - Clearer layout, better button visibility, full course names, prerequisites shown with course names, a clear all option, and RMIT visual style.

**Existing features**

The client has confirmed that all existing planning features are kept: major and minor selection, course selection, prerequisite checking, semester availability, credit and progress calculation, PDF course list download, and course removal. The login screen is removed, as the client has confirmed the application requires no login. The admin portal is kept and is used to maintain the course database.

## 4. Detailed requirements

### R1 - Simplified installation and one-click launch

**Priority**: Must-have (confirmed by the client)

**Requirement**

Users must be able to start StudyPlanner in one click. Manual package installation and terminal commands must not be required. The client has confirmed the application is expected to run locally on the student's computer.

Acceptance criteria

- The application starts with a single action, such as opening one file or shortcut.

- No terminal or command line use is required.

- Packages and dependencies are handled by the application, not the user.

- The database is available without a manual import.

- The installation and launch steps are documented for the client.

**Note**

The previous version required Node.js installation, package installation through the terminal, a manual database import, and two separate terminals. The client does not require a particular technology stack, so the development team chooses how to deliver the one-click launch. The team may also explore a hosted solution if it gives a better result, but local execution is the current expectation.

### R2 - Co-requisite support

**Priority**: Must-have (confirmed by the client)

**Requirement**

The planner must support co-requisites in addition to the standard prerequisites. The client has confirmed two course pairs with this relationship:

- Java Bootcamp is the co-requisite of Java Programming Studio.

- C++ Bootcamp is the co-requisite of C++ Studio.

In each pair, the two courses are normally taken together in the same semester, and the bootcamp may also be taken earlier. The client has confirmed that co-requisite relationships apply only to the bootcamp and studio courses, so no other course pairs need to be supported.

The client has confirmed that this must not be a hard restriction. Real cases exist where a student fails the bootcamp but passes the studio, so a student must still be able to plan a studio course without its bootcamp. When this happens, the planner shows a warning instead of blocking the action.

**Acceptance criteria**

- Co-requisite relationships between courses can be stored in the system.

- A studio course can be planned in the same semester as its bootcamp, or after it, with no warning.

- A studio course can still be planned when its bootcamp is missing or planned later, and the planner shows a warning in this case.

- The warning explains which co-requisite is missing.

- The student is never prevented from saving a study plan because of a co-requisite warning.

- Existing prerequisite checking still works and is not affected.

**Note**

The previous system had no concept of a co-requisite, so this needs both a data model change and warning behaviour in the interface. It must therefore also be covered in the Sprint 1 UX design. The relationship should still be stored as a general rule between courses rather than written for one pair only, so that further pairs can be added if the client confirms any in future.

An earlier version of this document described the requirement as dynamic display logic, where a studio course would only appear once its bootcamp was selected. The client feedback of 18 August 2026 replaces this with the warning-based approach above.

### R3 - Summer courses and summer semester

**Priority**: Must-have (confirmed by the client)

**Requirement**

The planner must support summer courses and a summer semester. As confirmed by the client, summer is a separate semester at the same level as Semester 1 and Semester 2. It runs after Semester 2 in the academic year, so the planning order is Semester 1, Semester 2, then Summer. Summer is not related to the existing flex terms.

Summer offerings change each year. Courses mentioned by the client as examples include Introduction to Cyber Security, Cloud Computing, and Software Engineering Fundamentals. The client has confirmed there is no maximum number of summer courses a student can plan.

**Acceptance criteria**

- A summer semester is available in the study plan, shown after Semester 2.

- Courses available in summer can be added to the summer semester.

- No limit is applied to the number of courses a student can plan in summer.

- The summer semester is included in prerequisite and co-requisite checking, using the order Semester 1, Semester 2, Summer.

- Credit and progress calculation includes courses planned in summer.

**Note**

Summer offerings change from year to year, so the course data needs to be updatable rather than fixed in the application. Program managers maintain the course data, as described in R4.

### R4 - Course database included in the one-click launch

**Priority:** Additional requirement

**Requirement**

The course database must be included in the application so that course data is available immediately after launch. Users must not need to install a database server or import data manually. The data comes from the file provided by the client, StudyPlanner-Student_9Nov2025.zip.

**Acceptance criteria**

- Course data is available as soon as the application starts.

- No database installation or manual import is required by the user.

- The course data used is the version provided by the client, not the outdated data bundled with Syed's versions.

- The course database can be exported and shared, so that an updated version can be passed to students.

- The admin portal allows prerequisites and semester availability to be changed, and courses to be added or removed.

**Note**

The client does not require a particular database technology, so the development team chooses the approach. The client has confirmed the database is local, with no global or central version, so no cloud synchronisation is needed. Program managers update the course data and share the updated database with students, and students can also update their own local copy. The admin portal is the tool used for these updates. Because the application requires no login and students already maintain their own local data, the admin portal does not need access control.

### R5 - Programming Project 1 eligibility guidance

**Priority:** Additional requirement

**Requirement**

Programming Project 1 is normally taken in Year 3, but the client has confirmed this must not be a hard restriction. Students may take it earlier. Eligibility is based on accumulated credit points: the client has confirmed that two years of study is 192 credit points and three years is 288 credit points, and that the warning applies when a student has not accumulated 192 credit points. If a student plans the course too early, the planner shows a warning instead of blocking the action. The client has confirmed this guidance currently applies to Programming Project 1 only.

**Acceptance criteria**

- Programming Project 1 can be placed anywhere in a study plan.

- A warning is shown when the student has accumulated fewer than 192 credit points at that point in the plan.

- The warning explains that the student has not yet reached 192 credit points.

- The student is never prevented from saving a study plan because of this warning.

### R6 - Flex term handling

**Priority:** Additional requirement

**Requirement**

Flex terms must not be shown as separate planning terms. As confirmed by the client, the flex term concept is ignored completely. Whether a course is offered in Semester 1, Semester 2 or both is determined by the course database, not by a flex term label. For example, MATH2466 is offered in Semester 1, MATH2411 in Semester 2, and the bootcamp and studio courses in both semesters.

**Acceptance criteria**

- No flex term is shown as a separate term in the planner.

- Courses previously listed under a flex term can still be planned as Semester 1 or Semester 2 courses.

- Flex term labels do not affect prerequisite or co-requisite checking.

- Semester availability for each course follows the course database.

### R7 - UI/UX improvements

**Priority:** Additional requirement

**Requirement**

The interface must be improved so that students can read course information and manage their study plan more easily. The client has asked for the following changes:

- Improved button visibility

- Full course names displayed instead of shortened names

- Prerequisites displayed with course names, not course codes only

- A clear all option to reset the study plan

- RMIT visual style applied to the interface, using the team’s own judgement, as the client has not specified branding assets

- Improved layout, colour scheme and readability

- Warning messages shown when a planning rule is not met

**Acceptance criteria**

- All items listed above are included in the UX design produced in Sprint 1.

- The design is reviewed and approved by the client before Sprint 2 begins.

- Warning messages are shown for prerequisite, co-requisite and credit point eligibility rules.

- Warnings inform the student without blocking the action.

- Existing functions remain available after the interface changes.

**Note**

The detailed design is owned by the UX role and will be delivered as wireframes and a prototype in Sprint 1. This requirement defines what the design must cover, not how it should look.

## 5. Out of scope

The client raised these items in the first meeting but gave them low priority or marked them as future work. They are recorded here so they are not lost and can be reconsidered later.

| Item                                                                                           | Client priority | Reason                                                  |
|------------------------------------------------------------------------------------------------|-----------------|---------------------------------------------------------|
| Course advice, such as recommended study timing and warnings for difficult course combinations | Medium          | Not confirmed as a Sprint 2 deliverable                 |
| Part-time study, underloading and overloading                                                  | Low             | The client indicated this is not a high priority        |
| Credit transfer                                                                                | Low / Future    | Complex to implement and treated as an advanced feature |
| RMIT system integration, such as hosting on RMIT systems and RMIT account login                | Low / Future    | Longer-term consideration                               |

The following are also out of scope:

- A full rewrite or replacement of the existing system

- Any feature not confirmed by the client

## 6. Assumptions

- The versions provided by Syed can be used as the development starting point.

- The course data provided by the client is accurate and covers prerequisites, co-requisites, credit points, summer availability and flex term courses.

- The team can create and manage its own repository, with the client added as an admin.

## 7. Client confirmations

All open questions have now been answered by the client. The client answered the main set on 19 August 2026, confirming that all existing planning features are kept, the application requires no login, the admin portal stays and is used to maintain the course database, staff use the same functions as students, semester availability is driven entirely by the course database, the database is local and maintained by program managers, the eligibility guidance applies to Programming Project 1 only, and the team can use its own judgement on visual style. On 20 August 2026 the client confirmed the credit point threshold for the Programming Project 1 warning as 192 credit points. No questions remain open, and the requirements in this document are confirmed for Sprint 2.
