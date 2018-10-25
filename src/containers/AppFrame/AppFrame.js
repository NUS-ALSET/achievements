import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";

import { loginMenuClose, loginMenuOpen, mainDrawerToggle } from "./actions";
import { signInRequest, signOutRequest } from "../Root/actions";

import { APP_SETTING } from "../../achievementsApp/config";

// for Drawer and AppBar
import AppBarMenuItems from "../../components/AppBarMenuItems";
import AppDrawer from "../../components/AppDrawer";

// for Routes
// import Home from "../Home/AltHome";
// TODO: both account/ and profile/ point to this Account component
// need to figure out why need both?
import Account from "../../containers/Account/Account";
import Cohorts from "../Cohorts/Cohorts";
import Cohort from "../Cohort/Cohort";
import Admin from "../Admin/Admin";
import Activity from "../Activity/Activity";
import Assignments from "../Assignments/Assignments";
import Courses from "../Courses/Courses";
import Path from "../Path/Path";
import Paths from "../Paths/Paths";
import Contribute from "../Contribute/Contribute";
import AllDestinations from "../Destinations/AllDestionations";
import MyDestinations from "../Destinations/MyDestinations";
import ViewDestination from "../Destinations/ViewDestination";
// HomeV2 to test the kyGUI for Home Recommendation
import HomeV2 from "../HomeV2/HomeV2";
import HomeV3 from "../HomeV3/HomeV3";

// from Material-UI
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
// MenuIcon is the Hamburger Icon to toggle Drawer
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

/* this AppFrame is the main framework of our UI,
 * it describes the responsive drawer with an appbar
 * Routes are passed as props to be rendered within this component*/

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
      // up.lg = large or more, 1280px or larger
      width: `calc(100% - ${APP_SETTING.drawerWidth}px)`
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
      width: `calc(100% - ${APP_SETTING.drawerWidth}px)`
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
    anchorElId: PropTypes.any,
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    history: PropTypes.any,
    mainDrawerOpen: PropTypes.bool,
    isAdmin: PropTypes.bool,
    userName: PropTypes.string,
    userId: PropTypes.string
  };

  shouldComponentUpdate(newProps) {
    const fields = [
      "anchorElId",
      "mainDrawerOpen",
      "isAdmin",
      "userName",
      "userId"
    ];

    for (const field of fields) {
      if (this.props[field] !== newProps[field]) {
        console.error("AppFrame RERENDERED");
        return true;
      }
    }
    return false;
  }

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
    const {
      anchorElId,
      classes,
      history,
      isAdmin,
      userId,
      userName
    } = this.props;

    return (
      <Router history={history}>
        <div className={classes.root}>
          <div className={classes.appFrame}>
            <AppBar
              className={classes.appBar}
              color={APP_SETTING.isSuggesting ? "inherit" : "primary"}
              onClose={this.handleDrawerClose}
            >
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

                {userId ? (
                  <Fragment>
                    <IconButton
                      aria-haspopup="true"
                      aria-label="More"
                      aria-owns="Open right Menu"
                      color="inherit"
                      id="loginMenuButton"
                      onClick={this.handleMenuOpen}
                    >
                      <AccountCircle />
                    </IconButton>
                    <Menu
                      anchorEl={
                        (anchorElId && document.getElementById(anchorElId)) ||
                        document.body
                      }
                      id="menuRight"
                      onClose={this.handleMenuClose}
                      open={!!anchorElId}
                    >
                      <AppBarMenuItems
                        isAuth={userId}
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
              isAdmin={isAdmin}
              mobileDrawerOpen={this.props.mainDrawerOpen}
              onRequestClose={this.handleDrawerClose}
              userId={userId}
            />
            <main className={classes.content}>
              <Route component={HomeV2} exact path="(/|/home)" />
              <Route component={HomeV3} exact path="/homev3" />
              <Route component={Admin} exact path="/admin" />
              <Route component={Courses} exact path="/courses" />
              <Route component={Assignments} exact path="/courses/:courseId" />
              <Route component={Cohorts} exact path="/cohorts" />
              <Route component={Cohort} exact path="/cohorts/:cohortId" />
              <Route component={Paths} exact path="/paths" />
              <Route component={Path} exact path="/paths/:pathId" />
              <Route component={AllDestinations} exact path="/destinations" />
              <Route component={MyDestinations} exact path="/my-destinations" />
              <Route
                component={ViewDestination}
                exact
                path="/destinations/:destinationId"
              />
              <Route
                component={Activity}
                exact
                path="/paths/:pathId/activities/:problemId"
              />
              <Route
                exact
                path="/(account|profile)/:accountId"
                render={() => <Account userName={userName} />}
              />
              <Route component={Contribute} exact path="/contribute" />
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
  userId: state.firebase.auth.uid,
  isAdmin: state.account.isAdmin
});
export default withStyles(styles)(connect(mapStateToProps)(AppFrame));
