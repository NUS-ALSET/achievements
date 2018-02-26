import { APP_SETTING } from "../../achievementsApp/config";
import { AppBarMenuItemsExport } from "../../components/AppDrawerElements";
import { Home } from "../../components/Home";
import { Route, HashRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import { loginMenuClose, loginMenuOpen, mainDrawerToggle } from "./actions";
import { signInRequest, signOutRequest } from "../Root/actions";
import Account from "../../containers/Account/Account";
import AppBar from "material-ui/AppBar";

import AppDrawer from "../../components/AppDrawer";

import Assignments from "../Assignments/Assignments";
import Button from "material-ui/Button";
import Courses from "../Courses/Courses";

import Hidden from "material-ui/Hidden";
import IconButton from "material-ui/IconButton";

import Menu from "material-ui/Menu";
import MenuIcon from "material-ui-icons/Menu";

import MoreVertIcon from "material-ui-icons/MoreVert";
import Paths from "../Paths/Paths";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import withStyles from "material-ui/styles/withStyles";
import Cohorts from "../Cohorts/Cohorts";
import Cohort from "../Cohort/Cohort";

const styles = theme => ({
  "@global": {
    html: {
      height: "100%",
      background: theme.palette.background.default,
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      boxSizing: "border-box"
    },
    "*, *:before, *:after": {
      boxSizing: "inherit"
    },
    body: {
      height: "100%",
      margin: 0
    },
    "div[id=root]": {
      height: "100%"
    }
  },
  root: {
    display: "flex",
    alignItems: "stretch",
    width: "100%"
  },
  appBarTitle: {
    flex: 1
  },
  appFrame: {
    position: "relative",
    display: "flex",
    width: "100%"
  },
  appBar: {
    [theme.breakpoints.up("lg")]: {
      width: "calc(100% - " + APP_SETTING.drawerWidth + "px)"
    }
  },
  drawer: {
    [theme.breakpoints.up("lg")]: {
      width: APP_SETTING.drawerWidth
    }
  },
  content: {
    width: "100%",
    padding: theme.spacing.unit,
    height: "calc(100% - 56px)",
    marginTop: 56,
    [theme.breakpoints.up("lg")]: {
      width: "calc(100% - " + APP_SETTING.drawerWidth + "px)"
    },
    [theme.breakpoints.up("sm")]: {
      height: "calc(100% - 64px)",
      marginTop: 64,

      // eslint-disable-next-line no-magic-numbers
      padding: theme.spacing.unit * 3
    }
  }
});

class AppFrame extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    anchorElId: PropTypes.any,
    mainDrawerOpen: PropTypes.bool,
    userName: PropTypes.string,
    userId: PropTypes.string
  };

  handleDrawerClose = () => {
    this.props.dispatch(mainDrawerToggle(false));
  };

  handleDrawerToggle = () => {
    this.props.dispatch(mainDrawerToggle());
  };

  handleMenuOpen = event => {
    this.props.dispatch(loginMenuOpen(event.currentTarget.id));
  };

  handleMenuClose = () => {
    this.props.dispatch(loginMenuClose());
  };

  handleLogin = () => {
    this.props.dispatch(signInRequest());
  };

  handleLogout = () => {
    this.props.dispatch(signOutRequest());
  };

  render() {
    const { classes, userId } = this.props;

    return (
      <Router>
        <div className={classes.root}>
          <div className={classes.appFrame}>
            <AppBar className={classes.appBar} onClose={this.handleDrawerClose}>
              <Toolbar>
                <Hidden implementation="css" lgUp>
                  <IconButton
                    aria-label="Open Drawer"
                    color="inherit"
                    onClick={this.handleDrawerToggle}
                  >
                    <MenuIcon />
                  </IconButton>
                </Hidden>
                <Typography
                  className={classes.appBarTitle}
                  color="inherit"
                  noWrap
                  variant="title"
                >
                  Achievements
                </Typography>

                {this.props.userName ? (
                  <Fragment>
                    <IconButton
                      aria-haspopup="true"
                      aria-label="More"
                      aria-owns="Open right Menu"
                      className={classes.menuButtonRight}
                      color="inherit"
                      id="loginMenuButton"
                      onClick={this.handleMenuOpen}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={
                        (this.props.anchorElId &&
                          document.getElementById(this.props.anchorElId)) ||
                        document.body
                      }
                      id="menuRight"
                      onClose={this.handleMenuClose}
                      open={!!this.props.anchorElId}
                    >
                      <AppBarMenuItemsExport
                        isAuth={this.props.userId}
                        login={this.handleLogin}
                        logout={this.handleLogout}
                        onClick={this.handleMenuClose}
                      />
                    </Menu>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Button color="inherit" onClick={this.handleLogin}>
                      Login
                    </Button>
                  </Fragment>
                )}
              </Toolbar>
            </AppBar>
            <AppDrawer
              className={classes.drawer}
              mobileDrawerOpen={this.props.mainDrawerOpen}
              onRequestClose={this.handleDrawerClose}
              userId={userId}
            />
            <main className={classes.content}>
              <Route component={Home} exact path="(/|/home)" />
              <Route component={Courses} exact path="/courses" />
              <Route component={Assignments} exact path="/courses/:courseId" />
              <Route component={Paths} exact path="/paths" />
              <Route component={Cohorts} exact path="/cohorts" />
              <Route component={Cohort} exact path={"/cohorts/:cohortId"} />
              <Route
                exact
                path="/(account|profile)/:accountId"
                render={() => <Account userName={this.props.userName} />}
              />
            </main>
          </div>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  anchorElId: state.appFrame.dropdownAnchorElId,
  mainDrawerOpen: state.appFrame.mainDrawerOpen,
  userName: state.firebase.auth.displayName,
  userId: state.firebase.auth.uid
});
export default withStyles(styles)(connect(mapStateToProps)(AppFrame));
