import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import { NewGame } from "./components/NewGame";
import { Game } from "./components/Game";
import { Typography, Link } from "@material-ui/core";

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
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="">
          Carl Smith
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </footer>
  );
}

export default App;
