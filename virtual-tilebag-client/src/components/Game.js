import React, { useState, useEffect } from "react";
import * as FirestoreDb from "../services/firebase";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import { shuffleBag, drawFromBag } from "../services/tilebag";

export const Game = (props) => {
  console.log("Game Re-render");

  // Game constants
  const gameId = props.match.params.gameID;
  const thisPlayer = props.match.params.player;
  const tileBag = shuffleBag(gameId);

  let tilesRemaining;
  let currentPlayer;

  const [gameLoaded, setGameLoaded] = useState(true);

  return (
    <div>
      <h1>This will render first</h1>
      {gameLoaded && (
        <div>
          <Rack gameId={gameId} thisPlayer={thisPlayer} tileBag={tileBag} />
        </div>
      )}
    </div>
  );
};

const Rack = (props) => {
  console.log("Rack re-render");
  // State values
  // const [rack, setRack] = useState(["", "", "", "", "", "", ""]);
  const [rackSelectedIndices, setRackSelectedIndices] = useState(new Set());
  const [gameData, setGameData] = useState({});
  const [players, setPlayers] = useState([]);
  const [racks, setRacks] = useState([]);

  // Listener for changes to database -> update local state
  useEffect(() => {
    const unsubscribe = FirestoreDb.syncGameState(props.gameId, (doc) => {
      setGameData({
        currentPlayer: doc.data().currentPlayer,
        tilesRemaining: doc.data().tilesRemaining,
      });
      setPlayers(doc.data().players);
      // setRack(stringToRack(doc.data().racks[props.thisPlayer - 1]));
      setRacks(doc.data().racks);
      console.log("Updating from database");
      // console.log(gameData);
    });
    return unsubscribe;
  }, []);

  // Update hasGameStarted based on all players' rack state
  useEffect(() => {
    if (racks.filter((r) => r !== "").length === players.length && players.length > 0 && gameData.currentPlayer == 0) {
      FirestoreDb.updateDatabaseState(props.gameId, "currentPlayer", 1);
      console.log("Game is ready...");
    }
  }, [racks]);

  const stringToRack = (rackString) => {
    if (rackString === undefined) rackString = "";
    const rackArray = ["", "", "", "", "", "", ""];
    rackString.split("").map((letter, index) => (rackArray[index] = letter));
    return rackArray;
  };

  const getNewTiles = () => {
    const selectedIndices = gameData.currentPlayer == 0 ? [0, 1, 2, 3, 4, 5, 6] : Array.from(rackSelectedIndices);

    const newTiles = drawFromBag(props.tileBag, gameData.tilesRemaining, selectedIndices.length);
    const newTileCount = newTiles.length;
    const newRack = stringToRack(racks[props.thisPlayer - 1]);
    selectedIndices.map((i) => {
      newRack[i] = newTiles.pop();
    });

    const newRacks = [...racks];
    newRacks[props.thisPlayer - 1] = newRack.join("");
    FirestoreDb.updateDatabaseState(props.gameId, "racks", newRacks);
    setRackSelectedIndices(new Set());
    console.log("Current player: ", gameData.currentPlayer);
    const newPlayer =
      gameData.currentPlayer == 0 ? gameData.currentPlayer : (gameData.currentPlayer % players.length) + 1;
    console.log("New player: ", newPlayer);
    FirestoreDb.updateDatabaseState(props.gameId, "currentPlayer", newPlayer);
    FirestoreDb.updateDatabaseState(props.gameId, "tilesRemaining", gameData.tilesRemaining - newTileCount);
  };

  const toggleLetterSelected = (letterIndex) => {
    const tempSet = new Set(rackSelectedIndices);
    if (tempSet.has(letterIndex)) {
      tempSet.delete(letterIndex);
    } else tempSet.add(letterIndex);
    setRackSelectedIndices(tempSet);
  };

  const canUpdate =
    gameData.currentPlayer == props.thisPlayer || (gameData.currentPlayer == 0 && racks[props.thisPlayer - 1] == "");

  return (
    <div>
      <div id="info">
        <p>
          Current Player: {players[gameData.currentPlayer - 1]} (Player {gameData.currentPlayer} of {players.length})
        </p>
        <p>Tiles remaining: {gameData.tilesRemaining}</p>
      </div>
      <div id="rack">
        {stringToRack(racks[props.thisPlayer - 1]).map((letter, index) => {
          return (
            <span
              key={index}
              className={rackSelectedIndices.has(index) ? "red" : ""}
              onClick={() => toggleLetterSelected(index)}
            >
              {letter}
            </span>
          );
        })}
      </div>
      <button disabled={!canUpdate} onClick={getNewTiles}>
        Draw tiles from bag
      </button>
    </div>
  );
};
