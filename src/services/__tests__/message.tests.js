import firebase from "firebase/app";
import { MessageService } from "../message.js";

describe("Message tests", () => {
  /** @type MessageService */
  let messageService;

  beforeEach(() => {
    messageService = new MessageService();
  });

  afterEach(() => {
    firebase.restore();
  });
  
  it("should fetch courseMemebers", () => {
    // The return statement must be used to wait for Promises to resolve. 
    return messageService.fetchCourseMembers("ABCD")
    .then(result =>
      expect(result).toEqual(
        [{"displayName": "A", "uid": "A"}]
      )
    );
  });
  // Mock responses for users and coursemembers that will be made. 
  firebase.refStub.withArgs("/users/A").returns({
    once: () =>
      Promise.resolve({
        val: () => ({
            'displayName':'A'
        })
      })
  });
  firebase.refStub.withArgs("/courseMembers/ABCD").returns({
    once: () =>
      Promise.resolve({
        val: () => ({
            'A':true
        })
      })
  });

});
