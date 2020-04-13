// import { shuffle } from "knuth-shuffle-seeded"
const shuffle = require("knuth-shuffle-seeded");

const scrabbleEnglish = ["A", "A", "A", "A", "A", "A", "A", "A", "A", "B", "B", "C", "C", "D", "D", "D", "D", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "F", "F", "G", "G", "G", "H", "H", "I", "I", "I", "I", "I", "I", "I", "I", "I", "J", "K", "L", "L", "L", "L", "M", "M", "N", "N", "N", "N", "N", "N", "O", "O", "O", "O", "O", "O", "O", "O", "P", "P", "Q", "R", "R", "R", "R", "R", "R", "S", "S", "S", "S", "T", "T", "T", "T", "T", "T", "U", "U", "U", "U", "V", "V", "W", "W", "X", "Y", "Y", "Z", "<BLANK>", "<BLANK>"];

export const shuffleBag = function (seed) {
    return shuffle(Array.from(scrabbleEnglish), seed);
}

export const drawFromBag = function (tileBag, tilesRemaning, tilesRequested) {
    const startPos = tileBag.length - tilesRemaning;
    const endPos = startPos + tilesRequested;
    return tileBag.slice(startPos, endPos);
}