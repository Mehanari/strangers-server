//Placeholder for locations. This data should be stored either in a database or in a file.
const locations = {
    desert: [
        { type: 'goblin', level: 2, position: { x: 0, y: 0 } },
        { type: 'goblin', level: 1, position: { x: 1, y: 0 } },
        { type: 'goblin', level: 1, position: { x: 0, y: 1 } },
    ],
    forest: [
        { type: 'goblin', level: 1, position: { x: 1, y: 1 } },
        { type: 'wolf', level: 1, position: { x: 1, y: 0 } },
    ],
    cave: [
        { type: 'goblin', level: 1, position: { x: 1, y: 0 } },
        { type: 'goblin', level: 1, position: { x: 0, y: 1 } },
    ],
};

//Placeholder for rewards logic
const baseRewards = {
    cave: 1,
    forest: 2,
    desert: 3,
};

export function getEnemies(locationId){
    if (!locations[locationId]) {
        throw new Error(`Unknown location ID: ${locationId}`);
    }
    return locations[locationId];
}

export function getAllLocationIds() {
    return Object.keys(locations);
}

// Rewards depend on the player's progress.
// This is why we need playerId here.
export function getRewards(locationId, playerId){
    if (!locations[locationId]) {
        throw new Error(`Invalid location ID: ${locationId}`);
    }
    if (!playerId) {
        throw new Error('Player ID is required');
    }
    return { gold: baseRewards[locationId]}
}