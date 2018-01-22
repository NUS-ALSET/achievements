import React from "react";
import PropTypes from "prop-types";

import { compose } from "redux";

import withStyles from "material-ui/styles/withStyles";
import Drawer from "material-ui/Drawer";
import Hidden from "material-ui/Hidden";

import IconButton from "material-ui/IconButton";
import ChevronLeftIcon from "material-ui-icons/ChevronLeft";

import { DrawerMenuItems } from "./AppDrawerElements";

import { APP_SETTING } from "../achievementsApp/config";

const styles = theme => ({
  paper: {
    width: APP_SETTING.DrawerWidth,
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
    const { classes, className, mobileDrawerOpen, onRequestClose } = this.props;

    const drawer = (
      <div>
        <div className={classes.drawerHeader}>
          <Hidden lgUp implementation="css">
            <IconButton onClick={onRequestClose}>
              <ChevronLeftIcon />
            </IconButton>
          </Hidden>
        </div>
        {DrawerMenuItems(onRequestClose)}
      </div>
    );

    return (
      <div className={className}>
        <Hidden lgUp>
          <Drawer
            classes={{
              paper: classes.paper
            }}
            type="temporary"
            open={mobileDrawerOpen}
            onClose={onRequestClose}
            ModalProps={{
              keepMounted: true
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>

        <Hidden mdDown implementation="css">
          <Drawer
            classes={{
              paper: classes.paper
            }}
            type="permanent"
            open
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
  mobileDrawerOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
};

export default compose(withStyles(styles))(AppDrawer);
