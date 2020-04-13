import React, { Component } from "react";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import { shuffleBag, drawFromBag } from "./tilebag";
import { NewGame } from "./NewGame";

const App = () => {
  return (
    <section className="App">
      <Router>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users">Users</Link>
        <Route exact path="/" component={Home} />
        <Route exact path="/new-game" component={NewGame} />
        {/* <Route exact path="/game/id:gameID/p:player" component={Game} /> */}
      </Router>
    </section>
  );
};

const Home = () => {
  const bag = shuffleBag(1234);

  return (
    <div>
      <h3>Home Page</h3>
      <p>{drawFromBag(bag, 100, 7)}</p>
    </div>
  );
};

export default App;
