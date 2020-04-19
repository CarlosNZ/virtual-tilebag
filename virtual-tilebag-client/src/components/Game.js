import React, { useState, useEffect } from "react";
import * as FirestoreDb from "../services/firebase";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import { shuffleBag, drawFromBag } from "../services/tilebag";

export const Game = (props) => {
  // Game constants
  const gameId = props.match.params.gameID;
  const thisPlayer = props.match.params.player;
  const tileBag = shuffleBag(gameId);
  let numOfPlayers = 2; // UPDATE THIS FROM DATABASE

  let tilesRemaining;
  let currentPlayer;

  const [gameLoaded, setGameLoaded] = useState(false);

  FirestoreDb.getGame(gameId)
    .then((doc) => {
      console.log(doc.data());
      setGameLoaded(true);
      tilesRemaining = doc.data().tilesRemaining;
      numOfPlayers = doc.data().players.length;
      currentPlayer = doc.data().currentPlayer;
      // alert("Loaded!");
      console.log(tilesRemaining, numOfPlayers, currentPlayer);
    })
    .catch(() => {
      return <p>Game failed to load</p>;
    });

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
  // State values
  const [currentPlayer, setCurrentPlayer] = useState(1);
  // const [tilesRemaning, setTilesRemaining] = useState(100);
  const [rack, setRack] = useState([]);
  const [rackSelectedIndices, setRackSelectedIndices] = useState(new Set());
  const [gameData, setGameData] = useState({ currentPlayer: 1, tilesRemaining: 100, players: ["A", "B"] });

  // useEffect(() => {
  //   // alert("This only happens once!");
  //   FirestoreDb.getGame(props.gameId).then((doc) => {
  //     console.log(doc.data());
  //   });
  // }, []);

  // Initialise rack if it's empty (i.e. starting new game)
  useEffect(() => {
    if (rack.length === 0) {
      console.log("Initialising rack...");
      setRack(["", "", "", "", "", "", ""]);
      getNewTiles([0, 1, 2, 3, 4, 5, 6]);
    }
  }, [rack]);

  useEffect(() => {
    const unsubscribe = FirestoreDb.syncGameState(props.gameId, (doc) => {
      setGameData({ ...gameData, tilesRemaining: doc.data().tilesRemaining, currentPlayer: doc.data().currentPlayer });
      console.log(doc.data());
    });
    return unsubscribe;
  });

  // FirestoreDb.syncGameState(props.gameId);

  // useEffect(() => {
  //   // console.log("Tiles remaining", tilesRemaining);
  //   console.log("Updating game in database...");
  //   FirestoreDb.updateGame(props.gameId, gameData);
  // }, [gameData]);

  FirestoreDb.getGame(props.gameId).then((doc) => {
    // console.log(doc.data());
  });

  const getNewTiles = (currentRackIndices) => {
    const newTiles = drawFromBag(props.tileBag, gameData.tilesRemaining, currentRackIndices.length);
    const newTileCount = newTiles.length;
    const newRack = [...rack];
    currentRackIndices.map((i) => {
      newRack[i] = newTiles.pop();
    });
    setRack(newRack);
    setRackSelectedIndices(new Set());
    setGameData({ ...gameData, tilesRemaining: gameData.tilesRemaining - newTileCount });
  };

  const getTilesAndChangePlayer = (currentRackIndices) => {
    getNewTiles(currentRackIndices);
    setGameData({ ...gameData, currentPlayer: (gameData.currentPlayer % props.numOfPlayers) + 1 });
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
        <p>Current Player: {gameData.currentPlayer}</p>
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
        onClick={() => getTilesAndChangePlayer(Array.from(rackSelectedIndices))}
      >
        Update Letters
      </button>
    </div>
  );
};
