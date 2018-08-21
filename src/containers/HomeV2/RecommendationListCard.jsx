import React, { Fragment } from "react";
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
// amber color python, red for youtube
import amber from '@material-ui/core/colors/amber';
import red from '@material-ui/core/colors/red';

import SampleCarousel from './SampleCarousel';


const styles = {
  card: {
    Width: "90%",
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  avatarPy: {
    backgroundColor: amber[500],
  },
  avatarYo: {
    backgroundColor: red[500],
  },
};

class RecommendationListCardPy extends React.PureComponent {
  static propTypes = {
    RecomType: PropTypes.string.isRequired,
    dummyData: PropTypes.array,
  };

  render() {
    // the Firebase data in Redux is nested JSON
    // here temporarily use a dummy JSON with 2 pythonlists and 1 youtubelist
    const { dummyData } = this.props;

    return (
      <Card style={styles.card}>
        {(this.props.RecomType === "python") &&
          <Fragment>
            <CardHeader
              avatar={
                <Avatar aria-label="Recommendation" style={styles.avatarPy}>
                  Py
                </Avatar>
              }
              title="Jupyter Notebook Activities"
              subheader="Recommended for you"
            />
            <CardContent>
              <SampleCarousel
                youtubeRecom={false}
                dataList={dummyData}
              />
            </CardContent>
          </Fragment>
        }
        {(this.props.RecomType === "youtube") &&
          <Fragment>
            <CardHeader
              avatar={
                <Avatar aria-label="Recommendation" style={styles.avatarYo}>
                  Y
                </Avatar>
              }
              title="YouTube Video Activities"
              subheader="Recommended for you"
            />
            <CardContent>
              <SampleCarousel
                youtubeRecom={true}
                dataList={dummyData}
              />
            </CardContent>
          </Fragment>
        }
      </Card>
    );
  }
}


export default RecommendationListCardPy;
