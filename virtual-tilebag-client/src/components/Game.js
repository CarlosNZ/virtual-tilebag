import React, { useState } from "react";
import * as FirestoreDb from "../services/firebase";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import { shuffleBag, drawFromBag } from "../services/tilebag";

export const Game = (props) => {
  // Game constants
  const gameId = props.match.params.gameID;
  const thisPlayer = props.match.params.player;
  const tileBag = shuffleBag(gameId);

  // State values
  const [currentPlayer, setCurrentPlayer] = useState();
  const [tilesRemaning, setTilesRemaining] = useState(100);
  const [rack, setRack] = useState([]);
  const [tilesSelected, setTilesSelected] = useState([]);

  FirestoreDb.getGame(gameId).then((doc) => {
    console.log(doc.data());
  });

  FirestoreDb.refreshGame(gameId);

  const getNewTiles = (currentRackIndices) => {
    const newTiles = drawFromBag(tileBag, tilesRemaning, currentRackIndices.length);
    const currentRack = [...rack];
    currentRackIndices.map((i) => {
      currentRack[i] = newTiles[i];
    });
    setTilesRemaining(tilesRemaning - newTiles.length);
  };

  return <p>Nothing to see here yet</p>;
};
