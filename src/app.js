const tilebag = require('./tilebag');

const express = require("express");
const app = express(); app.listen(3001, () => {
    console.log("Server running on port 3001");
});

app.get("/id:seed", (req, res, next) => {
    const seed = parseInt(req.params.seed);
    console.log(typeof (seed))
    const tilesRemaining = req.query.rem;
    const tilesRequested = req.query.tiles;
    console.log(seed, tilesRemaining, tilesRequested);

    const bag = tilebag.shuffleBag(seed);
    res.json(tilebag.drawFromBag(bag, tilesRemaining, tilesRequested));
})