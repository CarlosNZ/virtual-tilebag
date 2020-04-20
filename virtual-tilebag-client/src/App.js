import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
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
      <Footer />
    </section>
  );
}

function Home() {
  return <NewGame />;
}

function Footer() {
  return (
    <footer>
      <p>(c) 2020 Carl Smith</p>
    </footer>
  );
}

export default App;
