# ER Diagram

The below highlights the ER diagram for the current system (created via [mermaideidtor](https://mermaideditor.com/tools/sql-to-mermaid-erd)):

```mermaid
erDiagram
  admin {
    int admin_id PK
    string admin_name
    string admin_email
    string password
  }
  availability {
    int semester_id PK
    string semester_name
  }
  combination {
    int combination_id PK
    string combination_name
    string program_code FK
  }
  combination_group {
    int combo_group_id PK
    string combo_group_label
  }
  combination_group_mapping {
    int combination_id PK,FK
    int combo_group_id PK,FK
    int total_credit
  }
  combo_group_type_mapping {
    int combo_group_id PK,FK
    int course_type_id PK,FK
  }
  course {
    string course_id PK
    string course_code
    string course_title
    int course_credit
    string web_url
    int prerequisite
    int year
  }
  course_availability {
    string course_id PK,FK
    int semester_id PK,FK
  }
  course_type {
    string course_id PK,FK
    int sub_type_id PK,FK
  }
  group {
    int group_id PK
    string group_type
  }
  history {
    int history_id PK
    string course_id FK
    string program_code FK
    int admin_id FK
    datetime time_stamp
    string field_name
    string old_value
    string new_value
  }
  pre_requisite_group_AND {
    int group_id PK,FK
    string course_id PK,FK
  }
  pre_requisite_group_OR {
    int group_id PK,FK
    string course_id PK,FK
  }
  program_course {
    string program_code PK,FK
    string course_id PK,FK
  }
  program_plan {
    string program_code PK
    int admin_id FK
  }
  sub_type {
    int sub_type_id PK
    string sub_type_name
    int course_type_id FK
  }
  type {
    int course_type_id PK,FK
    string course_type
  }
  program_plan ||--o{ combination : "program_code"
  combination ||--o{ combination_group_mapping : "combination_id"
  combination_group ||--o{ combination_group_mapping : "combo_group_id"
  combination_group ||--o{ combo_group_type_mapping : "combo_group_id"
  type ||--o{ combo_group_type_mapping : "course_type_id"
  course ||--o{ course_availability : "course_id"
  availability ||--o{ course_availability : "semester_id"
  course ||--o{ course_type : "course_id"
  sub_type ||--o{ course_type : "sub_type_id"
  course ||--o{ history : "course_id"
  program_plan ||--o{ history : "program_code"
  admin ||--o{ history : "admin_id"
  group ||--o{ pre_requisite_group_AND : "group_id"
  course ||--o{ pre_requisite_group_AND : "course_id"
  group ||--o{ pre_requisite_group_OR : "group_id"
  course ||--o{ pre_requisite_group_OR : "course_id"
  program_plan ||--o{ program_course : "program_code"
  course ||--o{ program_course : "course_id"
  admin ||--o{ program_plan : "admin_id"
  type ||--o{ sub_type : "course_type_id"
  course_type ||--o{ type : "course_type_id (inferred)"
```

# Co-requisites update

The below diagram incorporates a potential update to the requisite logic. This 
includes a centralised rule table, with groups and course requisites:

```mermaid
erDiagram
  admin {
    int admin_id PK
    string admin_name
    string admin_email
    string password
  }

  availability {
    int semester_id PK
    string semester_name
  }

  combination {
    int combination_id PK
    string combination_name
    string program_code FK
  }

  combination_group {
    int combo_group_id PK
    string combo_group_label
  }

  combination_group_mapping {
    int combination_id PK,FK
    int combo_group_id PK,FK
    int total_credit
  }

  combo_group_type_mapping {
    int combo_group_id PK,FK
    int course_type_id PK,FK
  }

  course {
    string course_id PK
    string course_code
    string course_title
    int course_credit
    string web_url
    int year
  }

  course_availability {
    string course_id PK,FK
    int semester_id PK,FK
  }

  course_type {
    string course_id PK,FK
    int sub_type_id PK,FK
  }

  history {
    int history_id PK
    string course_id FK
    string program_code FK
    int admin_id FK
    datetime time_stamp
    string field_name
    string old_value
    string new_value
  }

  program_course {
    string program_code PK,FK
    string course_id PK,FK
  }

  program_plan {
    string program_code PK
    int admin_id FK
  }

  sub_type {
    int sub_type_id PK
    string sub_type_name
    int course_type_id FK
  }

  type {
    int course_type_id PK
    string course_type
  }

  requisite_rule {
    int rule_id PK
    string target_course_id FK
    boolean enabled
  }

  requisite_group {
    int group_id PK
    int rule_id FK
    int parent_group_id FK
    string operator
  }

  requisite {
    int group_id PK,FK
    string course_id PK,FK
    string relation
    int sort_order
  }

  program_plan ||--o{ combination : "program_code"
  combination ||--o{ combination_group_mapping : "combination_id"
  combination_group ||--o{ combination_group_mapping : "combo_group_id"

  combination_group ||--o{ combo_group_type_mapping : "combo_group_id"
  type ||--o{ combo_group_type_mapping : "course_type_id"

  course ||--o{ course_availability : "course_id"
  availability ||--o{ course_availability : "semester_id"

  course ||--o{ course_type : "course_id"
  sub_type ||--o{ course_type : "sub_type_id"
  type ||--o{ sub_type : "course_type_id"

  course ||--o{ history : "course_id"
  program_plan ||--o{ history : "program_code"
  admin ||--o{ history : "admin_id"

  program_plan ||--o{ program_course : "program_code"
  course ||--o{ program_course : "course_id"
  admin ||--o{ program_plan : "admin_id"

  course ||--o| requisite_rule : "target_course_id"
  requisite_rule ||--|{ requisite_group : "rule_id"

  requisite_group o|--o{ requisite_group : "parent_group_id"
  requisite_group ||--o{ requisite : "group_id"
  course ||--o{ requisite : "required_course_id"
```