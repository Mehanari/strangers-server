import {applyCard, startRaid} from "./raidController.js";

let raid = startRaid("player1", "desert");
raid = applyCard("player1", 0, 0);
console.log(raid);