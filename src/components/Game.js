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
    // eslint-disable-next-line
  }, []);

  // Once all players have drawn initial tiles, game becomes ready
  useEffect(() => {
    if (racks.filter((r) => r !== "").length === players.length && players.length > 0 && gameData.currentPlayer === 0) {
      FirestoreDb.updateState(props.gameId, "currentPlayer", 1);
      console.log("Game is ready...");
    }
    // eslint-disable-next-line
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
    // eslint-disable-next-line
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

  const getInfoBarClass = {
    waiting: "waiting-bg",
    myTurn: "my-turn-bg",
    othersTurn: "other-turn-bg",
  };

  const gameStatus = () =>
    gameData.currentPlayer === 0 ? "waiting" : gameData.currentPlayer === props.thisPlayer ? "myTurn" : "othersTurn";

  return (
    <main>
      <div id="info-bar" className={getInfoBarClass[gameStatus()]}>
        <p>
          Player {props.thisPlayer}: {players[[props.thisPlayer] - 1]}
        </p>
        <p>
          {gameStatus() === "waiting"
            ? "Waiting to start..."
            : gameStatus() === "myTurn"
            ? "Your turn"
            : players[gameData.currentPlayer - 1] + "'s turn"}
        </p>
      </div>
      <div id="rack">
        {rackStringToArray(racks[props.thisPlayer - 1]).map((letter, index) => {
          return (
            <Tile
              key={index}
              selected={rackSelectedIndices.has(index)}
              onClick={() => toggleLetterSelected(index)}
              letter={letter}
            />
          );
        })}
      </div>
      <button disabled={!canUpdate} onClick={getNewTiles}>
        Draw tiles from bag
      </button>
      <div id="tiles-remaining">
        <p>{gameData.tilesRemaining} tiles left in bag</p>
      </div>
      <div id="player-box">
        {players.map((player, i) => {
          return (
            <p>
              Player {i + 1}: {player}
            </p>
          );
        })}
      </div>
    </main>
  );
};

const Tile = (props) => {
  return (
    <div className="tile" onClick={props.onClick}>
      <p className={props.selected ? "red" : ""}>{props.letter}</p>
    </div>
  );
};
