/**
 * @created 02.08.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { AccountService } from "../../services/account";

const externalProfile = {
  url: "https://codecombat.com",
  id: "CodeCombat"
};

class ProfileActivity extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    problem: PropTypes.object,
    solution: PropTypes.object,
    userAchievements: PropTypes.object,
    readOnly: PropTypes.bool
  };
  state = {
    login: ""
  };
  componentDidMount(){
    this.props.setProblemOpenTime && this.props.setProblemOpenTime(this.props.problem.problemId, (new Date()).getTime());
  }
  onProfileChange = e => {
    const login = AccountService.processProfile(
      externalProfile.id,
      e.target.value
    );
    this.setState({ login });
    this.props.onChange({ value: login });
  };

  render() {
    const { problem, solution, userAchievements, readOnly } = this.props;
    const service = problem.service || "CodeCombat";
    const userName =
      userAchievements &&
      userAchievements[service] &&
      userAchievements[service].id
        ? userAchievements[service].id
        : solution.value;
    const url = `${externalProfile.url}/user/${this.state.login ||
      solution.value}`;
    return (
      <Fragment>
        <Typography align="left" gutterBottom variant="h5">
          {problem.question}
        </Typography>
        <div>
          <a href={url}>{url}</a>
        </div>
        <TextField
          autoFocus
          disabled={readOnly}
          fullWidth
          label="Profile"
          onChange={this.onProfileChange}
          onKeyPress={this.catchReturn}
          style={{
            marginBottom: 4
          }}
          value={this.state.login || userName}
        />
      </Fragment>
    );
  }
}

export default ProfileActivity;
