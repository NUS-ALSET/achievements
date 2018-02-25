import { APP_SETTING } from "../achievementsApp/config";
import { DrawerMenuItems } from "./AppDrawerElements";

import { compose } from "redux";

import ChevronLeftIcon from "material-ui-icons/ChevronLeft";
import Drawer from "material-ui/Drawer";
import Hidden from "material-ui/Hidden";

import IconButton from "material-ui/IconButton";
import PropTypes from "prop-types";

import React from "react";

import withStyles from "material-ui/styles/withStyles";

const styles = theme => ({
  paper: {
    width: APP_SETTING.drawerWidth,
    backgroundColor: theme.palette.background.paper
  },
  anchor: {
    color: theme.palette.text.secondary
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  }
});

class AppDrawer extends React.PureComponent {
  render() {
    const {
      classes,
      className,
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
        {DrawerMenuItems(onRequestClose, userId)}
      </div>
    );

    return (
      <div className={className}>
        <Hidden implementation="css" lgUp>
          <Drawer
            ModalProps={{
              keepMounted: true
            }}
            classes={{
              paper: classes.paper
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
              paper: classes.paper
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
  userId: PropTypes.string,
  mobileDrawerOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
};

export default compose(withStyles(styles))(AppDrawer);
