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

  FirestoreDb.getGame(gameId).then((doc) => {
    console.log(doc.data());
    setGameLoaded(true);
    tilesRemaining = doc.data().tilesRemaining;
    numOfPlayers = doc.data().players.length;
    currentPlayer = doc.data().currentPlayer;
    // alert("Loaded!");
    console.log(tilesRemaining, numOfPlayers, currentPlayer);
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
  const [tilesRemaning, setTilesRemaining] = useState(100);
  const [rack, setRack] = useState(["A", "B", "C", "D", "E", "F", "G"]);
  const [rackSelectedIndices, setRackSelectedIndices] = useState(new Set());

  // useEffect(() => {
  //   // alert("This only happens once!");
  //   FirestoreDb.getGame(props.gameId).then((doc) => {
  //     console.log(doc.data());
  //   });
  // }, []);

  FirestoreDb.syncGameState(props.gameId);

  useEffect(() => {
    // console.log("Tiles remaining", tilesRemaning);
    FirestoreDb.updateGame(props.gameId, tilesRemaning, currentPlayer);
  }, [tilesRemaning, currentPlayer]);

  FirestoreDb.getGame(props.gameId).then((doc) => {
    // console.log(doc.data());
  });

  const getNewTiles = (currentRackIndices) => {
    const newTiles = drawFromBag(props.tileBag, tilesRemaning, currentRackIndices.length);
    const newTileCount = newTiles.length;
    const newRack = [...rack];
    currentRackIndices.map((i) => {
      newRack[i] = newTiles.pop();
    });
    setTilesRemaining(tilesRemaning - newTileCount);
    setRack(newRack);
    setRackSelectedIndices(new Set());
    setCurrentPlayer((currentPlayer % props.numOfPlayers) + 1);
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
        <p>Current Player: {currentPlayer}</p>
        <p>Tiles remaining: {tilesRemaning}</p>
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
      <button disabled={currentPlayer != props.thisPlayer} onClick={() => getNewTiles(Array.from(rackSelectedIndices))}>
        Update Letters
      </button>
    </div>
  );
};
