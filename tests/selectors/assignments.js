import cloneDeep from "lodash/cloneDeep";
import { getCourseProps } from "../../src/containers/Assignments/selectors";
import assert from "assert";
import { getTestState } from "../fixtures/getState";

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
      solutions: {
        abcTestAssignmentId: {
          orderValue: 100,
          value: "test-user-1 (100)",
          validated: true,
          published: true
        },
        defTestAssignmentId: {
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
      solutions: {
        abcTestAssignmentId: {
          orderValue: 10,
          value: "test-user-2 (10)",
          validated: true,
          published: true
        }
      }
    }
  },
  assignments: [
    {
      open: "1959-06-03T00:00",
      deadline: "2100-01-01T00:00",
      questionType: "Profile",
      solutionVisible: true,
      visible: true,
      id: "abcTestAssignmentId"
    },
    {
      open: "1959-06-03T00:00",
      deadline: "2100-01-01T00:00",
      questionType: "Text",
      solutionVisible: false,
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
      published: true,
      validated: true,
      value: "Test User 1"
    };

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
      published: true,
      validated: true,
      value: "Test User 1"
    };

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
                createdAt: 1000
              }
            },
            abcTestUser2: {
              abcTestAssignmentId: {
                value: "test-user-2",
                createdAt: 1000
              },
              defTestAssignmentId: {
                value: "Test User 2",
                createdAt: 1000
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
                createdAt: 1000
              }
            },
            abcTestUser2: {
              abcTestAssignmentId: {
                value: "test-user-2",
                createdAt: 1000
              },
              defTestAssignmentId: {
                value: "Test User 2",
                createdAt: 1000
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
      published: true,
      validated: true,
      value: "Test User 1"
    };
    result.members.abcTestUser2.solutions.defTestAssignmentId = {
      published: false,
      validated: true,
      value: "Test User 2"
    };

    assert.deepEqual(courseProps, result);
  });
});
