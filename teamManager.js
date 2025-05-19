import { uuid } from "uuidv4";

export function getTeam(playerId){
    if (!playerId) {
        throw new Error('Player ID is required');
    }
    // Placeholder for team. This data should be stored either in a database or in a file.
    return [
        { id: uuid(), type: 'hunter', level: 1 },
        { id: uuid(), type: 'knight', level: 1 },
        { id: uuid(), type: 'hunter', level: 1 },
    ];
}