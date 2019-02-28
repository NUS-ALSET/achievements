import firebase from "firebase";
export class MessageService {
    fetchCourseMembers(courseId) {
        return firebase
            .database()
            .ref(`/courseMembers/${courseId}`)
            .once("value")
            .then(membersSnapshot => membersSnapshot.val())
    }

    sendMessage(data, ref) {
        return firebase
        .database()
        .ref(`/${ref}/${data.courseID}`)
        .push({
            text: data.text,
            senderId: data.senderID,
            timestamp: {
                ".sv": "timestamp"
            }
        })
        .then(ref => console.log(ref))
    }
}

/**
 * @type {MessageService}
 */
export default new MessageService();