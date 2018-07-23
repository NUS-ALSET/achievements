const admin = require("firebase-admin");
const sinon = require("sinon");

class TestUtils {
  stubDatabase() {
    const databaseStub = sinon.stub(admin, "database");
    const refStub = sinon.stub();

    databaseStub.returns({
      ref: refStub
    });
  }
}

exports.TestUtils = TestUtils;
exports.testUtils = new TestUtils();
