const admin = require("firebase-admin");
const axios = require("axios");
const Queue = require("firebase-queue");

const jupyterAnalysisLambdaProcessor =
  "https://ltp7y8q1ak.execute-api.ap-southeast-1.amazonaws.com/default/code_analysis";

  const getNewFormat=(obj)=>{
    if(typeof obj==='object'){
      let newObj={};
      for(let key in obj){
        const value = obj[key];
        const newValue= getNewFormat(value);
        if(key==='problemAA' || key==='userBB'){
          if(newValue===true){
            return true;
          }else{
          newObj={...newObj, ...newValue} 
          }
        }else{
          newObj[key]=newValue;
        }
      }
      return newObj;
    }
    return obj;
  }

const analyseJupyterSolution = (data, taskKey, owner) => {
  return admin
    .database()
    .ref("/config/jupyterAnalysisLambdaProcessor")
    .once("value")
    .then(lambdaProcessor => lambdaProcessor.val())
    .then(lambdaProcessor =>
      axios({
        url: lambdaProcessor || jupyterAnalysisLambdaProcessor,
        method: "post",
        data: {
          "problemAA": {
            "userBB":  data.solution
          }
        }
      })
    )
    .then(response =>{
      const formattedRes = getNewFormat(response.data.problemSkills)
      return  admin
        .database()
        .ref(`/jupyterSolutionAnalysisQueue/responses/${taskKey}`)
        .set({
          owner: owner,
          skills:formattedRes,
        })
      }
    )
    .catch(err => {
      return (
        console.error(err.message) ||
        admin
          .database()
          .ref(`/jupyterSolutionAnalysisQueue/responses/${taskKey}`)
          .set({ 
            owner,
            error : {
              message : err.message
            } 
          })
      );
    })
    .then(() =>
      admin
        .database()
        .ref(`/jupyterSolutionAnalysisQueue/answers/${taskKey}`)
        .remove()
    );
};

exports.handler = analyseJupyterSolution;

exports.queueHandler = () => {
  const queue = new Queue(
    admin.database().ref("/jupyterSolutionAnalysisQueue"),
    (data, progress, resolve) =>
    analyseJupyterSolution(data, data.taskKey, data.owner).then(() =>
        resolve()
      )
    
  );
  queue.addWorker();
};
