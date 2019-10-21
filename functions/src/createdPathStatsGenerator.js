/**
 * @file createdPathStatsGenerator- to generate path 
 *                                  statistics for user created paths
 * @author Thangamani Ramasamy <thangamani.r@gmail.com>
 * @created 16.10.19
 */
const admin = require("firebase-admin");
const THIRTY_DAYS = 3600000 * 24 * 30;

function runOwnerPathStats(data, context) {
  console.log("In running createdPathStatsGenerator")
  console.log(data)
  createdPaths = []
  activityEvents = []
  let pathVal
  let actVal
  let userKey;
  let pathKey;
  var attempts_arr = {}
  let solves_arr = {}
  let unique_users = {}
  let num_attempts = 0
  let num_solves = 0
  let completed = 0
  let promoters = 0
  let detractors = 0
  let nps = {}
  let total_num = 1
  let feedback_arr = []
  const last_thirty_days = new Date().getTime() - THIRTY_DAYS


  return Promise.all([admin
    .database()
    .ref("/paths")
    .orderByChild("owner")
    .equalTo(data.userId)
    .once("value").then(snap => snap.val()),
  admin
    .database()
    .ref("/analytics/activityAttempts")
    .once("value")
    .then(snap => snap.val()),
  admin.database().ref("/activities")
    .once("value").then(snap => snap.val()),
  admin.firestore().
    collection('analytics/activityAnalytics/activityAttempts').
    orderBy('createdAt', 'desc').
    //startAt(new Date().getTime() - THIRTY_DAYS).
    limit(10000).get().then(querySnapshot => {
      let allActions = [];
      querySnapshot.forEach(function (doc) {
        allActions.push({ [doc.id]: doc.data() });
      });
      return allActions
    }).catch(err => console.error(err))
  ]).then(async ([paths, fb_act, fb_allact, activities]) => {
    Object.keys(paths).forEach(pathKey => {
      pathVal = paths[pathKey]
      pathVal["id"] = pathKey
      createdPaths.push(pathVal)
    })
    console.log("Created Paths")
    console.log(createdPaths)
    var i = 0
    for (let path in createdPaths) {
      createdPathID = createdPaths[path]["id"]
      for (let actKey in fb_act) {
        actVal = fb_act[actKey]
        pathKey = actVal["pathKey"]
        userKey = actVal["userKey"]
        completed = actVal["completed"]

        if (createdPathID == pathKey && actVal["time"] >= last_thirty_days) {

          Object.keys(attempts_arr).forEach(eachVal => {
            if (eachVal == pathKey) {
              num_attempts = attempts_arr[eachVal]
            }
          })
          attempts_arr[pathKey] = num_attempts + 1
          num_attempts = 0


          if (completed == 1) {
            for (let eachVal in solves_arr) {
              if (eachVal == pathKey) {

                num_solves = solves_arr[pathKey]
              }
            }

            solves_arr[pathKey] = num_solves + 1
            num_solves = 0
          }
          let un_users = []
          for (let eachVal in unique_users) {
            if (eachVal == pathKey) {
              un_users = unique_users[pathKey]
            }
          }
          if (!un_users.includes(userKey))
            un_users.push(userKey)
          unique_users[pathKey] = un_users

          if (actVal["activityType"] == "feedback") {
            await admin.database().ref('problemSolutions/' + actVal['activityKey'])
              .once("value").then(querysnapshot => {
                querysnapshot.forEach(doc => {

                  feedback_arr.push(actVal['activityKey'])
                  if (doc.val() > 8) {
                    promoters = promoters + 1
                  } else if (doc.val < 6) {
                    detractors = detractors + 1
                  }

                });
                total_num = Object.keys(feedback_arr).length
                nps[createdPathID] = ((promoters / total_num) * 100) - ((detractors / total_num) * 100)
                promoters = 0
                detractors = 0
                total_num = 1
                feedback_arr = []
              })
          }

        }

      }
      let divisor = 1

      let num_users = 0



      if (unique_users[createdPathID]) {
        num_users = unique_users[createdPathID].length
      }
      pathRef = admin
        .database()
        .ref(`/paths/${createdPathID}`)
      await pathRef
        .update({
          'createdAt': admin.database.ServerValue.TIMESTAMP,
          // 'startDate': (admin.database.ServerValue.TIMESTAMP - THIRTY_DAYS),
          'endDate': admin.database.ServerValue.TIMESTAMP,
          unique_users: num_users,

        }).then(ref => {
          if (solves_arr[createdPathID]) {
            divisor = solves_arr[createdPathID]
            return pathRef.update({
              'solves': solves_arr[createdPathID]
            })
          } else {
            return pathRef.update({
              'solves': 0
            })
          }
        }).then(ref => {
          if (attempts_arr[createdPathID]) {
            return pathRef.update({
              'attempts': attempts_arr[createdPathID],
              'attempts_per_solve': parseFloat((attempts_arr[createdPathID] / divisor).toFixed(2))
            })
          } else {
            return pathRef.update({
              'attempts': 0,
              'attempts_per_solve': 0
            })
          }
        }).then(ref => {
          if (nps[createdPathID]) {
            console.log("Printing NPS")
            console.log(nps[createdPathID])
            pathRef.update({
              ['nps']: parseFloat((nps[createdPathID]).toFixed(2))
            })
          } else {
            pathRef.update({
              ['nps']: 0
            })
          }

        })

      i = i + 1

    }
  })
}
exports.handler = runOwnerPathStats;