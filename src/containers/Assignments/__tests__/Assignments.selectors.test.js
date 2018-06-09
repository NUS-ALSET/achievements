import cloneDeep from "lodash/cloneDeep";
import { getCourseProps } from "../selectors";
import assert from "assert";
import { getTestState } from "../../../../tests/fixtures/getState";

const COMMON_PROPS = {
  id: "abcTestCourseId",
  name: "test course",
  owner: "abcTestUserOwner",
  members: {
    abcTestUser1: {
      id: "abcTestUser1",
      name: "Test User 1",
      achievements: {
        CodeCombat: { id: "test-user-1", totalAchievements: 100 }
      },
      progress: {
        totalSolutions: 2,
        lastSolutionTime: 1001
      },
      solutions: {
        abcTestAssignmentId: {
          orderValue: 100,
          createdAt: 1000,
          value: "test-user-1 (100)",
          validated: true,
          published: true
        },
        defTestAssignmentId: {
          createdAt: 1001,
          value: "Completed",
          validated: true,
          published: true
        }
      }
    },
    abcTestUser2: {
      id: "abcTestUser2",
      name: "Test User 1",
      achievements: {
        CodeCombat: { id: "test-user-2", totalAchievements: 10 }
      },
      progress: {
        totalSolutions: 1,
        lastSolutionTime: 1000
      },
      solutions: {
        abcTestAssignmentId: {
          orderValue: 10,
          createdAt: 1000,
          value: "test-user-2 (10)",
          validated: true,
          published: true
        }
      }
    }
  },
  totalAssignments: 2,
  assignments: [
    {
      open: "1959-06-03T00:00",
      deadline: "2100-01-01T00:00",
      questionType: "Profile",
      solutionVisible: true,
      progress: "2/2",
      visible: true,
      id: "abcTestAssignmentId"
    },
    {
      open: "1959-06-03T00:00",
      deadline: "2100-01-01T00:00",
      questionType: "Text",
      solutionVisible: false,
      progress: "1/2",
      visible: true,
      id: "defTestAssignmentId"
    }
  ]
};

describe("assignments selectors tests", () => {
  it("should select correct course", () => {
    const courseProps = getCourseProps(getTestState({}), {
      match: {
        params: {
          courseId: "abcTestCourseId"
        }
      }
    });

    assert.deepEqual(courseProps, COMMON_PROPS);
  });

  // Course owner should take value from `/solutions` ref, not from `/visibleSolutions`
  it("should return props for course owner", () => {
    const courseProps = getCourseProps(getTestState({ tab: 2 }), {
      match: {
        params: {
          courseId: "abcTestCourseId"
        }
      }
    });
    const result = cloneDeep(COMMON_PROPS);
    // So, result for 2nd solution will be real
    result.members.abcTestUser1.solutions.defTestAssignmentId = {
      createdAt: 1001,
      published: true,
      validated: true,
      value: "Test User 1"
    };
    result.members.abcTestUser1.progress.totalSolutions = 2;

    assert.deepEqual(courseProps, result);
  });

  // Student will receive real values for his solutions
  it("should return props for answering", () => {
    const courseProps = getCourseProps(
      getTestState({
        uid: "abcTestUser1"
      }),
      {
        match: {
          params: {
            courseId: "abcTestCourseId"
          }
        }
      }
    );
    const result = cloneDeep(COMMON_PROPS);

    // So, result for 2nd solution will be real
    result.members.abcTestUser1.solutions.defTestAssignmentId = {
      createdAt: 1001,
      published: true,
      validated: true,
      value: "Test User 1"
    };

    result.members.abcTestUser1.progress.totalSolutions = 2;

    assert.deepEqual(courseProps, result);
  });

  it("should return props with solutions at other student", () => {
    const courseProps = getCourseProps(
      getTestState({
        uid: "abcTestUser1",
        solutions: {
          abcTestCourseId: {
            abcTestUser1: {
              abcTestAssignmentId: {
                value: "test-user-1",
                createdAt: 1000
              },
              defTestAssignmentId: {
                value: "Test User 1",
                createdAt: 1001
              }
            },
            abcTestUser2: {
              abcTestAssignmentId: {
                value: "test-user-2",
                createdAt: 1000
              },
              defTestAssignmentId: {
                value: "Test User 2",
                createdAt: 1001
              }
            }
          }
        }
      }),
      {
        match: {
          params: {
            courseId: "abcTestCourseId"
          }
        }
      }
    );
    const result = cloneDeep(COMMON_PROPS);

    // So, result for 2nd solution will be real
    result.members.abcTestUser1.solutions.defTestAssignmentId = {
      createdAt: 1001,
      published: true,
      validated: true,
      value: "Test User 1"
    };

    assert.deepEqual(courseProps, result);
  });

  it("should return props with solutions at other student by owner", () => {
    const courseProps = getCourseProps(
      getTestState({
        tab: 2,
        solutions: {
          abcTestCourseId: {
            abcTestUser1: {
              abcTestAssignmentId: {
                value: "test-user-1",
                createdAt: 1000
              },
              defTestAssignmentId: {
                value: "Test User 1",
                createdAt: 1001
              }
            },
            abcTestUser2: {
              abcTestAssignmentId: {
                value: "test-user-2",
                createdAt: 1000
              },
              defTestAssignmentId: {
                value: "Test User 2",
                createdAt: 1002
              }
            }
          }
        }
      }),
      {
        match: {
          params: {
            courseId: "abcTestCourseId"
          }
        }
      }
    );
    const result = cloneDeep(COMMON_PROPS);

    // So, result for 2nd solution will be real
    result.members.abcTestUser1.solutions.defTestAssignmentId = {
      createdAt: 1001,
      published: true,
      validated: true,
      value: "Test User 1"
    };
    result.members.abcTestUser2.solutions.defTestAssignmentId = {
      createdAt: 1002,
      published: false,
      validated: true,
      value: "Test User 2"
    };

    result.members.abcTestUser2.progress = {
      totalSolutions: 2,
      lastSolutionTime: 1002
    };

    result.assignments[1].progress = "2/2";

    assert.deepEqual(courseProps, result);
  });

  it("should sort by value", () => {
    const courseProps = getCourseProps(
      getTestState({
        sort: {
          field: "abcTestAssignmentId",
          direction: "asc"
        }
      }),
      {
        match: {
          params: {
            courseId: "abcTestCourseId"
          }
        }
      }
    );

    expect(Object.keys(courseProps.members)).toEqual([
      "abcTestUser2",
      "abcTestUser1"
    ]);
  });

  it("should sort by time", () => {
    const courseProps = getCourseProps(
      getTestState({
        solutions: {
          abcTestCourseId: {
            abcTestUser1: {
              defTestAssignmentId: {
                value: "same-value",
                createdAt: 1000
              }
            },
            abcTestUser2: {
              defTestAssignmentId: {
                value: "same-value",
                createdAt: 1001
              }
            }
          }
        },
        visibleSolutions: {
          abcTestCourseId: {
            abcTestUser1: {
              defTestAssignmentId: {
                value: "same-value",
                createdAt: 1000
              }
            },
            abcTestUser2: {
              defTestAssignmentId: {
                value: "same-value",
                createdAt: 1001
              }
            }
          }
        },
        sort: {
          field: "defTestAssignmentId",
          direction: "desc"
        }
      }),
      {
        match: {
          params: {
            courseId: "abcTestCourseId"
          }
        }
      }
    );

    expect(Object.keys(courseProps.members)).toEqual([
      "abcTestUser2",
      "abcTestUser1"
    ]);
  });
});
