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
  const [rack, setRack] = useState(["", "", "", "", "", "", ""]);
  const [rackSelectedIndices, setRackSelectedIndices] = useState(new Set());
  const [gameData, setGameData] = useState({});
  const [players, setPlayers] = useState([]);
  const [hasGameStarted, setHasGameStarted] = useState();
  const [allRacks, setAllRacks] = useState([]);

  // Listener for changes to database -> update local state
  useEffect(() => {
    const unsubscribe = FirestoreDb.syncGameState(props.gameId, (doc) => {
      setGameData({
        currentPlayer: doc.data().currentPlayer,
        tilesRemaining: doc.data().tilesRemaining,
      });
      setPlayers(doc.data().players);
      setRack(stringToRack(doc.data().racks[props.thisPlayer - 1]));
      setHasGameStarted(doc.data().hasGameStarted);
      setAllRacks(doc.data().racks);
      console.log("Updating from database");
      // console.log(gameData);
    });
    return unsubscribe;
  }, []);

  // Update Database on changes to Rack/Tile state
  useEffect(() => {
    console.log("Updating game in database...");
    console.log(allRacks);
    FirestoreDb.updateGame(props.gameId, props.thisPlayer, gameData, rack, allRacks, hasGameStarted);
  }, [gameData]);

  // Update hasGameStarted based on all players' rack state
  useEffect(() => {
    if (allRacks.filter((r) => r !== "").length === players.length) setHasGameStarted(true);
  }, [allRacks]);

  const stringToRack = (rackString) => {
    const rackArray = ["", "", "", "", "", "", ""];
    rackString.split("").map((letter, index) => (rackArray[index] = letter));
    return rackArray;
  };

  const getNewTiles = () => {
    // Exception for initial draw -- build array and don't advance player

    const selectedIndices = hasGameStarted ? Array.from(rackSelectedIndices) : [0, 1, 2, 3, 4, 5, 6];

    const newTiles = drawFromBag(props.tileBag, gameData.tilesRemaining, selectedIndices.length);
    const newTileCount = newTiles.length;
    const newRack = [...rack];
    selectedIndices.map((i) => {
      newRack[i] = newTiles.pop();
    });
    // console.log(newRack);
    setRack(newRack);
    setRackSelectedIndices(new Set());
    const newPlayer = hasGameStarted ? (gameData.currentPlayer % players.length) + 1 : gameData.currentPlayer;
    setGameData({
      ...gameData,
      tilesRemaining: gameData.tilesRemaining - newTileCount,
      currentPlayer: newPlayer,
    });
  };

  const toggleLetterSelected = (letterIndex) => {
    const tempSet = new Set(rackSelectedIndices);
    if (tempSet.has(letterIndex)) {
      tempSet.delete(letterIndex);
    } else tempSet.add(letterIndex);
    setRackSelectedIndices(tempSet);
  };

  return (
    <div>
      <div id="info">
        <p>
          Current Player: {players[gameData.currentPlayer - 1]} (Player {gameData.currentPlayer} of {players.length})
        </p>
        <p>Tiles remaining: {gameData.tilesRemaining}</p>
      </div>
      <div id="rack">
        {rack.map((letter, index) => {
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
      <button disabled={gameData.currentPlayer != props.thisPlayer && hasGameStarted} onClick={getNewTiles}>
        Update Letters
      </button>
    </div>
  );
};
