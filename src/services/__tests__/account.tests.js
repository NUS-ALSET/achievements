import firebase from "firebase";
import sinon from "sinon";
import { AccountService } from "../account";

describe("Account tests", () => {
  /** @type AccountService */
  let oldDatabase;
  let accountService;
  let fbAuth;
  let fbDb;
  let fbRef;

  beforeEach(() => {
    fbAuth = sinon.stub(firebase, "auth");
    fbDb = sinon.stub();
    fbRef = sinon.stub();
    oldDatabase = firebase.database;
    Object.defineProperty(firebase, "database", {
      configurable: true,
      get: () => fbDb
    });
    fbDb.returns({
      ref: () => fbRef
    });
    accountService = new AccountService();
  });

  afterEach(() => {
    fbAuth.restore();
    delete firebase.database;
    firebase.database = oldDatabase;
  });

  it("should process profile login", () => {
    expect(
      AccountService.processProfile("CodeCombat", "ABC_ DE!#@%FG")
    ).toEqual("abc--defg");
    expect(
      AccountService.processProfile("NotCodeCombat", "ABC_ DE!#@%FG")
    ).toEqual("ABC_ DE!#@%FG");
  });

  it("should process signIn", () => {
    fbAuth.returns({
      signInWithPopup: () =>
        Promise.resolve({
          user: {
            uid: "deadbeef",
            displayName: "testUser",
            photoURL: "test"
          }
        })
    });
    fbRef.returns({
      once: () =>
        Promise.resolve({
          val: () => ({})
        })
    });
    accountService.signIn();
  });
});
