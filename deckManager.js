//The purpose of this module is to answer the question: "What cards are in the deck of a player?"
//The deck is supposed to be a set of cards that player can use during the game.
import {uuid} from "uuidv4";

export function getDeck(playerId) {
    if (!playerId) {
        throw new Error('Player ID is required');
    }
    // Return placeholder deck for all players
    return [
        { id: uuid(), type: 'arrow_shot', level: 1 },
        { id: uuid(), type: 'arrow_shot', level: 1 },
        { id: uuid(), type: 'shield_up', level: 1 },
        { id: uuid(), type: 'shield_up', level: 1 },
        { id: uuid(), type: 'ignite', level: 1 },
        { id: uuid(), type: 'ignite', level: 1 },
        { id: uuid(), type: 'arrow_shot', level: 1 },
        { id: uuid(), type: 'shield_up', level: 1 },
    ];
}
