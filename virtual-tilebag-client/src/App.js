import React from "react";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import { NewGame } from "./components/NewGame";
import { Game } from "./components/Game";

function App() {
  return (
    <section className="App">
      <Router>
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

export default App;
