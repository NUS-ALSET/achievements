import firebase from "firebase/app";
export class MessageService {
  fetchCourseMembers(courseId) {
    return firebase
      .database()
      .ref(`/courseMembers/${courseId}`)
      .once("value")
      .then(membersSnapshot => membersSnapshot.val())
      .then(members =>
        Promise.all(
          Object.keys(members).map(memberId =>
            firebase
              .database()
              .ref(`/users/${memberId}`)
              .once("value")
              .then(snap => snap.val())
              .then(member => {
                member.uid = memberId;
                return member;
              })
          )
        )
      );
  }

  sendMessage(data, ref) {
    return firebase
      .database()
      .ref(`/${ref}/${data.groupID}`)
      .push({
        text: data.text,
        senderId: data.senderID,
        timestamp: {
          ".sv": "timestamp"
        }
      })
      .then(ref => console.log(ref));
  }
}

/**
 * @type {MessageService}
 */
export default new MessageService();
