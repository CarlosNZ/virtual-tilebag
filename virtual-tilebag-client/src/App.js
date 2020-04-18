import React, { Component } from "react";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import { shuffleBag, drawFromBag } from "./services/tilebag";
import { NewGame } from "./components/NewGame";
import { Game } from "./components/Game";
import * as FirestoreDb from "./services/firebase";

function App() {
  return (
    <section className="App">
      <Router>
        {/* <TEMP /> */}
        <Route exact path="/" component={Home} />
        <Route exact path="/new-game" component={NewGame} />
        <Route exact path="/game/id-:gameID/p:player" component={Game} />
      </Router>
    </section>
  );
}

function Home() {
  return <NewGame />;
}

const TEMP = () => {
  const bag = shuffleBag(1234);
  const letters = drawFromBag(bag, 100, 7);

  return (
    <div>
      {letters.map((letter) => {
        return <p>letter</p>;
      })}
      <h3>Home Page</h3>
      <p>{letters}</p>
    </div>
  );
};

export default App;
