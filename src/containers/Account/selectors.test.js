import { getDisplayName, getProfileData } from "./selectors";


const mockFirebaseStatesWithProfileData = {
  firebase: {
    data: {
      profileData: {
        country: {
          options: {
            Other: 2,
            Singapore: 1
          },
          title: "Country",
          weight: 1
        },
        school: {
          options: {
            NUSHS: 2,
            "National University of Singapore": 1,
            Other: 4,
            "Singapore Polytechnic": 3
          },
          title: "School",
          weight: 3
        },
        schoolType: {
          options: {
            "Continuing Education": 1,
            "Junior College": 2,
            Polytechnic: 3,
            Primary: 4,
            Secondary: 5,
            University: 6
          },
          title: "School Type",
          weight: 2
        }
      },
      users: {
        I9nQZbQ5xMdklnudDqGfh1ucOZz2: {
          acceptedEULA: true,
          createdAt: 1528774137936,
          displayName: "Keynes CLRS",
          lastAuthTime: 1542772752117,
          photoURL:
            "https://lh6.googleuser/photo.jpg",
          showCodeCombatProfile: true
        }
      }
    },
    auth: {
      uid: "I9nQZbQ5xMdklnudDqGfh1ucOZz2",
      displayName: "Keynes Sergey",
    }
  }
};

describe("Account selectors", () => {
  describe("getDisplayName", () => {
    it("should return undefined if not logged in", () => {
      const mockFirebaseStates = {
        firebase: {
          data: {
            users: {
              user1UID: {
                displayName: "user1DisplayName",
                photoURL:
                  "https://photo1.jpg"
              },
              user2UID: {
                displayName: "user2DisplayName",
                photoURL:
                  "https://photo2.jpg"
              }
            }
          },
          auth: {
            // uid: "user2UID",
            displayName: "displayNameFromFirebaseAuth"
          }
        }
      };
      expect(
        getDisplayName(mockFirebaseStates, {
          match: {
            params: {
              accountId: "user1UID"
            }
          }
        })
      ).toBe(undefined)
    })

    it("should return logged in user displayName if not checking for other uid in url", () => {
      const mockFirebaseStates = {
        firebase: {
          data: {
            users: {
              user1UID: {
                displayName: "user1DisplayName",
                photoURL:
                  "https://photo1.jpg"
              },
              user2UID: {
                displayName: "user2DisplayName",
                photoURL:
                  "https://photo2.jpg"
              }
            }
          },
          auth: {
            uid: "user2UID",
            displayName: "displayNameFromFirebaseAuth"
          }
        }
      };
      expect(
        getDisplayName(mockFirebaseStates, {
          match: {
            params: {
              accountId: "user2UID"
            }
          }
        })
      ).toBe("user2DisplayName")
    })

    it("should return displayName for other uid in url", () => {
      const mockFirebaseStates = {
        firebase: {
          data: {
            users: {
              user1UID: {
                displayName: "user1DisplayName",
                photoURL:
                  "https://photo1.jpg"
              },
              user2UID: {
                displayName: "user2DisplayName",
                photoURL:
                  "https://photo2.jpg"
              }
            }
          },
          auth: {
            uid: "user2UID",
            displayName: "displayNameFromFirebaseAuth"
          }
        }
      };
      expect(
        getDisplayName(mockFirebaseStates, {
          match: {
            params: {
              accountId: "user1UID"
            }
          }
        })
      ).toBe("user1DisplayName")
    })
  });

  describe("getProfileData", () => {
    it("profileData as of Nov 2018 should display three categories", () =>
      expect(getProfileData(mockFirebaseStatesWithProfileData).length).toBe(3));
  });
});
