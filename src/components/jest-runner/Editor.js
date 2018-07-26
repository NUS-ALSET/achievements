import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/mode/jsx';
import 'brace/mode/css';
import 'brace/mode/typescript';
import 'brace/mode/scss';
import 'brace/theme/github';

const extensions = {
    js: 'jsx', // becuase in react javascript is reactive javascript
    py: 'python',
    ts: 'typescript'
};

class Editor extends React.Component {
    constructor() {
        super();
        this.state = {
            code: '',
            extension: 'jsx'
        }
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedFile) {
            if (this.props.selectedFile && this.props.selectedFile.path!==nextProps.selectedFile.path && this.props.selectedFile.code !== this.state.code) {
                const hasOk = window.confirm("Do you want to save changes?");
                if (hasOk) {
                    this.props.saveFile(this.props.selectedFile, this.state.code);
                }
            }
            const exts = nextProps.selectedFile.path.split('.');
            let ext = exts[exts.length - 1];
            ext = extensions[ext] ? extensions[ext] : ext;
            this.setState({ code: nextProps.selectedFile.code, extension: ext });
            setTimeout(() => {
                const session = this.refs.AceEditor.editor.getSession();
                const undoManager = session.getUndoManager();
                undoManager.reset();
                session.setUndoManager(undoManager);
            }, 1000)
        }
    }
    render() {
        return (
            <div className="editor">
                { this.props.selectedFile.code!==this.state.code &&
                    <button className="save-btn" onClick={()=>this.props.saveFile(this.props.selectedFile, this.state.code)}>Save File</button>
                }
                <AceEditor
                    ref="AceEditor"
                    mode={this.state.extension}
                    theme="github"
                    name="alsetEditor"
                    value={this.state.code}
                    width={'100%'}
                    height={'100%'}
                    fontSize={16}
                    editorProps={{ $blockScrolling: true }}
                    showPrintMargin={false}
                    readOnly={this.props.selectedFile && this.props.selectedFile.readOnly}
                    onChange={(v) => { this.setState({ code: v }) }}
                />
            </div>
        );
    }
}

export default Editor;