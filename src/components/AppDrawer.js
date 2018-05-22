import { APP_SETTING } from "../achievementsApp/config";
import { DrawerMenuItems } from "./AppDrawerElements";

import { compose } from "redux";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";

import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";

import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  someClass: {
    width: APP_SETTING.drawerWidth,
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
    ...theme.mixins.toolbar
  }
});

class AppDrawer extends React.PureComponent {
  render() {
    const {
      classes,
      className,
      isAdmin,
      userId,
      mobileDrawerOpen,
      onRequestClose
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
        {DrawerMenuItems(onRequestClose, userId, isAdmin)}
      </div>
    );

    return (
      <div className={className}>
        <Hidden lgUp>
          <Drawer
            ModalProps={{
              keepMounted: true
            }}
            anchor="left"
            classes={{
              paper: classes.someClass
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

AppDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  isAdmin: PropTypes.bool,
  userId: PropTypes.string,
  mobileDrawerOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
};

export default compose(withStyles(styles))(AppDrawer);
