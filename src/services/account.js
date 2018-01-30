/**
 * Service for actions with account
 */

export class AccountService {
  setStore(store) {
    this.store = store;
  }

  fetchExternalSources() {
    // This should be in firebase, I guess
    return {
      CodeCombat: {
        url: "https://codecombat.com",
        name: "Code Combat",
        description: "learn to Code JavaScript by Playing a Game"
      }
      /* Unnecessary for now
      FreeCodeCamp: {
        url: "https://fetch-free-code-ca.mp",
        description:
          "<a href='https://www.freecodecamp.org'>Free Code Camp</a>, " +
          "Learn to code with free online courses, programming projects, " +
          "and interview preparation for developer jobs."
      },
      PivotalExpert: {
        url: "https://fetch-pivotal-expe.rt",
        description: "Some description"
      } */
    };
  }
}

export const accountService = new AccountService();
