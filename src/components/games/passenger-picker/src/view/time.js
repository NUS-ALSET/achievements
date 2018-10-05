import React from 'react';
import {observer} from 'mobx-react';

const TimeShower = ({store})=>{
    return <p style={{margin:0, textAlign:'center', position: 'absolute', left: '50%', transform:'translate(-50%,0)'}}>Time left:{store.time}</p>
}

export default observer(TimeShower);