/**
 * @created 02.08.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { AccountService } from "../../services/account";


const externalProfile={
  url: "https://codecombat.com",
  id: "CodeCombat",
};

class ProfileActivity extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    problem: PropTypes.object,
    solution: PropTypes.object,
    userAchievements: PropTypes.object
  };
  state = {
    login: ""
  };
  onProfileChange = e => {
    const login =  AccountService.processProfile(externalProfile.id, e.target.value)
    this.setState({ login });
    this.props.onChange({value : login});
  };

  render() {
    const { problem, solution, userAchievements} = this.props;
    const userName = userAchievements && userAchievements.CodeCombat && userAchievements.CodeCombat.id  ? userAchievements.CodeCombat.id : solution.value;
    const url = `${externalProfile.url}/user/${this.state.login || solution.value}`;
    return (
      <Fragment>
        <Typography align="left" gutterBottom variant="headline">
          {problem.question}
        </Typography>
        <div>
            <a href={url}>{url}</a>
        </div>
          <TextField
            autoFocus
            value={this.state.login || (userName)}
            fullWidth
            label="Profile"
            onChange={this.onProfileChange}
            onKeyPress={this.catchReturn}
            style={{
              marginBottom: 4
            }}
          />
      </Fragment>
    );
  }
}

export default ProfileActivity;
