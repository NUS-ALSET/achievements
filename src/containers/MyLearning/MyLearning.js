/*----------------------*/
/**
 * @file MyLearning container module
 * @created 15.05.2019
 */

import React from "react";
import * as firebase from "firebase";
import "firebase/firestore";

var days = 1; // Days you want to subtract
var date = new Date();
var last = new Date(
  date.getTime() - days * 24 * 60 * 60 * 100
).getMilliseconds();
var allEvents = 0;

var db = firebase.firestore();
var query = db
  .collection("logged_events")
  .where("uid", "==", "dFY3FhbAaxY8FZHMH5WS3RPTrBD3")
  .where("createdAt", ">=", last)
  .orderBy("createdAt", "desc")
  .limit(10);
query
  .get()
  .then(function(querySnapshot) {
    allEvents = querySnapshot.size;
    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  })
  .catch(function(error) {
    console.log("Error getting documents: ", error);
  });

class MyLearning extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allEvents: allEvents
    };
  }

  render() {
    setTimeout(
      function() {
        this.setState({
          allEvents: allEvents
        });
      }.bind(this),
      3000
    );
    return (
      <div>
        <h3>Hey you made {allEvents} events since 4 hrs</h3>
      </div>
    );
  }
}

export default MyLearning;
