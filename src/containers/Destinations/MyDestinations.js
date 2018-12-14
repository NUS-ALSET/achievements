
import React from "react";

import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect, isLoaded } from "react-redux-firebase";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";


import Destinations from "./Destinations";

function MyDestinations(props) {
  const { destinations = [], dispatch } = props;

  return (
    <div>
      <Typography variant="h4">My Destinations</Typography>
      {
        isLoaded(destinations)
        ? destinations.length > 0
            ? <Destinations destinations={destinations} dispatch={dispatch} />
            : <Typography variant="h3">No Destination</Typography>

        :  <div style={{
            display: "flex",
            flexDirection: "column",
            width: "50px",
            height: "calc(100vh - 200px)",
            justifyContent: "center",
            margin: "0 auto"
        }}>
        <CircularProgress size={50} />
      </div>
      }
    </div>
  );


}


const mapStateToProps = state => ({
  destinations: state.firebase.ordered.myDestinations || []
});

export default compose(
  connect(mapStateToProps),
  firebaseConnect((ownProps, store) => {
    const uid = store.getState().firebase.auth.uid;
    return [
      {
        path: "/destinations",
        queryParams: ["orderByChild=originator", `equalTo=${uid}`],
        storeAs : "myDestinations"
      }
    ];
  })
)(MyDestinations);


