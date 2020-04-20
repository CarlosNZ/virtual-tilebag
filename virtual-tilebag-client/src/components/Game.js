import React, { useState, useEffect } from "react";
import * as FirestoreDb from "../services/firebase";
import { shuffleBag, drawFromBag } from "../services/tilebag";

export const Game = (props) => {
  console.log("Game Re-render");

  // Game constants
  const gameId = props.match.params.gameID;
  const thisPlayer = parseInt(props.match.params.player);
  const tileBag = shuffleBag(gameId);

  return (
    <div>
      <Rack gameId={gameId} thisPlayer={thisPlayer} tileBag={tileBag} />
    </div>
  );
};

const Rack = (props) => {
  console.log("Rack re-render");
  // State values
  const [rackSelectedIndices, setRackSelectedIndices] = useState(new Set());
  const [gameData, setGameData] = useState({});
  const [players, setPlayers] = useState([]);
  const [racks, setRacks] = useState([]);

  // Listener for changes to database -> update local state
  useEffect(() => {
    const unsubscribe = FirestoreDb.syncGameState(props.gameId, (doc) => {
      setGameData({
        currentPlayer: parseInt(doc.data().currentPlayer),
        tilesRemaining: parseInt(doc.data().tilesRemaining),
      });
      setPlayers(doc.data().players);
      setRacks(doc.data().racks);
      console.log("Updating from database");
    });
    return unsubscribe;
  }, []);

  // Once all players have drawn initial tiles, game becomes ready
  useEffect(() => {
    if (racks.filter((r) => r !== "").length === players.length && players.length > 0 && gameData.currentPlayer === 0) {
      FirestoreDb.updateState(props.gameId, "currentPlayer", 1);
      console.log("Game is ready...");
    }
  }, [racks]);

  const rackStringToArray = (rackString) => {
    if (rackString === undefined) rackString = "";
    const rackArray = ["", "", "", "", "", "", ""];
    rackString.split("").map((letter, index) => (rackArray[index] = letter));
    return rackArray;
  };

  const getNewTiles = () => {
    const selectedTilesIndices = gameData.currentPlayer === 0 ? [0, 1, 2, 3, 4, 5, 6] : Array.from(rackSelectedIndices);
    const newTiles = drawFromBag(props.tileBag, gameData.tilesRemaining, selectedTilesIndices.length);
    const newTileCount = newTiles.length;
    const newRack = rackStringToArray(racks[props.thisPlayer - 1]);
    selectedTilesIndices.map(function (i) {
      newRack[i] = newTiles.pop();
    });

    const newRacks = [...racks];
    newRacks[props.thisPlayer - 1] = newRack.join("");
    FirestoreDb.updateState(props.gameId, "racks", newRacks);
    setRackSelectedIndices(new Set());
    console.log("Current player: ", gameData.currentPlayer);
    const newPlayer =
      gameData.currentPlayer === 0 ? gameData.currentPlayer : (gameData.currentPlayer % players.length) + 1;
    console.log("New player: ", newPlayer);
    FirestoreDb.updateState(props.gameId, "currentPlayer", newPlayer);
    FirestoreDb.updateState(props.gameId, "tilesRemaining", gameData.tilesRemaining - newTileCount);
  };

  const toggleLetterSelected = (letterIndex) => {
    const tempSet = new Set(rackSelectedIndices);
    if (tempSet.has(letterIndex)) {
      tempSet.delete(letterIndex);
    } else tempSet.add(letterIndex);
    setRackSelectedIndices(tempSet);
  };

  const canUpdate =
    gameData.currentPlayer === props.thisPlayer || (gameData.currentPlayer === 0 && racks[props.thisPlayer - 1] === "");

  return (
    <div>
      <div id="info">
        <p>
          Current Player: {players[gameData.currentPlayer - 1]} (Player {gameData.currentPlayer} of {players.length})
        </p>
        <p>Tiles remaining: {gameData.tilesRemaining}</p>
      </div>
      <div id="rack">
        {rackStringToArray(racks[props.thisPlayer - 1]).map((letter, index) => {
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
