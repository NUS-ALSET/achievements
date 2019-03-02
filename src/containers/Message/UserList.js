import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: "inline"
  }
});

const UsersList = (props) => {
  const { classes } = props;
  return (
    <React.Fragment>
        <h4>Students</h4>
        <List className={classes.root}>
        {(props.members || []).map(el => (
            <ListItem alignItems="flex-start" key={el.displayName+""+el.email}>
                <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNdWGsNODpjNZ2SDeTj5uPjSadiNHp7FD179MaOQJesDOZtttjdg" />
                </ListItemAvatar>
                <ListItemText
                    primary={el.displayName || "Not Provided!"}
                />
                </ListItem>
        ))}

        </List>
    </React.Fragment>
  );
}

UsersList.propTypes = {
  classes: PropTypes.object.isRequired,
  members: PropTypes.array
};

export default withStyles(styles)(UsersList);