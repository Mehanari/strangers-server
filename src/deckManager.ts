//The purpose of this module is to answer the question: "What cards are in the deck of a player?"
//The deck is supposed to be a set of cards that player can use during the game.
import {uuid} from "uuidv4";
import {Card} from "./types.ts";



export function getDeck(playerId: string): Card[] {
    if (!playerId) {
        throw new Error('Player ID is required');
    }
    // Return placeholder deck for all players
    return [
        { id: uuid(), name: 'arrow_shot', type: 'attack', level: 1 },
        { id: uuid(), name: 'arrow_shot', type: 'attack', level: 1 },
        { id: uuid(), name: 'shield_up', type: 'defence', level: 1 },
        { id: uuid(), name: 'shield_up', type: 'defence', level: 1 },
        { id: uuid(), name: 'ignite', type: 'modifier', level: 1 },
        { id: uuid(), name: 'ignite', type: 'modifier', level: 1 },
        { id: uuid(), name: 'arrow_shot', type: 'attack', level: 1 },
        { id: uuid(), name: 'shield_up', type: 'modifier', level: 1 },
    ];
}
