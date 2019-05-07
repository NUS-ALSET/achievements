/* eslint-disable react/display-name */

import * as React from "react";
import PropTypes from "prop-types";
import Loadable from "react-loadable";

import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import DeleteIcon from "@material-ui/icons/Delete";

const AceEditor = Loadable({
  loader: () => import("../../components/AceEditor"),
  loading: () => <LinearProgress />
});

const styles = {
  blockTitle: {
    marginTop: 20
  }
};

export class CustomTaskEditor extends React.PureComponent {
  static propTypes = {
    block: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func
  };

  onRemove = block => () => this.props.onRemove(block);

  render() {
    const { block, onChange, onRemove } = this.props;
    return (
      <Grid container item spacing={8} xs={12}>
        <Grid item xs={7}>
          {onRemove ? (
            <TextField
              fullWidth
              label="Title"
              onChange={onChange("title", block)}
              value={block.metadata.achievements.title}
            />
          ) : (
            <Typography style={styles.blockTitle} variant="subtitle1">
              {block.metadata.achievements.title}
            </Typography>
          )}
        </Grid>
        <Grid
          id={`custom-task-mode-${block.metadata.achievements.type}`}
          item
          xs={4}
        >
          <TextField
            fullWidth
            label="Editor mode"
            onChange={onChange("mode", block)}
            select
            value={block.metadata.achievements.language_info.name}
          >
            {!["editable", "hidden"].includes(
              block.metadata.achievements.type
            ) && <MenuItem value="markdown">Markdown</MenuItem>}
            <MenuItem value="javascript">JavaScript</MenuItem>
            <MenuItem value="python">Python</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={1}>
          {onRemove && (
            <IconButton onClick={this.onRemove(block)}>
              <DeleteIcon />
            </IconButton>
          )}
        </Grid>
        <Grid
          id={`custom-task-editor-${block.metadata.achievements.type}`}
          item
          xs={12}
        >
          <AceEditor
            editorProps={{ $blockScrolling: true }}
            maxLines={Infinity}
            minLines={8}
            mode={block.metadata.achievements.language_info.name}
            onChange={onChange("content", block)}
            theme="github"
            value={block.source.join("\n")}
            width="95%"
          />
        </Grid>
      </Grid>
    );
  }
}
