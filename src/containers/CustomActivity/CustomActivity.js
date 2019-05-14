/* eslint-disable react/display-name */

import React from "react";
import Loadable from "react-loadable";

import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import HelpIcon from "@material-ui/icons/HelpOutline";

// Development notes
// This is just a prototype - the logic - eg. setState can be totally replaced
// To be implemented --> Redux / firebase operations to retrieve previously saved custom activity
// To be implemented --> Redux / firebase operations to create new custom activity
// To be implemented --> Creator can view / create their Custom Activities in
// http://localhost:3000/#/tasks alongside tasks
// To be implemented --> Add custom activity dialog when creator wants to add
// custom activity to a path - similar to dialog to add Jupyter Local activity
// To be implemented --> NEW blocks - allow creator to change title of new Blocks
// added under Shown Code/Text section - only for new blocks - creators cannot change title of shown code/hidden/editable code
// To be implemented --> NEW blocks - allow creator to add new blocks in between
// 2 blocks of Shown Code/Text section - eg BLOCK 1 (creator press add new block here)
// BLOCK 2 - allow new block to be inserted in between block 1 and block 2
// To be implemented --> NEW blocks - In the preview, render Shown Code/Text blocks
// in sequence - currently, let say user added a new block, filled it up then go back to fill up the block under Shown Code/Text, the "new block" content will show above the content of block directly beneath Shown Code/Text
// To be implemented --> NEW blocks - add a delete icon and delete functionality for new added blocks
// To be implemented --> NEW blocks - add an up/down icon and toggle functionality for
//  added blocks to change position up or down against other added blocks
// To be implemented --> validation of activity url entered
// To be implemented --> When creator has made changes but navigates from page without
//  saving his work, user is alerted of unsaved changes
// To be implemented --> User View page
// To be implemented --> User View - All the content (ie. creator's hidden code/shown
//  code/editable code / user's code) to be packaged as JSON and sent to activity URL
// To be implemented --> Result Section to appear when user clicks on "run" button under the preview
// To be implemented --> Result Section to show the indicator that result is loading
//  while awaiting response
// To be implemented --> Result Section to support the various feedback options
//  - HTML / ipynb / text / JSON
// To be implemented --> HELP button to provide information about custom activity type to creators

// Implemented features
// Activity name captured from input and rendered in preview
// Activity URL captured from input and rendered in preview
// Functions to update content and editor mode within CustomActivity class
// formControl element abstracted
// Changed editor theme from monokai to github when editor mode markdown selected
// saved intial state in initialState constant
// reset button setState to initialState
// Set minline / width parameters of Preview readOnly editor

const AceEditor = Loadable({
  loader: () => import("../../components/AceEditor"),
  loading: () => <LinearProgress />
});

const Markdown = Loadable({
  loader: () => import("../../components/ReactMarkdown"),
  loading: () => <LinearProgress />
});

const initialState = {
  content: {},
  publicBlocks: 1,
  title: "",
  url: ""
};

export default class CustomActivity extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  setContent = (value, name) => {
    let content = Object.assign({}, this.state.content, {
      [`${name}value`]: value
    });
    this.setState({ content });
  };

  selectHandler = (e, name) => {
    let content = Object.assign({}, this.state.content, {
      [`${name}mode`]: e.target.value
    });
    this.setState({ content });
  };

  formControlElement = (
    htmlFor,
    inputLabel,
    onChangeHandler,
    param,
    value,
    menuItems
  ) => {
    return (
      <FormControl fullWidth key={htmlFor}>
        <InputLabel htmlFor={htmlFor} style={{ width: "150px" }}>
          {inputLabel}
        </InputLabel>
        <Select
          input={<Input />}
          onChange={e => onChangeHandler(e, param)}
          value={this.state.content[value] || "python"}
        >
          {menuItems.map(item => (
            <MenuItem key={item.name} value={item.value}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  editor = (name, title = "New Block") => {
    return (
      <Grid container spacing={8}>
        <Grid item xs={8}>
          <Typography style={{ marginTop: "15px" }} variant="subtitle1">
            {title}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          {this.formControlElement(
            "Editor Mode",
            "Mode",
            this.selectHandler,
            [name],
            `${name}mode`,
            [
              { name: "Markdown", value: "markdown" },
              { name: "JavaScript", value: "javascript" },
              { name: "Python", value: "python" }
            ]
          )}
        </Grid>
        <AceEditor
          editorProps={{ $blockScrolling: true }}
          key={[name]}
          maxLines={Infinity}
          minLines={8}
          mode={this.state.content[`${name}mode`] || "python"}
          onChange={value => {
            this.setContent(value, [name]);
          }}
          style={{ marginBottom: "12px" }}
          theme={
            this.state.content[`${name}mode`] === "markdown"
              ? "github"
              : "monokai"
          }
          value={this.state.content[`${name}value`]}
          width={"95%"}
        />
      </Grid>
    );
  };

  addEditor = () => {
    this.setState({ publicBlocks: this.state.publicBlocks + 1 });
  };

  addEditorButton = (key = "key") => {
    return (
      <Button key={key} onClick={this.addEditor}>
        Add more blocks <AddIcon />
      </Button>
    );
  };
  render() {
    // Not implemented --> const {} = this.props;
    const additionalEditors = [];
    for (let i = 1; i < this.state.publicBlocks; i++) {
      additionalEditors.push(<br key={i} />);
      additionalEditors.push(this.editor([`Public${i + 1}`]));
      additionalEditors.push(this.addEditorButton(`buttonKey${i}`));
    }
    return (
      <React.Fragment>
        <Grid container spacing={8}>
          <Grid container item lg={6} spacing={8} xs={12}>
            <Grid item xs={12}>
              <Typography variant="h6">Activity Settings</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                autoFocus
                label="Activity Name"
                onChange={e =>
                  this.setState(
                    Object.assign({}, this.state, {
                      title: e.target.value
                    })
                  )
                }
                value={this.state.title}
              />
              <br />
              <TextField
                label="Activity URL"
                onChange={e =>
                  this.setState(
                    Object.assign({}, this.state, {
                      url: e.target.value
                    })
                  )
                }
                value={this.state.url}
              />
            </Grid>
            <Grid item xs={3}>
              {this.formControlElement(
                "Feedback Mode",
                "Feedback Mode",
                this.selectHandler,
                "feedback",
                "feedbackmode",
                [
                  { name: "json", value: "JSON" },
                  { name: "ipynb", value: "ipynb" },
                  { name: "html", value: "HTML" },
                  { name: "text", value: "Text" }
                ]
              )}
            </Grid>
            <Grid item xs={12}>
              {this.editor("Hidden", "Hidden Code")}
              {this.editor("Public1", "Shown Code/Text")}
              {this.addEditorButton()}
              {additionalEditors}
              {this.editor("EditableCode", "Editable Code")}
            </Grid>
          </Grid>
          <Grid
            alignContent={"flex-start"}
            container
            item
            lg={6}
            spacing={8}
            xs={12}
          >
            <Grid item xs={8}>
              <Typography variant="h6">Preview</Typography>
              <Typography variant="subtitle1">
                {this.state.title || "Activity Title"}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Button>
                <Typography align="right" variant="body1">
                  Help
                </Typography>
                <HelpIcon style={{ marginLeft: "10px" }} />
              </Button>
            </Grid>
            <Grid item xs={12}>
              {Object.keys(this.state.content)
                .filter(key => key.includes("value"))
                .map(key => {
                  const editorMode = this.state.content[
                    `${key.slice(0, -5)}mode`
                  ];
                  const editorContent = this.state.content[key];
                  if (
                    !key.includes("Hidden") &&
                    !key.includes("EditableCode")
                  ) {
                    if (editorMode && editorMode === "markdown") {
                      return (
                        <Paper
                          key={`markdownPaper${key}`}
                          style={{ margin: "24px 2px", padding: "2.5%" }}
                        >
                          <Markdown source={editorContent} />
                        </Paper>
                      );
                    } else {
                      return (
                        <Paper
                          key={`editorPaper${key}`}
                          style={{ margin: "24px 2px", padding: "2.5%" }}
                        >
                          <AceEditor
                            editorProps={{ $blockScrolling: true }}
                            key={key}
                            maxLines={Infinity}
                            minLines={3}
                            mode={editorMode || "python"}
                            readOnly={true}
                            setOptions={{ showLineNumbers: false }}
                            showGutter={true}
                            theme="github"
                            value={this.state.content[key]}
                            width={"100%"}
                          />
                        </Paper>
                      );
                    }
                  }
                  return true;
                })}
              <Paper style={{ margin: "24px 2px", padding: "2.5%" }}>
                <Typography color="textSecondary">
                  Please first read the Path Activity above. <br />
                  Click the RUN button to test your solution.
                </Typography>
                <Grid container spacing={8}>
                  <Grid item xs={8}>
                    <Typography variant="h6">
                      Edit Your Solution Here
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      color="primary"
                      variant="contained"
                      // not implemented --> disabled={}
                      // not implemented --> onClick={}
                    >
                      Run
                    </Button>
                  </Grid>
                </Grid>
                <AceEditor
                  editorProps={{ $blockScrolling: true }}
                  maxLines={40}
                  minLines={20}
                  mode={this.state.content["EditableCodemode"] || "python"}
                  showGutter={false}
                  theme="github"
                  value={this.state.content["EditableCodevalue"]}
                  width={"95%"}
                />
              </Paper>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <Button
                  color="primary"
                  onClick={() => this.setState(initialState)}
                  style={{ margin: "24px 2px" }}
                  variant="contained"
                >
                  Reset
                </Button>
                <Button
                  color="primary"
                  // not implemented --> onClick={}
                  style={{ margin: "24px 2px" }}
                  variant="contained"
                >
                  Save Activity
                </Button>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
