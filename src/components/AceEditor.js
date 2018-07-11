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
import "brace/theme/github";

class AceEditor extends React.PureComponent {
  static propTypes = ReactAce.propTypes;

  render() {
    const { ...props } = this.props;
    return <ReactAce {...props} />;
  }
}

export default AceEditor;
