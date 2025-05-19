import { uuid } from "uuidv4";

interface TeamMember {
    name: string,
    level: number
}

export function getTeam(playerId: string) : TeamMember[]{
    if (!playerId) {
        throw new Error('Player ID is required');
    }
    // Placeholder for team. This data should be stored either in a database or in a file.
    return [
        {  name: 'hunter', level: 1 },
        {  name: 'knight', level: 1 },
        {  name: 'hunter', level: 1 },
    ];
}