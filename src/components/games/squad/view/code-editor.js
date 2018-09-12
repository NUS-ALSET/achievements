import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Store from '../store';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/mode/python';
import 'brace/theme/github';
import { defaultJavascriptFunctionCode, defaultPythonCodeFunction } from './Components/defaultCode';
import { observer } from 'mobx-react';

class CodeEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customFunctionCode: defaultPythonCodeFunction,
            updatedCode: defaultPythonCodeFunction,
            jsCode: defaultJavascriptFunctionCode,
            errors: [],
            mode: 'javascript',
        };
        this.resetUndoManager = false;
        this.updateCustomCode = this.updateCustomCode.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.toggleMode = this.toggleMode.bind(this);
        this.handleMode = this.handleMode.bind(this);
        this.handleCodeExecution = this.handleCodeExecution.bind(this);
        this.resetDefaultCode = this.resetDefaultCode.bind(this);
    }
    resetDefaultCode() {
        this.setState({
            customFunctionCode: defaultPythonCodeFunction,
            updatedCode: defaultPythonCodeFunction,
            jsCode: defaultJavascriptFunctionCode,
        });
    }
    updateCustomCode() {
        if (this.state.errors.length > 0) {
            alert('Invalid code,please correct thr code');
        return;
        }
        this.setState({ customFunctionCode: this.state.updatedCode });
        Store.func = this.state.updatedCode;
    }
    toggleMode() {
        this.setState({ showMode: !this.state.showMode });
    }
    handleChange(newCode) {
        if (this.state.mode === 'python') {
            this.setState({ updatedCode: newCode });
        } else {
            this.setState({ jsCode: newCode });
        }
    }
    handleValidation(messages) {
        const errors = messages.filter(msg => (msg.type === 'error' ? true : false));
        this.setState({ errors: errors });
    }
    handleMode(mode) {
        this.setState({ mode });
        this.resetUndoManager = true;
    }
    handleCodeExecution(){
        if (this.state.errors.length > 0) {
            console.log(this.state.errors);
            alert('Invalid code,please correct thr code');
            return;
        }
        if (this.state.mode === 'python') {
            var error = window.createFunctionFromPython(this.state.updatedCode);
            if(error==0){
                Store.func = window.getPlayersCommands;
                Store.needToRestartGame = true;
            }
        } else {
            //window.newPySrc = this.state.jscode;
            var error = 0;
            try{
                Store.func = eval("("+this.state.jsCode+")");
                Store.needToRestartGame = true;
            }catch(e){
                alert('Error ' + e.name + ":" + e.message);
            }
        }
    }
    componentWillMount() {
        //window.newPySrc = '';
        //window.oldPySrc = '';
        window.result = 'down';
        window.world = null;
        window.calculateShortestPath=()=>{};
        Store.func = this.state.jsCode;
    }
    componentDidUpdate() {
        if (this.resetUndoManager) {
            const editor = this.refs.alsetEditor.editor;
            editor.getSession().setUndoManager(new window.ace.UndoManager());
            this.resetUndoManager = false;
        }
    }
    render() {
        const { classes } = this.props;
        const { updatedCode, mode, jsCode } = this.state;
        const code = mode === 'python' ? updatedCode : jsCode;
        return (
            <div>
            {(Store.player1ControlSelected=='custom code'||Store.player2ControlSelected=='custom code')&&<div style={{position:'absolute', top:'100%'}} className={"editorContainer"}>
                <h4 style={{ margin: '4px' }}>
                    Write <b className="active-text">{mode.toUpperCase()}</b> Code Here :{' '}
                </h4>
                <h5 style={{ margin: '12px' }}>
                    <strong>Note : </strong>Please do not change the name of the function{' '}
                    <strong>getPlayersCommands(world)</strong> & function must return one of these direction (LEFT, RIGHT, UP,
                    DOWN)
                </h5>
                <div>
                    <button
                        type="button"
                        className={mode === 'python' ? 'btn half active' : 'btn half'}
                        onClick={() => this.handleMode('python')}
                    >
                        Python
                    </button>
                    <button
                        type="button"
                        className={mode === 'python' ? 'btn half' : 'btn half active'}
                        onClick={() => this.handleMode('javascript')}
                    >
                        Javascript
                    </button>
                </div>
                <div id="editor" className="editor">
                    <AceEditor
                        ref="alsetEditor"
                        name="alset-editor"
                        mode={mode}
                        theme="github"
                        width={'100%'}
                        height={'650px'}
                        onChange={this.handleChange}
                        onValidate={this.handleValidation}
                        fontSize={16}
                        showPrintMargin={false}
                        showGutter={true}
                        highlightActiveLine={true}
                        enableLiveAutocompletion={true}
                        value={code}
                        wrapEnabled={true}
                        setOptions={{
                        enableBasicAutocompletion: false,
                        enableLiveAutocompletion: false,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 2,
                        }}
                    />
                </div>
                <div className="">
                    <button type="button" className="btn half active" id="run" onClick={this.handleCodeExecution}>
                        Update Solution
                    </button>
                    <button type="button" className="btn half reset" onClick={this.resetDefaultCode}>
                        Reset Solution
                    </button>
                </div>
                <div id="js" className="js" hidden>
                    <h4>Python Console</h4>
                    <textarea id="python-console" className="res" />
                </div>
            </div>}
            </div>
        );
    }
}

export default observer(CodeEditor);