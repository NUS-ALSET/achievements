import React from 'react';
import { observer } from 'mobx-react';


const WinningScreen = ({ restartGame, gameOver, submitSolition }) => {
  return <div>
    {gameOver.status && <div className={"result-display"}>
      <h1>
        {gameOver.message}
      </h1>
      <button onClick={restartGame}>PLAY AGAIN</button>
      <br></br>
      <button onClick={submitSolition}>SUBMIT SOLUTION</button>
    </div>}
  </div>
}

export default observer(WinningScreen);