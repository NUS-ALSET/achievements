import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import withStyles from "material-ui/styles/withStyles";
import Typography from "material-ui/Typography";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Hidden from "material-ui/Hidden";
import Menu from "material-ui/Menu";
import Button from "material-ui/Button";

import { Router, Route } from "react-router-dom";

import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui-icons/Menu";
import MoreVertIcon from "material-ui-icons/MoreVert";

import AppDrawer from "../../components/AppDrawer";
import { AppBarMenuItemsExport } from "../../components/AppDrawerElements";

import { APP_SETTING } from "../../achievementsApp/config";
import { loginMenuClose, loginMenuOpen, mainDrawerToggle } from "./actions";

import Account from "../../containers/Account/Account";
import Assignments from "../Assignments/Assignments";
import Courses from "../Courses/Courses";
import { Home } from "../../components/Home";
import { signInRequest, signOutRequest } from "../Root/actions";
import { history } from "../../services/history";

const styles = theme => ({
  "@global": {
    html: {
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
    minHeight: "100%",
    width: "100%"
  },
  appBarTitle: {
    flex: 1
  },
  appFrame: {
    position: "relative",
    display: "flex",
    width: "100%",
    height: "100%"
  },
  appBar: {
    [theme.breakpoints.up("lg")]: {
      width: "calc(100% - " + APP_SETTING.DrawerWidth + "px)"
    }
  },
  drawer: {
    [theme.breakpoints.up("lg")]: {
      width: APP_SETTING.DrawerWidth
    }
  },
  content: {
    width: "100%",
    padding: theme.spacing.unit,
    height: "calc(100% - 56px)",
    marginTop: 56,
    [theme.breakpoints.up("lg")]: {
      width: "calc(100% - " + APP_SETTING.DrawerWidth + "px)"
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
    userName: PropTypes.string
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
    const { classes } = this.props;

    return (
      <Router history={history}>
        <div className={classes.root}>
          <div className={classes.appFrame}>
            <AppBar className={classes.appBar} onClose={this.handleDrawerClose}>
              <Toolbar>
                <Hidden lgUp implementation="css">
                  <IconButton
                    color="inherit"
                    aria-label="Open Drawer"
                    onClick={this.handleDrawerToggle}
                  >
                    <MenuIcon />
                  </IconButton>
                </Hidden>
                <Typography
                  className={classes.appBarTitle}
                  type="title"
                  color="inherit"
                  noWrap
                >
                  Achievements
                </Typography>

                {this.props.userName ? (
                  <Fragment>
                    <IconButton
                      id="loginMenuButton"
                      aria-label="More"
                      aria-owns="Open right Menu"
                      aria-haspopup="true"
                      onClick={this.handleMenuOpen}
                      color="inherit"
                      className={classes.menuButtonRight}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="menuRight"
                      anchorEl={
                        (this.props.anchorElId &&
                          document.getElementById(this.props.anchorElId)) ||
                        document.body
                      }
                      open={!!this.props.anchorElId}
                      onClose={this.handleMenuClose}
                    >
                      <AppBarMenuItemsExport
                        isAuth={!!this.props.userName}
                        onClick={this.handleMenuClose}
                        login={this.handleLogin}
                        logout={this.handleLogout}
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
              onRequestClose={this.handleDrawerClose}
              mobileDrawerOpen={this.props.mainDrawerOpen}
            />
            <main className={classes.content}>
              <Route exact path="(/|/home)" component={Home} />
              <Route exact path="/courses" component={Courses} />
              <Route exact path="/courses/:courseId" component={Assignments} />
              <Route
                exact
                path="/(account|profile)"
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
  userName: state.firebase.auth.displayName
});
export default withStyles(styles)(connect(mapStateToProps)(AppFrame));
