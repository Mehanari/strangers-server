import { getStats } from './enemiesStatsConfig.js';

export function createEnemy(enemyType, enemyLevel) {
    const stats = getStats(enemyType, enemyLevel);
    return {
        type: enemyType,
        level: enemyLevel,
        hp: stats.hp,
        damage: stats.damage,
        statusEffects: [], // Array of { type, duration } objects, empty for now
    };
}