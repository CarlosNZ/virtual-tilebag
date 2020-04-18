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

  FirestoreDb.getGame(gameId).then((doc) => {
    console.log(doc.data());
  });

  FirestoreDb.refreshGame(gameId);

  const getNewTiles = (currentRackIndices) => {
    const newTiles = drawFromBag(tileBag, tilesRemaning, currentRackIndices.length);
    const newRack = [...rack];
    currentRackIndices.map((i) => {
      newRack[i] = newTiles[i];
    });
    setTilesRemaining(tilesRemaning - newTiles.length);
    setRack(newRack);
  };

  return <Rack rack={rack} />;
};

const Rack = (props) => {
  const rackSelectedIndices = new Set();

  const toggleLetterSelected = (letterIndex) => {
    if (rackSelectedIndices.has(letterIndex)) {
      rackSelectedIndices.delete(letterIndex);
    } else rackSelectedIndices.add(letterIndex);
    console.log(rackSelectedIndices);
  };

  const updateRack = () => {
    console.log("Clicked");
  };

  return (
    <div>
      <p id="rack">
        {props.rack.map((letter, index) => {
          console.log(rackSelectedIndices.has(index));
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
      {/* <div id="rack">{props.rack}</div> */}
      <button onClick={updateRack}>Update Letters</button>
    </div>
  );
};

const Letter = (props) => {};
