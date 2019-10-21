const admin = require("firebase-admin");
const THIRTY_DAYS = 3600000*24*30;

class PathStatisticsGenerator {

  constructor(config = {}) {
    this.state = {};
    this.config = config;
  }
  setState(updatedData) {
    this.state=Object.assign(this.state,updatedData);
  } 
  
}

function runPathStats(data,context){
  console.log("In running pathStatsGenerator") 
  publicPaths=[]
  activityEvents=[]
  let pathVal
  let actVal
  let userKey;
  let pathKey;
  var attempts_arr={}
  let solves_arr={}
  let unique_users={}
  let num_attempts=0
  let num_solves=0
  let completed=0
  let promoters =0
  let detractors=0
  let nps={}
  let total_num=1
  let feedback_arr=[]
  const last_thirty_days=new Date().getTime() - THIRTY_DAYS
  let ref

  return Promise.all([admin
    .database()
    .ref("/paths")
    .once("value").then(snap => snap.val()),
  admin
    .database()
    .ref("/analytics/activityAttempts")
    .once("value")
    .then(snap => snap.val()),
  admin.database().ref("/activities")
    .once("value").then(snap=>snap.val()),
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
  ]).then(async ([paths, fb_act,fb_allact, activities]) => {
   
    Object.keys(paths).forEach(pathKey => {
      pathVal = paths[pathKey]
      pathVal["id"] = pathKey
      if (pathVal['isPublic'] == true) {
        publicPaths.push(pathVal)
      }
    })
    var i = 0
    for (let path in publicPaths) {
      publicPathID = publicPaths[path]["id"]
      for (let actKey in fb_act) {

        actVal = fb_act[actKey]
        pathKey = actVal["pathKey"]
        userKey = actVal["userKey"]
        completed = actVal["completed"]

        if (publicPathID == pathKey && actVal["time"] >= last_thirty_days) {
          if (attempts_arr) {
            Object.keys(attempts_arr).forEach(eachVal => {
              if (eachVal == pathKey) {
                num_attempts = attempts_arr[eachVal]
              }
            })
            attempts_arr[pathKey] = num_attempts + 1
            num_attempts = 0
          }

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
         
          if(actVal["activityType"]=="feedback"){           
            await admin.database().ref('problemSolutions/' + actVal['activityKey'])
            .once("value").then(querysnapshot=>{
              querysnapshot.forEach(doc => {
              
                feedback_arr.push(actVal['activityKey'])
                if(doc.val()>8){
                  promoters=promoters+1
                }else if(doc.val<6){
                  detractors = detractors+1
                }
                          
              }); 
              total_num=Object.keys(feedback_arr).length   
              nps[publicPathID]= ((promoters/total_num)*100)-((detractors/total_num)*100)
              promoters=0
              detractors=0
              total_num=1
              feedback_arr=[]
            })
          }

        }

      }
      let divisor = 1

      let num_users = 0
      
      

      if (unique_users[publicPathID]) {
        num_users = unique_users[publicPathID].length
      }      
      if (i == 0) {
        ref = admin
          .firestore()
          .collection("/path_statistics").doc();
        await ref.set({
          'createdAt': admin.firestore.FieldValue.serverTimestamp(),
          'startDate': (admin.firestore.Timestamp.now().toMillis() - THIRTY_DAYS)
          , 'endDate': admin.firestore.FieldValue.serverTimestamp()
        });
       
      }
      
      
      var strPathName = 'data.'+ i+'.pathName'
      var strPathKey = 'data.'+ i+'.pathKey'
      var strUniqueUsers = 'data.'+ i+'.unique_users'
      
      await ref.update({
          [strPathName]: publicPaths[path]["name"],
          [strPathKey]: publicPathID,
          [strUniqueUsers]: num_users
        
      })
      
      if(nps[publicPathID]){
        await ref.update({          
            ['data.'+i+'.nps']:parseFloat((nps[publicPathID]).toFixed(2))        
      })
      }else{
        await ref.update({          
          ['data.'+i+'.nps']:0})     
      }

      if(solves_arr[publicPathID]){
        divisor = solves_arr[publicPathID]
        await ref.update({          
          ['data.'+i+'.solves']:solves_arr[publicPathID]
      })
      }else{
        await ref.update({          
          ['data.'+i+'.solves']:0})
      }
      
      if(attempts_arr[publicPathID]){
        await ref.update({          
          ['data.'+i+'.attempts']:attempts_arr[publicPathID],
          ['data.'+i+'.attempts_per_solve']: parseFloat((attempts_arr[publicPathID] / divisor).toFixed(2))        
      })
      }else{
        await ref.update({          
          ['data.'+i+'.attempts']:0,
          ['data.'+i+'.attempts_per_solve']: 0     
      })
     }

      
      
      i = i + 1
    }    
  
  })  
};
exports.handler = runPathStats;