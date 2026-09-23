import {
  isRequisiteMet,
  missingRequisites,
  getCoreqIssues,
} from "./requisites";

describe("isRequisiteMet", () => {
  it("treats null/empty as met", () => {
    expect(isRequisiteMet(null, [])).toBe(true);
    expect(isRequisiteMet("null", [])).toBe(true);
    expect(isRequisiteMet(undefined, [])).toBe(true);
  });
  it("requires one alternative per AND group", () => {
    expect(isRequisiteMet("004302 AND 054076", ["004302", "054076"])).toBe(
      true,
    );
    expect(isRequisiteMet("004302 AND 054076", ["004302"])).toBe(false);
  });
  it("accepts any OR alternative", () => {
    expect(isRequisiteMet("004302 OR 004309", ["004309"])).toBe(true);
  });
});

describe("missingRequisites", () => {
  it("lists only the unmet group", () => {
    expect(missingRequisites("004302 AND 054076", ["004302"])).toEqual([
      "054076",
    ]);
  });
});

describe("getCoreqIssues", () => {
  it("flags a corequisite planned in a later term", () => {
    const plan = {
      "Semester 1": [
        { id: "054081", name: "Java Programming Studio", credit: 12 },
      ],
      "Semester 2": [
        { id: "054079", name: "Java Programming Bootcamp", credit: 12 },
      ],
    };
    const issues = getCoreqIssues(plan, { "054081": "054079" });
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({ semesterNumber: 1, courseId: "054081" });
    expect(issues[0].missingIds).toEqual(["054079"]);
  });

  it("is satisfied when the corequisite is in the same or an earlier term", () => {
    const plan = {
      "Semester 1": [
        { id: "054081", name: "Java Programming Studio", credit: 12 },
        { id: "054079", name: "Java Programming Bootcamp", credit: 12 },
      ],
    };
    expect(getCoreqIssues(plan, { "054081": "054079" })).toHaveLength(0);
  });
});
