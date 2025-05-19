import { getEnemies} from "./locationsManager.js";
import { getTeam} from "./teamManager.js";
import { getRewards } from "./locationsManager.js";
import { createEnemy } from "./enemyFactory.js";
import { getDeck } from "./deckManager.js";
import { createHero } from "./heroFactory.js";

const activeRaids = {};
const AVAILABLE_CARDS_COUNT = 5;

// Creates and returns a new game instance for the player if it doesn't exist.
// Returns an existing game instance if the player is already in game.
export function startRaid(playerId, locationId){
    if (activeRaids[playerId]){
        return activeRaids[playerId];
    }

    const enemiesConfig = getEnemies(locationId);
    const enemies = [];
    for (const conf of enemiesConfig){
        const enemy = createEnemy(conf.type, conf.level);
        const position = conf.position;
        enemies.push({enemy, position})
    }
    const teamConfig = getTeam(playerId);
    const team = [];
    for (const conf of teamConfig){
        const hero = createHero(conf.type, conf.level);
        team.push(hero);
    }

    const deck = getDeck(playerId);
    const availableCards = [];
    //Pick 5 random cards from deck
    for (let i = 0; i < AVAILABLE_CARDS_COUNT; i++){
        const randomIndex = Math.floor(Math.random() * deck.length);
        const card = deck[randomIndex];
        availableCards.push(card);
    }

    const raidId = `${playerId}-${locationId}`;
    const raid = {
        id: raidId,
        playerId: playerId,
        locationId: locationId,
        enemies: enemies,
        team: team,
        availableCards: availableCards
    }

    activeRaids[playerId] = raid;
    return raid;
}

export function isInRaid(playerId){
    return !!activeRaids[playerId];
}

// Returns false if player is not in game, picked the non-existing card or hero
export function canApplyCard(playerId, cardNumber, heroNumber){
    if(!isInRaid(playerId)){
        return false;
    }
    const raid = activeRaids[playerId];
    const card = raid.availableCards[cardNumber];
    if (!card){
        return false;
    }
    const hero = raid.team[heroNumber];
    if (!hero){
        return false;
    }
    return true;
}

// Applies the card to the hero and returns the raid state.
export function applyCard(playerId, cardNumber, heroNumber){
    const raid = activeRaids[playerId];
    if (!raid){
        throw new Error(`Player ${playerId} is not in game`);
    }
    if(!canApplyCard(playerId, cardNumber, heroNumber)){
        throw new Error(`Player ${playerId} can't apply card ${cardNumber} to hero ${heroNumber}`);
    }
    const card = raid.availableCards[cardNumber];
    //Remove card from available cards
    raid.availableCards.splice(cardNumber, 1);
    //Add card to hero
    const hero = raid.team[heroNumber];
    hero.appliedCards.push(card);
    return raid;
}