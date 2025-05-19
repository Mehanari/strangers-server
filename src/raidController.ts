import { getEnemyInfos} from "./locationsManager.ts";
import { getTeam} from "./teamManager.ts";
import { getRewards } from "./locationsManager.ts";
import { createEnemy } from "./enemyFactory.ts";
import { getDeck } from "./deckManager.ts";
import { createHero } from "./heroFactory.ts";
import {Raid} from "./types.ts";

const activeRaids : Record<string, Raid> = {};
const AVAILABLE_CARDS_COUNT = 5;

// Creates and returns a new game instance for the player if it doesn't exist.
// Returns an existing game instance if the player is already in game.
export function startRaid(playerId: string, locationId: string): Raid{
    if (activeRaids[playerId]){
        return activeRaids[playerId];
    }

    const enemiesConfig = getEnemyInfos(locationId);
    const enemies_team =[];
    for (const conf of enemiesConfig){
        const enemy = createEnemy(conf.name, conf.level);
        const position = conf.position;
        enemies_team.push({enemy, position})
    }
    const teamConfig = getTeam(playerId);
    const team = [];
    for (const conf of teamConfig){
        const hero = createHero(conf.name, conf.level);
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
        raid_id: raidId,
        player_id: playerId,
        location_id: locationId,
        enemies_team: enemies_team,
        heroes_team: team,
        available_cards: availableCards
    }

    activeRaids[playerId] = raid;
    return raid;
}

export function isInRaid(playerId: string){
    return !!activeRaids[playerId];
}

// Returns false if player is not in game, picked the non-existing card or hero
export function canApplyCard(playerId: string, cardNumber: number, heroNumber: number){
    if(!isInRaid(playerId)){
        return false;
    }
    const raid = activeRaids[playerId];
    const card = raid.available_cards[cardNumber];
    if (!card){
        return false;
    }
    const hero = raid.heroes_team[heroNumber];
    if (!hero){
        return false;
    }
    return true;
}

// Applies the card to the hero and returns the raid state.
export function applyCard(playerId: string, cardNumber: number, heroNumber: number){
    const raid = activeRaids[playerId];
    if (!raid){
        throw new Error(`Player ${playerId} is not in game`);
    }
    if(!canApplyCard(playerId, cardNumber, heroNumber)){
        throw new Error(`Player ${playerId} can't apply card ${cardNumber} to hero ${heroNumber}`);
    }
    const card = raid.available_cards[cardNumber];
    //Remove card from available cards
    raid.available_cards.splice(cardNumber, 1);
    //Add card to hero
    const hero = raid.heroes_team[heroNumber];
    hero.applied_cards.push(card);
    return raid;
}