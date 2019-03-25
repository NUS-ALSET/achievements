import * as React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import withStyles from "@material-ui/core/styles/withStyles";

import { sagaInjector } from "../../services/saga";
import { sagas } from "./sagas";
import TasksTable from "../../components/tables/TasksTable";
import Breadcrumbs from "../../components/Breadcrumbs";
import { tasksOpen, tasksAddTaskDialogShow, tasksDialogHide } from "./actions";

const styles = () => ({
  linkButton: {
    textDecoration: "none"
  }
});

class Tasks extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.shape({
      linkButton: PropTypes.string
    }),
    tasks: PropTypes.any,
    tasksOpen: PropTypes.func
  };
  state = {};

  componentDidMount() {
    this.props.tasksOpen();
  }

  render() {
    const { classes, tasks } = this.props;

    return (
      <React.Fragment>
        <Breadcrumbs paths={[{ label: "Tasks" }]} />
        <Toolbar>
          <Link to="/tasks/new">
            <Button
              className={classes.linkButton}
              color="primary"
              onClick={tasksAddTaskDialogShow}
              variant="contained"
            >
              Add
            </Button>
          </Link>
        </Toolbar>
        <TasksTable
          onDeleteClick={() => ({})}
          onEditClick={() => {}}
          tasks={tasks}
        />
      </React.Fragment>
    );
  }
}

sagaInjector.inject(sagas);

export default compose(
  connect(
    state => ({
      tasks: state.tasks.tasks
    }),
    {
      tasksOpen,
      tasksAddTaskDialogShow,
      tasksDialogHide
    }
  ),
  withStyles(styles)
)(Tasks);
