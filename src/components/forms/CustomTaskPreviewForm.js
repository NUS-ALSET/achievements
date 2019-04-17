/* eslint-disable react/display-name */

import * as React from "react";
import PropTypes from "prop-types";
import Loadable from "react-loadable";

import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";

const AceEditor = Loadable({
  loader: () => import("../../components/AceEditor"),
  loading: () => <LinearProgress />
});

const Markdown = Loadable({
  loader: () => import("../../components/ReactMarkdown"),
  loading: () => <LinearProgress />
});

export class CustomTaskPreviewForm extends React.PureComponent {
  static propTypes = {
    taskInfo: PropTypes.object
  };
  render() {
    const { taskInfo } = this.props;
    return (
      <React.Fragment>
        {taskInfo.json.cells.map(block => (
          <Grid
            item
            key={
              block.metadata.achievements.type +
              block.metadata.achievements.index
            }
            xs={12}
          >
            {block.cell_type === "text" ? (
              <Markdown source={block.source.join("\n")} />
            ) : (
              <AceEditor
                maxLines={Infinity}
                minLines={3}
                mode={block.metadata.achievements.language_info.name}
                readOnly={true}
                setOptions={{ showLineNumbers: false }}
                showGutter={true}
                theme="github"
                value={block.source.join("\n")}
                width={"100%"}
              />
            )}
          </Grid>
        ))}
      </React.Fragment>
    );
  }
}
