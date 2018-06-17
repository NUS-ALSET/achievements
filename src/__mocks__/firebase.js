import sinon from "sinon";

class FirebaseMock {
  auth() {
    return this.authStub;
  }
  refreshDbStub() {
    this.dbStub = sinon.stub();
    this.dbStub.returns({
      auth: () => this.authStub,
      ref: () => this.refStub
    });
  }

  configure(config) {
    this.refStub = config.refStub;
    this.authStub = config.authStub;
    this.refreshDbStub();
  }

  restore() {
    this.refStub = sinon.stub();
    this.authStub = sinon.stub();
    this.refreshDbStub();
  }

  initializeApp() {}

  database() {
    return this.dbStub;
  }

  constructor() {
    this.refreshDbStub();
    this.auth.GoogleAuthProvider = function() {};
  }
}

export default new FirebaseMock();
