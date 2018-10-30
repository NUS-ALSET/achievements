
import React from 'react';

import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect, isLoaded } from "react-redux-firebase";
import Typography from '@material-ui/core/Typography';
import CircularProgress from "@material-ui/core/CircularProgress";


import Destinations from './Destinations';

function AllDestinations(props) {
  const { destinations = [] , dispatch} = props;
  return (
    <div>
      <Typography variant="h3">All Destinations</Typography>
      {
        isLoaded(destinations)
        ? destinations.length > 0
            ? <Destinations destinations={destinations} dispatch={dispatch}/>
            : <Typography variant="h4">No Destination</Typography>
        
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
  )


}


const mapStateToProps = state => ({
  destinations: state.firebase.ordered.destinations || []
});

export default compose(
  connect(mapStateToProps),
  firebaseConnect((ownProps, store) => {
    return [`/destinations`];
  })
)(AllDestinations);


