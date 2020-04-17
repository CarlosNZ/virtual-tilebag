import React, { useState } from "react";

export const PlayerNameInput = (props) => {
  return (
    <p>
      <label>Player {props.playerNum} name: </label>
      <input type="text" name="playerName" />
    </p>
  );
};

export const NewGame = () => {
  const [playerNum, setPlayerNum] = useState(2);

  const updatePlayerNumber = (e) => {
    setPlayerNum(e.target.value);
  };

  const createPlayerInputFields = (num) => {
    let playerArray = [];
    for (let i = 1; i <= num; i++) {
      playerArray.push(<PlayerNameInput key={i} playerNum={i} />);
    }
    return playerArray;
  };

  const createGame = (e) => {
    e.preventDefault();
    console.log(e.target);
  };

  return (
    <div>
      <h3>Create a new game</h3>
      <form onSubmit={createGame}>
        <p>
          <label>How many players? </label>
          <select name="playerNum" value={playerNum} onChange={updatePlayerNumber}>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </p>
        {createPlayerInputFields(playerNum)}
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default NewGame;
