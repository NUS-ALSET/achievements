import { getDisplayName } from "../selectors";

const stateFixture = {
  firebase: {
    auth: {
      uid: "deadbeef"
    },
    data: {
      users: {
        test: {
          displayName: "Test Name"
        }
      }
    }
  }
};

describe("Account selectors", () => {
  describe("getDisplayName", () => {
    it("should find corresponding name", () =>
      expect(
        getDisplayName(stateFixture, {
          match: {
            params: {
              accountId: "test"
            }
          }
        })
      ).toBe("Test Name"));

    it("should return noting", () =>
      expect(
        getDisplayName(stateFixture, {
          match: {
            params: {
              accountId: "non-exists"
            }
          }
        })
      ).toBeUndefined());
  });
});
