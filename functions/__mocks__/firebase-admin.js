import sinon from "sinon";

class FirebaseAdminMock {
  refreshDbStub() {
    this.dbStub = sinon.stub();
    this.dbStub.returns({
      auth: this.authStub,
      ref: this.refStub
    });
    this.database = this.dbStub;
    this.auth = this.authStub;
    this.auth.GoogleAuthProvider = function() {};
    // Mocking for firestore
    this.collectionStub.returns({
      add: this.addStub
    });
    this.firestoreDbStub = sinon.stub();
    this.firestore = this.firestoreDbStub;
    this.firestoreDbStub.returns({
      collection: this.collectionStub
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
    this.addStub = sinon.stub();
    this.collectionStub = sinon.stub();
    this.refreshDbStub();
  }

  initializeApp() {}

  database() {
    return this.dbStub;
  }

  firestore() {
    return this.firestoreDbStub;
  }

  snapshot(data) {
    return Promise.resolve({
      val: () => data
    });
  }

  snap(data) {
    return this.snapshot(data);
  }

  constructor() {
    this.restore();
  }
}

module.exports = new FirebaseAdminMock();
