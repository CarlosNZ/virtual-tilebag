const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//     response.send("Hello from Firebase!");
// });

const tilebag = require('./tilebag');

const express = require("express");
const app = express();

app.get("/draw-tiles", (req, res, next) => {
    const seed = parseInt(req.query.id);
    const tilesRemaining = req.query.rem;
    const tilesRequested = req.query.tiles;

    console.log(seed, tilesRemaining, tilesRequested);

    const bag = tilebag.shuffleBag(seed);
    res.json(tilebag.drawFromBag(bag, tilesRemaining, tilesRequested));
})

app.get("/", (req, res, next) => {
    res.send("This is working")
})

exports.app = functions.https.onRequest(app);