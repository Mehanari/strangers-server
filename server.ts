import {applyCard, startRaid} from "./src/raidController.ts";

let raid = startRaid("player1", "desert");
raid = applyCard("player1", 0, 0);
console.log(raid);