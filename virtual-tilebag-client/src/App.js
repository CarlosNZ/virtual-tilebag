import React, { Component } from "react";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

const users = [{ name: `Param` }, { name: `Vennila` }, { name: `Afrin` }];

const App = () => {
  return (
    <section className="App">
      <Router>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users">Users</Link>
        <Route exact path="/" component={Home} />
        <Route exact path="/new-game" component={NewGame} />
        <Route exact path="/game/id:gameID/p:player" component={Game} />
      </Router>
    </section>
  );
};

const IndexPage = () => {
  return <h3>Home Page</h3>;
};

export default App;
