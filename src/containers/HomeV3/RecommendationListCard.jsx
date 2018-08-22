import React, { Fragment } from "react";
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
// amber color python, red for youtube
// for now no text JS game Activities
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
  avataryoutube: {
    backgroundColor: red[500],
  },
  avatarjupyterInline: {
    backgroundColor: amber[500],
  },
};

class RecommendationListCard extends React.PureComponent {
  static propTypes = {
    recomType: PropTypes.string.isRequired,
    recommendationList: PropTypes.array,
  };

  render() {
    const { recommendationList, recomType } = this.props;

    return (
      <div style={{marginBottom : '24px'}}>
        <Card style={styles.card}>
          <Fragment>
            <CardHeader
              avatar={
                <Avatar
                  aria-label="Recommendation"
                  style={
                    styles[`avatar${recomType}`]
                  }
                >
                  {this.props.logoText}
                </Avatar>
              }
              title={this.props.title}
              subheader={this.props.subtitle}
            />
            <CardContent>
              <SampleCarousel
                youtubeRecom={this.props.recomType === 'youtube'}
                dataList={recommendationList}
              />
            </CardContent>
          </Fragment>
        </Card>
      </div>
    );
  }
}

export default RecommendationListCard;
