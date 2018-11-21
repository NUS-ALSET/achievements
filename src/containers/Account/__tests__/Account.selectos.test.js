import { getDisplayName, getProfileData } from "../selectors";

const mockFirebaseStates = {
  firebase: {
    data: {
      profileData: null,
      users: {
        Daa0PXSqy4OEc3jY45VuZwzn9JL2: {
          acceptedEULA: true,
          createdAt: 1527755868887,
          displayName: 'Keynes Sergey',
          lastAuthTime: 1542770200129,
          photoURL: 'https://lh6.googleusercontent.com/-bmx1SglPy5w/AAAAAAAAAAI/AAAAAAAABmQ/u45iOXZCPSk/photo.jpg'
        }
      },
    },
    auth: {
      uid: 'Daa0PXSqy4OEc3jY45VuZwzn9JL2',
      displayName: 'Keynes Sergey',
      photoURL: 'https://lh6.googleusercontent.com/-bmx1SglPy5w/AAAAAAAAAAI/AAAAAAAABmQ/u45iOXZCPSk/photo.jpg',
      email: 'peter@gmail.com',
      emailVerified: true,
      phoneNumber: null,
      isAnonymous: false,
      providerData: [
        {
          uid: '102767891093145688995',
          displayName: 'Keynes Sergey',
          photoURL: 'https://lh6.googleusercontent.com/-bmx1SglPy5w/AAAAAAAAAAI/AAAAAAAABmQ/u45iOXZCPSk/photo.jpg',
          email: 'peter@gmail.com',
          phoneNumber: null,
          providerId: 'google.com'
        }
      ],
      apiKey: 'AIzaSyDQuGo8wKcxLbLZo56aYWLTdP2qrbMamYQ',
      appName: '[DEFAULT]',
      authDomain: 'achievements-prod.firebaseapp.com',
      stsTokenManager: {
        apiKey: 'AIzaSyDQuGo8wKcxLbLZo56aYWLTdP2qrbMamYQ',
        refreshToken: 'AEXAG-fm3kwPYj5RpCvqCj6UDZKHMQWBwDS8GSRREsnFesxyp7mvtE1IsEmPBA7bnFIXY44C4lsvfFphDhYptUz-VQEBExZqwJk9H1QyhGGLTsIlDjrHNV1eBuykO30_T_xPIc-2Ey1vZ2vs3xeUuFLyXI4KT9s8iK9tILr_bTA1Iq0R70r4HHbl-eY_8_yu25fMUtkeFljpD6hqopxe2InFffoFZWpbw4nItCuqxvAlb6U7GZqorQBAy7-H0IV_k8kGtwg_rmnl4gw-FuiLR9AQQ8pJ6RibJeHCTJsKJgFOnTUuNpW9p6ifnswGxvYkOYq-Vr6KaB9imsXmKQilnaio8QHEsx4zzDcCdUTpGhf0J6JMKL50WuViu72IhBtNeaieNIPtaZqS',
        accessToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjM1OWJjZGNmZTY2MmQzZjFjMDlkZTFjYmEzMGQ5OWY3ZjRmOThkNjkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYWNoaWV2ZW1lbnRzLXByb2QiLCJuYW1lIjoiS2V5bmVzIFNlcmdleSIsInBpY3R1cmUiOiJodHRwczovL2xoNi5nb29nbGV1c2VyY29udGVudC5jb20vLWJteDFTZ2xQeTV3L0FBQUFBQUFBQUFJL0FBQUFBQUFBQm1RL3U0NWlPWFpDUFNrL3Bob3RvLmpwZyIsImF1ZCI6ImFjaGlldmVtZW50cy1wcm9kIiwiYXV0aF90aW1lIjoxNTQwMzYzMTUyLCJ1c2VyX2lkIjoiRGFhMFBYU3F5NE9FYzNqWTQ1VnVad3puOUpMMiIsInN1YiI6IkRhYTBQWFNxeTRPRWMzalk0NVZ1Wnd6bjlKTDIiLCJpYXQiOjE1NDI3NzAxMTEsImV4cCI6MTU0Mjc3MzcxMSwiZW1haWwiOiJwZXRlcnNlcmdleWtleW5lc0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjEwMjc2Nzg5MTA5MzE0NTY4ODk5NSJdLCJlbWFpbCI6WyJwZXRlcnNlcmdleWtleW5lc0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.DGcPOvoDWx_Ee9eWrWZp3ACwmdKH8CQ8fi5ENAU0iq1UwtcTHgTolerKmy3aJ4YFj4fe2kVq12e_5zGvMoT95mJEN3NhqQqvI5CuA88KKlW5C-V246qDkxGVTwEVFxf1bUxaprRbv7BFp053ZNUuBQy9FAuDbXN5wDJ7f-NiTceQuTz2KwZFcVKnagVqx5HjMe6-NEbu0MPR14vUhBXxC-IQ18bTTCaGrHrI9gAY2yTgK2xXqdNM3C3__XVi8y-aZQ3NtBB-22cXtP2uimsjuJxcWG0MxlkzU9ZtPOy7VENkzT8VCchfd5V1HKrq-Hppq29CZAJe6YxSl3vQsRywWw',
        expirationTime: 1542773710716
      },
      redirectEventId: null,
      lastLoginAt: '1540542872000',
      createdAt: '1527755865000',
      isEmpty: false,
      isLoaded: true
    },
    authError: null
  }
};

const mockFirebaseStatesWithProfileData = {
  firebase: {
    data: {
      profileData: {
        country: {
          options: {
            Other: 2,
            Singapore: 1
          },
          title: 'Country',
          weight: 1
        },
        school: {
          options: {
            NUSHS: 2,
            'National University of Singapore': 1,
            Other: 4,
            'Singapore Polytechnic': 3
          },
          title: 'School',
          weight: 3
        },
        schoolType: {
          options: {
            'Continuing Education': 1,
            'Junior College': 2,
            Polytechnic: 3,
            Primary: 4,
            Secondary: 5,
            University: 6
          },
          title: 'School Type',
          weight: 2
        }
      },
      users: {
        I9nQZbQ5xMdklnudDqGfh1ucOZz2: {
          acceptedEULA: true,
          createdAt: 1528774137936,
          displayName: 'Keynes CLRS',
          lastAuthTime: 1542772752117,
          photoURL: 'https://lh6.googleusercontent.com/-bmx1SglPy5w/AAAAAAAAAAI/AAAAAAAABmQ/u45iOXZCPSk/photo.jpg',
          showCodeCombatProfile: true
        }
      }
    },
    auth: {
      uid: 'I9nQZbQ5xMdklnudDqGfh1ucOZz2',
      displayName: 'Keynes Sergey',
      photoURL: 'https://lh6.googleusercontent.com/-bmx1SglPy5w/AAAAAAAAAAI/AAAAAAAABmQ/u45iOXZCPSk/photo.jpg',
      email: 'sergey@gmail.com',
      emailVerified: true,
      phoneNumber: null,
      isAnonymous: false,
      providerData: [
        {
          uid: '102767891093145688995',
          displayName: 'Keynes Sergey',
          photoURL: 'https://lh6.googleusercontent.com/-bmx1SglPy5w/AAAAAAAAAAI/AAAAAAAABmQ/u45iOXZCPSk/photo.jpg',
          email: 'sergey@gmail.com',
          phoneNumber: null,
          providerId: 'google.com'
        }
      ],
      apiKey: 'AIzaSyA232bBlzWT0fl3ST_KVC3Aay41yTMz5vM',
      appName: '[DEFAULT]',
      authDomain: 'achievements-dev.firebaseapp.com',
      stsTokenManager: {
        apiKey: 'AIzaSyA232bBlzWT0fl3ST_KVC3Aay41yTMz5vM',
        refreshToken: 'AGK09AO-8AxDd6KdfNbA3ux_j8sLic9ZAh6vuoQ4fCrCLrx07_TKIPbclnnzpDOBDMsDO6T6CygzMvm3enWegr7yBPk95nHaIiwlD-RmnQN1qD2rQ9UkRnlyHyueELnns89zAvYSKjhCNODv2VTCxZGevCx7wTCuRY8AyUG-myYvt1V9SWNLynu5tl8TEL7gYZBJX3vE2MhkdOvWwfR5AHp6MWnfWOnSHvGsuV-jXXUlmbahiQvBHr0e7uuFx-EQpvZx_jNW_VJVhCrCP_UghntXe0KWj5o0FrDBNzBYyL3DrmV8tKYjKq7Zfa_A0FYK34pTO4WGEUUkmRO2V9cHq7S75veFS5p8CzklTf1RFNmK2c1qgiaARyew8mbDl9_GnBfWTK7aPxU9',
        accessToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjY1ZjRhZmFjNjExMjlmMTBjOTk5MTU1ZmE1ODZkZWU2MGE3MTM3MmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYWNoaWV2ZW1lbnRzLWRldiIsIm5hbWUiOiJLZXluZXMgU2VyZ2V5IiwicGljdHVyZSI6Imh0dHBzOi8vbGg2Lmdvb2dsZXVzZXJjb250ZW50LmNvbS8tYm14MVNnbFB5NXcvQUFBQUFBQUFBQUkvQUFBQUFBQUFCbVEvdTQ1aU9YWkNQU2svcGhvdG8uanBnIiwiYXVkIjoiYWNoaWV2ZW1lbnRzLWRldiIsImF1dGhfdGltZSI6MTUzOTA0NjgxMywidXNlcl9pZCI6Ikk5blFaYlE1eE1ka2xudWREcUdmaDF1Y09aejIiLCJzdWIiOiJJOW5RWmJRNXhNZGtsbnVkRHFHZmgxdWNPWnoyIiwiaWF0IjoxNTQyNzcyNzQ4LCJleHAiOjE1NDI3NzYzNDgsImVtYWlsIjoicGV0ZXJzZXJnZXlrZXluZXNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDI3Njc4OTEwOTMxNDU2ODg5OTUiXSwiZW1haWwiOlsicGV0ZXJzZXJnZXlrZXluZXNAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.BJ7V987TPcBostTfhEFunDUWiVbzFhrkKqcK4rTn1wiqrITHblNCjwuSC1tNDlkP6GCSrCAmACqo4TV_qBk3M72tSStlU1TMu085FDlNhiKMMdp0n0pLXgYVBxnO1rT4ztNVqI6rl0LKeYsZ0UUbUDK7QTwmezyiEX4kf8idOPW62CRAV3-H7GLLAjh_uquDUjIs3gFLxz4b3zlvAeBSa9QrhVdJPbjgeVOcQarpg_elyhrB1DlRr4PhUU8vTQ-j_WO2hWhYQYhW7TWYbJiMqrTUOBlZgxTXvv9VnOCrGPx8W0MufkYOwgkVPPk_u32BywO82jFRZXwQOM9xPfxUOA',
        expirationTime: 1542776348537
      },
      redirectEventId: null,
      lastLoginAt: '1540967149000',
      createdAt: '1528774136000',
      isEmpty: false,
      isLoaded: true
    },
    authError: null,
  },
}

describe("Account selectors", () => {
  describe("getDisplayName", () => {
    it("should find corresponding name", () =>
      expect(
        getDisplayName(mockFirebaseStates, {
          match: {
            params: {
              accountId: "Daa0PXSqy4OEc3jY45VuZwzn9JL2"
            }
          }
        })
      ).toBe("Keynes Sergey"));

    it("should return noting", () =>
      expect(
        getDisplayName(mockFirebaseStates, {
          match: {
            params: {
              accountId: "no-match"
            }
          }
        })
      ).toBeUndefined());
  });

  describe("getProfileData", () => {
    it("should detect null profileData", () =>
      expect(
        getProfileData(mockFirebaseStates)
      ).toEqual([])
    );

    it("profileData as of Nov 2018 should display three categories", () =>
      expect(
        getProfileData(mockFirebaseStatesWithProfileData).length
      ).toBe(3)
    );
  });
});