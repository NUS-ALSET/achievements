import React from "react";
import Markdown from "react-markdown";

import "brace/mode/javascript";
import "brace/mode/python";
import "brace/mode/markdown";
import "brace/theme/monokai";
import "brace/theme/github";

class ReactMarkdown extends React.PureComponent {
  /* Using propTypes from another component is not safe because they may be removed in production builds
   */
  // static propTypes = ReactAce.propTypes;

  render() {
    const { ...props } = this.props;
    return <Markdown {...props} />;
  }
}

export default ReactMarkdown;
