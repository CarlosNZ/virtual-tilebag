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
  let numOfPlayers = 2; // UPDATE THIS FROM DATABASE

  let tilesRemaining;
  let currentPlayer;

  const [gameLoaded, setGameLoaded] = useState(true);

  // FirestoreDb.getGame(gameId)
  //   .then((doc) => {
  //     console.log(doc.data());
  //     setGameLoaded(true);
  //     tilesRemaining = doc.data().tilesRemaining;
  //     numOfPlayers = doc.data().players.length;
  //     currentPlayer = doc.data().currentPlayer;
  //     // alert("Loaded!");
  //     console.log(tilesRemaining, numOfPlayers, currentPlayer);
  //   })
  //   .catch(() => {
  //     return <p>Game failed to load</p>;
  //   });

  return (
    <div>
      <h1>This will render first</h1>
      {gameLoaded && (
        <div>
          <Rack
            gameId={gameId}
            thisPlayer={thisPlayer}
            tileBag={tileBag}
            numOfPlayers={numOfPlayers}
            currentPlayer={currentPlayer}
            tilesRemaining={tilesRemaining}
          />
        </div>
      )}
    </div>
  );
};

const Rack = (props) => {
  console.log("Rack re-render");
  // State values
  const [rack, setRack] = useState([]);
  const [rackSelectedIndices, setRackSelectedIndices] = useState(new Set());
  const [gameData, setGameData] = useState({});
  const [players, setPlayers] = useState([]);
  const [hasGameStarted, setHasGameStarted] = useState();

  // console.log(gameData);

  // Initialise rack if it's empty (i.e. starting new game)
  // useEffect(() => {
  //   if (rack.length === 0) {
  //     console.log("Initialising rack...");
  //     // setRack(["", "", "", "", "", "", ""]);
  //     getNewTiles([0, 1, 2, 3, 4, 5, 6]);
  //   }
  // }, [rack]);

  // Listener for changes to database -> update local state
  useEffect(() => {
    const unsubscribe = FirestoreDb.syncGameState(props.gameId, (doc) => {
      setGameData({
        currentPlayer: doc.data().currentPlayer,
        tilesRemaining: doc.data().tilesRemaining,
      });
      setPlayers(doc.data().players);
      setRack(stringToRack(doc.data().racks[doc.data().currentPlayer - 1]));
      setHasGameStarted();
      console.log("Updating from database");
      // console.log(gameData);
    });
    return unsubscribe;
  }, []);

  // Update Database on changes to Rack/Tile state
  useEffect(() => {
    // console.log("Tiles remaining", tilesRemaining);
    console.log("Updating game in database...");
    if (!gameData.init) FirestoreDb.updateGame(props.gameId, gameData);
  }, [gameData]);

  const stringToRack = (rackString) => {
    const rackArray = ["", "", "", "", "", "", ""];
    rackString.split("").map((letter, index) => (rackArray[index] = letter));
    return rackArray;
  };

  const getNewTiles = (currentRackIndices) => {
    // Exception for initial draw -- build array and don't advance player
    let advancePlayer = true;
    if (rack.length === 0) {
      const advancePlayer = false;
      setRack(["", "", "", "", "", "", ""]);
    }
    const newTiles = drawFromBag(props.tileBag, gameData.tilesRemaining, currentRackIndices.length);
    const newTileCount = newTiles.length;
    const newRack = [...rack];
    currentRackIndices.map((i) => {
      newRack[i] = newTiles.pop();
    });
    setRack(newRack);
    setRackSelectedIndices(new Set());
    const newPlayer = advancePlayer ? (gameData.currentPlayer % props.numOfPlayers) + 1 : gameData.currentPlayer;
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
        <p>Init: {gameData.init}</p>
        <p>
          Current Player: {players[gameData.currentPlayer - 1]} (Player {gameData.currentPlayer})
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
      <button
        disabled={gameData.currentPlayer != props.thisPlayer}
        onClick={() => getNewTiles(Array.from(rackSelectedIndices))}
      >
        Update Letters
      </button>
    </div>
  );
};
