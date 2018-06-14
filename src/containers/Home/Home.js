/**
 * @file Home container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 12.06.18
 */
/* eslint-disable no-magic-numbers */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import LaunchIcon from "@material-ui/icons/KeyboardArrowRight";

import loremIpsum from "lorem-ipsum";

const recsMock = {
  paths: [
    "If-then II",
    "If-then III",
    "If-then-else",
    "If-then-with unicorns",
    "If-then Gem Hunter I",
    "If-then Greenthumb",
    "if (not)-then",
    "if-then-elif",
    "If-then Code Combat I"
  ],
  python: [
    "While I",
    "For loops I",
    "Strings I",
    "isInstance I",
    "Lists I",
    "Or I",
    "Not I",
    "And I"
  ],
  youtube: ["ORthzIOEf30", "NOAgplgTxfc", "NNnIGh9g6fA", "ISVaoLlW104"]
};

class Home extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func
  };

  render() {
    return (
      <Fragment>
        <Typography style={{ marginBottom: 4 }} variant="title">
          Next steps on your current path
        </Typography>
        <Paper style={{ padding: 4 }}>
          <GridList cellHeight={200} cols={5} spacing={4}>
            {recsMock.paths.map((data, index) => (
              <GridListTile cols={index ? 1 : 2} key={index}>
                <Typography align="center" variant="headline">
                  {data}
                </Typography>
                <GridListTileBar
                  actionIcon={
                    <IconButton>
                      <LaunchIcon />
                    </IconButton>
                  }
                  subtitle={loremIpsum()}
                />
              </GridListTile>
            ))}
          </GridList>
        </Paper>
        <Typography style={{ margin: "40px 0 4px 0" }} variant="title">
          Your next python skills
        </Typography>
        <Paper style={{ padding: 4 }}>
          <GridList cellHeight={200} cols={5} padding={20} spacing={1}>
            {recsMock.python.map((data, index) => (
              <GridListTile cols={index ? 1 : 2} key={index}>
                <Typography variant="headline">{data}</Typography>
                <GridListTileBar
                  actionIcon={
                    <IconButton>
                      <LaunchIcon />
                    </IconButton>
                  }
                  subtitle={loremIpsum()}
                />
              </GridListTile>
            ))}
          </GridList>
        </Paper>
        <Typography style={{ margin: "40px 0 4px 0" }} variant="title">
          Your next YouTube videos
        </Typography>
        <Paper style={{ padding: 4 }}>
          <GridList cellHeight={200} cols={5} padding={20} spacing={1}>
            {recsMock.youtube.map((data, index) => (
              <GridListTile cols={index ? 1 : 2} key={index}>
                <img alt="" src={`https://img.youtube.com/vi/${data}/0.jpg`} />
                <GridListTileBar
                  actionIcon={
                    <IconButton
                      style={{
                        color: "rgba(255,255,255, 0.54)"
                      }}
                    >
                      <LaunchIcon />
                    </IconButton>
                  }
                  subtitle={loremIpsum()}
                />
              </GridListTile>
            ))}
          </GridList>
        </Paper>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({});

export default compose(connect(mapStateToProps))(Home);
