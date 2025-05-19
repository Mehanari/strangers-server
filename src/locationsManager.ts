//Placeholder for locations. This data should be stored either in a database or in a file.
import {Position} from './types.ts';

const locations: Record<string, EnemyInfo[]> = {
    desert: [
        { name: 'goblin', level: 2, position: {x:0, y:0} },
        { name: 'goblin', level: 1, position: { x: 1, y: 0 } },
        { name: 'goblin', level: 1, position: { x: 0, y: 1 } },
    ],
    forest: [
        { name: 'goblin', level: 1, position: { x: 1, y: 1 } },
        { name: 'wolf', level: 1, position: { x: 1, y: 0 } },
    ],
    cave: [
        { name: 'goblin', level: 1, position: { x: 1, y: 0 } },
        { name: 'goblin', level: 1, position: { x: 0, y: 1 } },
    ],
};

interface EnemyInfo{
    name: string,
    level: number,
    position: Position
}

interface Reward{
    gold: number
}

//Placeholder for rewards logic
const baseRewards : Record<string, number> = {
    cave: 1,
    forest: 2,
    desert: 3,
};

export function getEnemyInfos(locationId: string): EnemyInfo[]{
    if (!locations[locationId]) {
        throw new Error(`Unknown location ID: ${locationId}`);
    }
    return locations[locationId];
}

export function getAllLocationIds(): string[] {
    return Object.keys(locations);
}

// Rewards depend on the player's progress.
// This is why we need playerId here.
export function getRewards(locationId: string, playerId: string) : Reward{
    if (!locations[locationId]) {
        throw new Error(`Invalid location ID: ${locationId}`);
    }
    if (!playerId) {
        throw new Error('Player ID is required');
    }
    return { gold: baseRewards[locationId]}
}