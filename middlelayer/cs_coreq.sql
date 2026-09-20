DROP TABLE IF EXISTS `requisite_rule`;

CREATE TABLE
    `requisite_rule` (
        `rule_id` int NOT NULL AUTO_INCREMENT,
        `target_course_id` varchar(50) NOT NULL,
        `enabled` tinyint (1) NOT NULL DEFAULT 1,
        PRIMARY KEY (`rule_id`),
        KEY `target_course_id` (`target_course_id`),
        CONSTRAINT `requisite_rule_ibfk` FOREIGN KEY (`target_course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `requisite_group`;

CREATE TABLE
    `requisite_group` (
        `group_id` int NOT NULL AUTO_INCREMENT,
        `rule_id` int NOT NULL,
        `parent_group_id` int NULL,
        `operator` varchar(50) NOT NULL,
        PRIMARY KEY (`group_id`),
        KEY `rule_id` (`rule_id`),
        KEY `parent_group_id` (`parent_group_id`),
        CONSTRAINT `requisite_group_ibfk_rule` FOREIGN KEY (`rule_id`) REFERENCES `requisite_rule` (`rule_id`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT `requisite_group_ibfk_parent` FOREIGN KEY (`parent_group_id`) REFERENCES `requisite_group` (`group_id`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci AUTO_INCREMENT = 1000;

DROP TABLE IF EXISTS `requisite`;

CREATE TABLE
    `requisite` (
        `group_id` int NOT NULL,
        `course_id` varchar(50) NOT NULL,
        `relation` varchar(50) NOT NULL,
        `sort_order` int NOT NULL DEFAULT 0,
        PRIMARY KEY (`group_id`, `course_id`),
        KEY `course_id` (`course_id`),
        CONSTRAINT `requisite_ibfk_group` FOREIGN KEY (`group_id`) REFERENCES `requisite_group` (`group_id`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT `requisite_ibfk_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    requisite_rule (target_course_id, enabled)
SELECT DISTINCT
    course_id,
    1
FROM
    pre_requisite_group_AND;

-- 51 rules
INSERT INTO
    requisite_group (rule_id, parent_group_id, operator)
SELECT
    rule_id,
    NULL,
    'AND'
FROM
    requisite_rule;

-- 53 roots
INSERT INTO
    requisite_group (group_id, rule_id, parent_group_id, operator)
SELECT
    a.group_id,
    r.rule_id,
    root.group_id,
    'OR'
FROM
    pre_requisite_group_AND a
    JOIN requisite_rule r ON r.target_course_id = a.course_id
    JOIN requisite_group root ON root.rule_id = r.rule_id
    AND root.operator = 'AND';

-- 62 OR groups
INSERT INTO
    requisite (group_id, course_id, relation, sort_order)
SELECT
    o.group_id,
    o.course_id,
    'prerequisite',
    ROW_NUMBER() OVER (
        PARTITION BY
            o.group_id
        ORDER BY
            o.course_id
    )
FROM
    pre_requisite_group_OR o
    JOIN requisite_group g ON g.group_id = o.group_id;

-- ~200 leaves
INSERT INTO
    requisite_rule (target_course_id, enabled)
SELECT
    course_id,
    1
FROM
    course
WHERE
    course_id IN ('054081', '054082');

INSERT INTO
    requisite_group (rule_id, parent_group_id, operator)
SELECT
    r.rule_id,
    NULL,
    'AND'
FROM
    requisite_rule r
    JOIN course c ON c.course_id = r.target_course_id
WHERE
    c.course_id IN ('054081', '054082');

INSERT INTO
    requisite_group (rule_id, parent_group_id, operator)
SELECT
    r.rule_id,
    root.group_id,
    'OR'
FROM
    requisite_rule r
    JOIN course c ON c.course_id = r.target_course_id
    JOIN requisite_group root ON root.rule_id = r.rule_id
    AND root.operator = 'AND'
WHERE
    c.course_id IN ('054081', '054082');

INSERT INTO
    requisite (group_id, course_id, relation, sort_order)
SELECT
    orGroup.group_id,
    coreq.bootcamp,
    'corequisite',
    1
FROM
    (
        SELECT
            '054081' AS studio,
            '054079' AS bootcamp
        UNION ALL
        SELECT
            '054082',
            '054080'
    ) coreq
    JOIN requisite_rule r ON r.target_course_id = coreq.studio
    JOIN requisite_group root ON root.rule_id = r.rule_id
    AND root.operator = 'AND'
    JOIN requisite_group orGroup ON orGroup.parent_group_id = root.group_id
    AND orGroup.operator = 'OR';

DROP TABLE IF EXISTS `pre_requisite_group_OR`;

DROP TABLE IF EXISTS `pre_requisite_group_AND`;

DROP TABLE IF EXISTS `group`;