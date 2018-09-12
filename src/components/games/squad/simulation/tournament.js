import level1 from './level1';
import level2 from './level2';
import level3 from './level3';
import config from './config.json';
import React, { Component } from 'react';
import tableResult from './table-result';
import { observer } from 'mobx-react';
import Store from '../store';

class Tournament extends Component {
    constructor(){
        super();
        this.state = {
            presult:"",
            showTable:true
        }
        Object.defineProperty(level1, "name", { value: "level1" });
        Object.defineProperty(level2, "name", { value: "level2" });
        Object.defineProperty(level3, "name", { value: "level3" });
    }
    render() {
        return (
            <div style={{position:'absolute', zIndex:100, left:'50%', transform:'translate(-50%, 0%)', top:'130px'}}>
                <div style={{textAlign:'center'}}>
                    <button className="control-btn active"  onClick={()=>{
                        /*tournamentSimulate.default().then((result)=>{
                            this.setState({presult : result, showTable: true});
                        });*/
                        var result = tableResult([level1,level2,level3], config);
                        this.setState({presult : result, showTable: true});
                    }}
                    >Run tournament</button>
                    <button className="control-btn active"  onClick={()=>{
                        /*tournamentSimulate.default().then((result)=>{
                            this.setState({presult : result, showTable: true});
                        });*/
                        if(typeof Store.func == 'string')
                            Store.func = eval("("+Store.func+")");
                        var result = tableResult([Store.func,level1,level2,level3], config);
                        this.setState({presult : result, showTable: true});
                    }}
                    >Custom code tournament</button>
                    <button className="control-btn active" onClick={()=>{
                        this.setState({showTable: !this.state.showTable});
                    }}>Hide tournament</button>
                </div>
                <div style={{background:'white'}}>
                    {
                        this.state.showTable && <p dangerouslySetInnerHTML={{__html: this.state.presult}} />
                    }
                </div>
            </div>
        );
      }
}
//export default Tournament;
export default observer(Tournament);