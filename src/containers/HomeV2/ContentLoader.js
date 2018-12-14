import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import ReactContentLoader from "react-content-loader";

const Header = () => (
  <ReactContentLoader
    height={50}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    speed={2}
    width={226}
  >
    <circle cx="33.3" cy="31.3" r="18" />
    <rect height="12" rx="2" ry="2" width="100" x="60" y="13" />
    <rect height="11" rx="2" ry="2" width="150" x="60" y="37" />
  </ReactContentLoader>
);

const Card = () => (
  <ReactContentLoader
    height={60}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    speed={2}
    width={100}
  >
    <rect height="175" rx="1" ry="1" width="272" x="0" y="0" />
  </ReactContentLoader>
);

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    height: 318,
    width: "90%",
    marginBottom: 20
  },
  container: {
    width: "calc(100% - 10px)",
    overflow: "hidden",
    whiteSpace: "nowrap",
    marginTop: "50px"
  },
  header: {
    height: "50px",
    width: "276px"
  },
  card: {
    height: "150px",
    width: "272px",
    marginLeft: "9px",
    display: "inline-block"
  }
});

function ContentLoader(props) {
  const { classes } = props;
  const cardsInCarousel = [3, 5, 4];
  return (
    <div>
      {Array(3)
        .fill(0)
        .map((s, index) => (
          <Paper className={classes.root} elevation={1} key={index}>
            <div className={classes.header}>
              <Header />
            </div>
            <div className={classes.container}>
              {Array(cardsInCarousel[index])
                .fill(0)
                .map((c, index) => (
                  <div className={classes.card} key={index}>
                    <Card />
                  </div>
                ))}
            </div>
          </Paper>
        ))}
    </div>
  );
}

ContentLoader.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ContentLoader);
