import {BakedHandPicker} from "../src/raidControllerComponents/cardsPickers";
import {uuid} from "uuidv4";
import {HealthiestPicker} from "../src/raidControllerComponents/enemyTargetPickers";
import {RaidController} from "../src/raidController";


const cardsPicker = new BakedHandPicker([
    { id: uuid(), name: 'arrow_shot', type: 'attack', level: 1 },
    { id: uuid(), name: 'ignite', type: 'modifier', level: 1 },
    { id: uuid(), name: 'arrow_shot', type: 'attack', level: 1 },
    { id: uuid(), name: 'ignite', type: 'modifier', level: 1 },
    { id: uuid(), name: 'arrow_shot', type: 'attack', level: 1 },
    { id: uuid(), name: 'ignite', type: 'modifier', level: 1 },
])
const enemyTargetPicker = new HealthiestPicker();
const raidController = new RaidController(cardsPicker, enemyTargetPicker);
let raid = raidController.startRaid("testPlayer", "desert");
//Attacking the strongest goblin
raidController.pickTarget("testPlayer", 0, {x:0, y:0});
raidController.pickTarget("testPlayer", 1, {x:0, y:0});
raidController.pickTarget("testPlayer", 2, {x:0, y:0});
raidController.applyCard("testPlayer", 0, 0);
raidController.applyCard("testPlayer", 0, 0);
raidController.applyCard("testPlayer", 0, 1);
raidController.applyCard("testPlayer", 0, 1);
raidController.applyCard("testPlayer", 0, 2);
raidController.applyCard("testPlayer", 0, 2);
let result = raidController.processAttack("testPlayer");
//Attacking the goblin on (1, 0)
raidController.pickTarget("testPlayer", 0, {x:1, y:0});
raidController.pickTarget("testPlayer", 1, {x:1, y:0});
raidController.pickTarget("testPlayer", 2, {x:1, y:0});
raidController.applyCard("testPlayer", 0, 0);
raidController.applyCard("testPlayer", 0, 0);
raidController.applyCard("testPlayer", 0, 1);
raidController.applyCard("testPlayer", 0, 1);
raidController.applyCard("testPlayer", 0, 2);
raidController.applyCard("testPlayer", 0, 2);
result = raidController.processAttack("testPlayer");
//Attacking the goblin on (0, 1)
raidController.pickTarget("testPlayer", 0, {x:0, y:1});
raidController.pickTarget("testPlayer", 1, {x:0, y:1});
raidController.pickTarget("testPlayer", 2, {x:0, y:1});
raidController.applyCard("testPlayer", 0, 0);
raidController.applyCard("testPlayer", 0, 0);
raidController.applyCard("testPlayer", 0, 1);
raidController.applyCard("testPlayer", 0, 1);
raidController.applyCard("testPlayer", 0, 2);
raidController.applyCard("testPlayer", 0, 2);
result = raidController.processAttack("testPlayer");
console.log(raid);