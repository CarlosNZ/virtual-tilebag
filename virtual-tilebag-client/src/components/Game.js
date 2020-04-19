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
  const [rack, setRack] = useState(["A", "B", "C"]);
  const [tilesSelected, setTilesSelected] = useState([]);
  const [rackSelectedIndices, setRackSelectedIndices] = useState(new Set());

  FirestoreDb.getGame(gameId).then((doc) => {
    console.log(doc.data());
  });

  FirestoreDb.refreshGame(gameId);

  const getNewTiles = (currentRackIndices) => {
    const newTiles = drawFromBag(tileBag, tilesRemaning, currentRackIndices.length);
    console.log("New Tiles", newTiles);
    const newRack = [...rack];
    console.log("New Rack", newRack);
    console.log("Selected Indices", currentRackIndices);
    currentRackIndices.map((i) => {
      newRack[i] = newTiles.pop();
    });
    console.log("CHanged Rack", newRack);
    setTilesRemaining(tilesRemaning - newTiles.length);
    setRack(newRack);
    setRackSelectedIndices(new Set());
  };

  const toggleLetterSelected = (letterIndex) => {
    const tempSet = new Set(rackSelectedIndices);
    if (tempSet.has(letterIndex)) {
      tempSet.delete(letterIndex);
    } else tempSet.add(letterIndex);
    setRackSelectedIndices(tempSet);
    console.log(rackSelectedIndices);
  };

  const updateRack = () => {
    console.log("Clicked");
  };

  return (
    <div>
      <p id="rack">
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
      </p>
      <button onClick={() => getNewTiles(Array.from(rackSelectedIndices))}>Update Letters</button>
    </div>
  );
};
