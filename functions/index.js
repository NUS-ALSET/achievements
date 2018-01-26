const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.downloadEvents = functions.https.onRequest((request, response) => {
  const { token, start, stop = 0 } = request.query

  if (token) {
    admin.database().ref('api_tokens/' + token).once('value').then(snapshot => {
      if (snapshot.val()) {
        const ref = admin.database().ref('logged_events')
        let promise
        let startFrom
        let stopAt

        if (!start) {
          if (stop) {
            stopAt = Date.now() - stop * 24 * 60 * 60 * 1000
            promise = ref.once('value').orderByChild('createdAt').endAt(stopAt)
          } else {
            promise = ref.once('value')
          }
        } else {
          if (stop) {
            stopAt = Date.now() - stop * 24 * 60 * 60 * 1000
            startFrom = Date.now() - (start + 1) * 24 * 60 * 60 * 1000
            promise = ref.orderByChild('createdAt').startAt(startFrom).endAt(stopAt).once('value')
          } else {
            startFrom = Date.now() - (start + 1) * 24 * 60 * 60 * 1000
            promise = ref.orderByChild('createdAt').startAt(startFrom).once('value')
          }
        }

        promise.then(snapshot2 => {
          const log_object = snapshot2.val()
          if (log_object) {
            response.send(log_object)
          } else {
            response.send("No data");
          }
        })
      } else {
        response.send("Invalid token");
      }
    })
  } else {
    response.send("Token is missing");
  }
});