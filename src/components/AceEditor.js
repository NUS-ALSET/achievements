/**
 * @file AceEditor container module. It's just a wrap for real AceEditor to get
 * easy way for code splitting
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 23.06.18
 */

import React from "react";
import ReactAce from "react-ace";

// These imports make this module required to detach
import "brace/mode/python";
import "brace/mode/json";
import "brace/mode/javascript";
import "brace/mode/markdown";
import "brace/theme/github";

class AceEditor extends React.PureComponent {
  /* Using propTypes from another component is not safe because they may be removed in production builds
   */
  // static propTypes = ReactAce.propTypes;

  render() {
    const { ...props } = this.props;
    return (
      <ReactAce
        re
        {...props}
        editorProps={props.editorProps || { $blockScrolling: true }}
      />
    );
  }
}

export default AceEditor;
