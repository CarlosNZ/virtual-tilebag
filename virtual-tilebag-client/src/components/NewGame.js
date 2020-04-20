import React, { useState } from "react";
import * as FirestoreDb from "../services/firebase";
import { useHistory } from "react-router-dom";

const PlayerNameInput = (props) => {
  return (
    <p>
      <label>Player {props.playerNum} name: </label>
      <input
        type="text"
        name="playerName"
        onChange={(e) => (props.playerNames[props.playerNum - 1] = e.target.value)}
      />
    </p>
  );
};

export const NewGame = () => {
  const [playerNum, setPlayerNum] = useState(2);
  const playerNames = useState(["", "", "", ""]);
  let history = useHistory();

  const createPlayerInputFields = (num) => {
    let playerArray = [];
    for (let i = 1; i <= num; i++) {
      playerArray.push(<PlayerNameInput key={i} playerNum={i} playerNames={playerNames} />);
    }
    return playerArray;
  };

  const initGame = (e) => {
    let gameId = "";
    e.preventDefault();

    // Create game in Database and go to game URL
    FirestoreDb.createGame(playerNames.filter((p) => p !== ""))
      .then((docRef) => {
        console.log(docRef.id);
        gameId = docRef.id;
      })
      .then(() => {
        history.push("/game/id-" + gameId + "/p1");
        //TO DO : Add error/fail option (.catch?)
      });
  };

  return (
    <div>
      <h3>Create a new game</h3>
      <form onSubmit={initGame}>
        <p>
          <label>How many players? </label>
          <select name="playerNum" value={playerNum} onChange={(e) => setPlayerNum(e.target.value)}>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </p>
        {createPlayerInputFields(playerNum)}
        <input type="submit" value="Create game" />
      </form>
    </div>
  );
};

export default NewGame;
