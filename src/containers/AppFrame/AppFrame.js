import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";

import {
  loginMenuClose,
  loginMenuOpen,
  mainDrawerToggle,
  getDynamicPathtitle,
  savePromoCode,
  routeChanged
} from "./actions";
import { signInRequest, signOutRequest } from "../Root/actions";

// for Drawer and AppBar
import AppBarMenuItems from "../../components/AppBarMenuItems";
import AppDrawer from "../../components/AppDrawer";

// for Routes
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

import MyLearning from "../MyLearning/MyLearning";
// HomeV2 to test the kyGUI for Home Recommendation
import HomeV2 from "../HomeV2/HomeV2";
// HomeV3 is a prototype for homepage
import HomeV3 from "../HomeV3/HomeV3";
// HomeV4 is a prototype for homepage
import HomePage from "../HomeV4/HomeV4";
import Task from "../Task/Task";
import Tasks from "../Tasks/Tasks";
import CustomActivity from "../CustomActivity/CustomActivity";
import Journeys from "../Journeys/Journeys";
import CustomAnalysis from "../CustomAnalysis/CustomAnalysis";
import AdminCustomAnalysis from "../AdminCustomAnalysis/AdminCustomAnalysis";

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
/* import AllDestinations from "../Destinations/AllDestinations";
import MyDestinations from "../Destinations/MyDestinations";
import ViewDestination from "../Destinations/ViewDestination";
// Idea lab for trial
import CRUDdemo from "../IdeaLab/CRUDdemo";
import AdditionalContentRequest from "../IdeaLab/AdditionalContentRequest";
import CohortAnalytics from "../IdeaLab/CohortAnalytics";
import Brenda from "../IdeaLab/Brenda/PathDashboard";
import pathAnalyticsDemo from "../IdeaLab/Ben/pathAnalyticsDemo";
import PathAnalytics from "../IdeaLab/pathAnalytics";
import ZiYun from "../IdeaLab/ZiYun/ZiYun";
import userDemonstratedPythonSkills from "../IdeaLab/userDemonstratedPythonSkills/userDemonstratedPythonSkills";
import pythonSkillsUsedToCompleteActivity from "../IdeaLab/pythonSkillsUsedToCompleteActivity/pythonSkillsUsedToCompleteActivity";
import ActivitiesAnalytics from "../IdeaLab/ActivitiesAnalytics";*/
import ActivitySolutions from "../ActivitySolutions/ActivitySolutions";
import MockJourneys from "../Journeys/MockJourneys";

/* this AppFrame is the main framework of our UI,
 * it describes the responsive drawer with an appbar
 * Routes are passed as props to be rendered within this component*/

const NoMatch = ({ location }) => (
  <h3>
    No page found for <code>{location.pathname}</code>
  </h3>
);

NoMatch.propTypes = {
  location: PropTypes.shape({
    pathName: PropTypes.string
  })
};

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
      width: `calc(100% - ${theme.drawerWidth}px)`
    }
  },
  drawer: {
    [theme.breakpoints.up("lg")]: {
      width: theme.drawerWidth
    }
  },
  content: {
    width: "100%",
    padding: theme.spacing.unit,
    height: "calc(100% - 56px)",
    marginTop: 56,
    [theme.breakpoints.up("lg")]: {
      width: `calc(100% - ${theme.drawerWidth}px)`
    },
    [theme.breakpoints.up("sm")]: {
      height: "calc(100% - 64px)",
      marginTop: 64,

      // eslint-disable-next-line no-magic-numbers
      padding: theme.spacing.unit * 3
    }
  }
});

export class AppFrame extends React.Component {
  static propTypes = {
    anchorElId: PropTypes.any,
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    history: PropTypes.any,
    mainDrawerOpen: PropTypes.bool,
    isAdmin: PropTypes.bool,
    userId: PropTypes.string,
    routerPathname: PropTypes.string,
    dynamicPathTitle: PropTypes.string
  };

  getPromoCode() {
    const url = window.location.href;
    const firstEl = url.split("/#/")[0];
    if (firstEl.includes("?")) {
      const sub = firstEl.substring(firstEl.indexOf("?"));
      return sub.substring(sub.indexOf("?") + 1);
    }
    return null;
  }

  saveRoutesChange = pathName => {
    this.props.dispatch(routeChanged(pathName));
  };

  componentDidMount() {
    this.props.dispatch(
      getDynamicPathtitle(this.props.history.location.pathname)
    );
    const promoCode = this.getPromoCode();
    if (promoCode) {
      this.props.dispatch(savePromoCode(promoCode));
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.routerPathname !== this.props.routerPathname) {
      this.props.dispatch(
        getDynamicPathtitle(this.props.history.location.pathname)
      );
    }
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
    const { anchorElId, classes, history, isAdmin, userId } = this.props;

    return (
      <Router history={history}>
        <div className={classes.root}>
          <div className={classes.appFrame}>
            <AppBar
              className={classes.appBar}
              color="primary"
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
                  variant="h6"
                >
                  {this.props.dynamicPathTitle}
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
              onRouteChange={this.saveRoutesChange}
              userId={userId}
            />
            <main className={classes.content}>
              <Switch>
                {!userId && (
                  <Route
                    exact
                    path="(/|/home)"
                    render={props => (
                      <HomePage {...props} loginHandler={this.handleLogin} />
                    )}
                  />
                )}
                {userId && <Route component={HomeV2} exact path="(/|/home)" />}
                <Route component={HomeV3} exact path="(/|/homev3)" />
                <Route component={Admin} exact path="/admin" />
                <Route component={Courses} exact path="/courses" />
                <Route
                  component={Assignments}
                  exact
                  path="/courses/:courseId"
                />
                <Route component={Cohorts} exact path="/cohorts" />
                <Route component={Cohort} exact path="/cohorts/:cohortId" />
                <Route component={Paths} exact path="/paths" />
                <Route component={Path} exact path="/paths/:pathId" />

                {/*
                <Route component={AllDestinations} exact path="/destinations" />
                <Route component={MyDestinations} exact path="/my-destinations" />
                <Route component={Brenda} exact path="/brenda" />
                <Route component={ZiYun} exact path="/ziyun" />
                <Route component={CRUDdemo} exact path="/CRUDdemo" />
                <Route component={AdditionalContentRequest} exact path="/AdditionalContentRequest" />
                <Route component={ActivitiesAnalytics} exact path="/ActivitiesAnalytics" />
                <Route component={PathAnalytics} exact path="/path-analytics" />
                <Route component={CohortAnalytics} exact path="/CohortAnalytics" />

                <Route component={userDemonstratedPythonSkills} exact path="/userDemonstratedPythonSkills/:accountId" />
                <Route
                  component={pythonSkillsUsedToCompleteActivity}
                  exact
                  path="/pythonSkillsUsedToCompleteActivity/:problemId"
                />
                <Route component={pathAnalyticsDemo} exact path="/pathAnalyticsDemo" />
                <Route component={ViewDestination} exact path="/destinations/:destinationId" />*/}

                <Route
                  component={Activity}
                  exact
                  path="/paths/:pathId/activities/:problemId"
                />
                <Route
                  component={ActivitySolutions}
                  exact
                  path="/activitySolutions/:problemId"
                />
                <Route
                  component={Account}
                  exact
                  path="/(account|profile)/:accountId"
                />
                <Route component={Contribute} exact path="/contribute" />
                <Route component={Tasks} exact path="/advanced" />
                <Route component={Task} exact path="/advanced/:taskId" />
                <Route
                  component={CustomActivity}
                  exact
                  path="/customactivity"
                />
                <Route component={Journeys} exact path="/journeys" />
                <Route
                  component={CustomAnalysis}
                  exact
                  path="/customAnalysis"
                />
                <Route
                  component={AdminCustomAnalysis}
                  exact
                  path="/adminCustomAnalysis"
                />
                <Route component={MockJourneys} exact path="/mock-journeys" />
                <Route
                  render={routeProps => (
                    <MyLearning {...routeProps} {...userId} />
                  )}
                />
                <Route component={NoMatch} />
              </Switch>
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
  userId: state.firebase.auth.uid,
  isAdmin: state.account.isAdmin,
  dynamicPathTitle: state.appFrame.dynamicPathTitle,
  routerPathname: state.router.location.pathname
});
export default withStyles(styles)(connect(mapStateToProps)(AppFrame));
