import React, { Fragment } from "react";
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
// import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
// import Typography from '@material-ui/core/Typography';
// amber color python, red for youtube
import amber from '@material-ui/core/colors/amber';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import indigo from '@material-ui/core/colors/indigo';

// import FavoriteIcon from '@material-ui/icons/Favorite';
// import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';

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
  avatarpython: {
    backgroundColor: amber[500],
  },
  avataryoutube: {
    backgroundColor: red[500],
  },
  avatarjupyterInline: {
    backgroundColor: blue[500],
  },
  avatarcodeCombat : {
    backgroundColor: green[500],
  },
  avatartext : {
    backgroundColor: indigo[500],
  }
};

class RecommendationListCardPy extends React.PureComponent {
  static propTypes = {
    recomType: PropTypes.string.isRequired,
    recommendationList: PropTypes.array,
  };

  handleClickMoreVert = () => {
    alert("More to come");
  }

  render() {
    const { recommendationList } = this.props;

    return (
      <div style={{marginBottom : '30px'}}>
      <Card style={styles.card}>
        <Fragment>
          <CardHeader
            avatar={
              <Avatar aria-label="Recommendation" style={styles[`avatar${this.props.recomType}`]}>
                {this.props.logoText}
              </Avatar>
            }
            action={
              <IconButton onClick={this.handleClickMoreVert}>
                <MoreVertIcon />
              </IconButton>
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
          {/* <CardContent>
            <Typography component="p">
              {this.props.footerText}
            </Typography>
          </CardContent> */}
        </Fragment>
        {/* <CardActions style={styles.actions} disableActionSpacing>
          <IconButton aria-label="Add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="Share">
            <ShareIcon />
          </IconButton>
        </CardActions> */}
      </Card>
      </div>
    );
  }
}


export default RecommendationListCardPy;
