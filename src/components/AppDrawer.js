import React from "react";
import PropTypes from "prop-types";
// since AppDrawer and AppBar is outside the Routes in AppFrame
// need a withRouter to pass location.pathname to detect URL
import { withRouter } from "react-router-dom";
import { compose } from "redux";

import AppDrawerElements from "./AppDrawerElements";
// import the NUS ALSET Achievements Logo background image
import AppLogo from "../assets/NUS_ALSET_Achievements_Logo.png";

// from material-ui
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  someClass: {
    width: theme.drawerWidth,
    backgroundColor: theme.palette.background.paper
  },
  anchor: {
    color: theme.palette.text.primary
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    backgroundColor: theme.palette.background.paper,
    backgroundImage: `url(${AppLogo})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "50% 50%",
    ...theme.mixins.toolbar
  }
});

class AppDrawer extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    isAdmin: PropTypes.bool,
    userId: PropTypes.string,
    mobileDrawerOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    location: PropTypes.object,
    onRouteChange: PropTypes.func,
    history: PropTypes.object
  }
  constructor(props){
    super(props);
    // listen route change
     props.history.listen((location) => {
      props.onRouteChange(location.pathname);
    });
  }
  
  render() {
    const {
      classes,
      className,
      isAdmin,
      userId,
      mobileDrawerOpen,
      onRequestClose,
      location
    } = this.props;

    const drawer = (
      <div>
        <div className={classes.drawerHeader}>
          <Hidden implementation="css" lgUp>
            <IconButton onClick={onRequestClose}>
              <ChevronLeftIcon />
            </IconButton>
          </Hidden>
        </div>
        {AppDrawerElements(onRequestClose, userId, isAdmin, location)}
      </div>
    );

    return (
      <div className={className}>
        <Hidden lgUp>
          <Drawer
            anchor="left"
            classes={{
              paper: classes.someClass
            }}
            ModalProps={{
              keepMounted: true
            }}
            onClose={onRequestClose}
            open={mobileDrawerOpen}
            variant="temporary"
          >
            {drawer}
          </Drawer>
        </Hidden>

        <Hidden implementation="css" mdDown>
          <Drawer
            classes={{
              paper: classes.someClass
            }}
            open
            variant="permanent"
          >
            {drawer}
          </Drawer>
        </Hidden>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles)
)(AppDrawer);
