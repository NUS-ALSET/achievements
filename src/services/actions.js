import {
  ASSIGNMENTS_SORT_CHANGE,
  UPDATE_NEW_ASSIGNMENT_FIELD
} from "../containers/Assignments/actions";
import {
  COURSE_NEW_DIALOG_CHANGE,
  COURSE_NEW_REQUEST
} from "../containers/Courses/actions";
import { getJSSkillsDifference } from "./javascript-ast";
import firebase from "firebase/app";
import "firebase/firestore";
export class ActionsService {
  consumerKey = undefined;

  bannedActions = [
    COURSE_NEW_DIALOG_CHANGE,
    COURSE_NEW_REQUEST,
    ASSIGNMENTS_SORT_CHANGE,
    UPDATE_NEW_ASSIGNMENT_FIELD
  ];
  static clearActions = {
    PROBLEM_INIT_SUCCESS: ["payload"]
  };

  static clearKeysFromAction = ["files", "cells", "solvedFiles"];
  static deleteExtraKeys(action) {
    const obj = JSON.parse(JSON.stringify(action));
    const keysTodelete = ActionsService.clearKeysFromAction;
    function deleteKeys(obj) {
      if (obj && typeof obj === "object") {
        Object.keys(obj).forEach(key => {
          if (keysTodelete.includes(key)) {
            delete obj[key];
          } else {
            deleteKeys(obj[key]);
          }
        });
      }
      return obj;
    }
    deleteKeys(obj);
    return obj;
  }
  static pickActionData(action) {
    action = Object.assign({}, action);
    if (
      action.type === "PROBLEM_SOLUTION_SUBMIT_REQUEST" &&
      action.problemId.type === "jest"
    ) {
      action.language = "javascript";
      action.difference = getJSSkillsDifference(
        action.payload.solvedFiles,
        action.problemId.files
      );
    }
    if (
      action.type === "ASSIGNMENT_SOLUTION_REQUEST" &&
      (action.options.pathProblem || {}).type === "jest"
    ) {
      action.language = "javascript";
      action.difference = getJSSkillsDifference(
        action.solution.solvedFiles,
        action.options.pathProblem.files
      );
      delete action.options;
    }
    const clearInfo = ActionsService.clearActions[action.type];

    if (clearInfo) {
      for (const field of clearInfo) {
        delete action[field];
      }
    }

    delete action.type;
    return ActionsService.deleteExtraKeys(action);
  }

  removeEmpty(obj) {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === "object") {
        this.removeEmpty(obj[key]);
      } else if (obj[key] === undefined) {
        delete obj[key];
      }
    });
    return obj;
  }

  // add `store` as first param if needed
  catchAction = () => next => action => {
    const currentUserId =
      firebase.auth().currentUser && firebase.auth().currentUser.uid;
    if (this.consumerKey === undefined && currentUserId) {
      this.consumerKey = "";
      firebase
        .database()
        .ref(`/users/${currentUserId}/consumerKey`)
        .once("value")
        .then(data => (this.consumerKey = data.val() || ""));
    }
    const data = {};
    if (this.consumerKey) {
      data.consumerKey = this.consumerKey;
    }
    if (
      action.type &&
      // Ignore react-redux-firebase builtin actions
      action.type.indexOf("@@reactReduxFirebase") === -1 &&
      !this.bannedActions.includes(action.type) &&
      currentUserId
    ) {
      try {
        const actionDataJSON=ActionsService.pickActionData(action)

        const actionDataToSave = JSON.stringify(
          //ActionsService.pickActionData(action)
          actionDataJSON
        );
        
        let objIndItems={}
       
        if(actionDataJSON["courseId"]){          
          objIndItems.courseId=actionDataJSON["courseId"]
        }
        
              
        if(actionDataJSON["pathId"]){         
          objIndItems.pathId=actionDataJSON["pathId"]
        }
        if(actionDataJSON["pathKey"]){
          objIndItems.pathId=actionDataJSON["pathKey"]
        }
        if(actionDataJSON["problemId"]){          
          objIndItems.activityId=actionDataJSON["problemId"]
        }
        if(actionDataJSON["assignmentId"]){
          objIndItems.assignmentId=actionDataJSON["assignmentId"]
        }
        
        if(actionDataJSON["payload"]){          
          if( actionDataJSON["payload"]["activityKey"]){          
          objIndItems.activityId=actionDataJSON["payload"]["activityKey"]
          }
          if( actionDataJSON["payload"]["pathKey"]){          
            objIndItems.pathId=actionDataJSON["payload"]["pathKey"]
            }
          if(actionDataJSON["payload"]["completed"]){          
            objIndItems.isComplete=actionDataJSON["payload"]["completed"]
            }
          if(actionDataJSON["payload"]["activityType"]){          
            objIndItems.activityType=actionDataJSON["payload"]["activityType"]
            }  
        }

        if(actionDataJSON["cohortId"]){          
          objIndItems.cohortId=actionDataJSON["cohortId"]
        }   
        //Commenting out logging to firebase as all the logged_events will be in firestore gng fwd    
        /*firebase
          .database()
          .ref("/logged_events")
          .push({
            ...data,
            createdAt: {
              ".sv": "timestamp"
            },
            type: action.type,
            uid: currentUserId,
            version: process.env.REACT_APP_VERSION,
            otherActionData: actionDataToSave
          }).then((snap)=>{
             firebase
              .database()
                .ref("/logged_events/"+snap.key).update(JSON.parse( JSON.stringify(objIndItems)))
          });*/
        
        const firestore_db = firebase.firestore();
        // Added firestore related changes
        firestore_db.collection("/logged_events").add({
          ...data,
          createdAt: firebase.firestore.Timestamp.now().toMillis(),
          type: action.type,
          uid: currentUserId,
          version: process.env.REACT_APP_VERSION,
          otherActionData: actionDataToSave          
        }).then((snap)=>{                   
          firestore_db.collection("/logged_events").doc(snap.id).update(JSON.parse( JSON.stringify(objIndItems)))
       });
       
      } catch (err) {
        console.error(err, action);
      }
    }
    return next(action);
  };

  constructor() {
    // Refresh blacklist actions on start
    firebase
      .database()
      .ref("/blacklistActions")
      .once("value")
      .then(actions => {
        this.bannedActions = this.bannedActions.concat(
          Object.keys(actions.val() || {})
        );
      });
  }
}

/**
 * For some reason IDEA doesn't catch correct type
 * @type {ActionsService}
 */
export const actionsService = new ActionsService();
