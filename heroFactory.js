import { getStats } from './heroesStatsConfig.js';

export function createHero(heroType, heroLevel = 1) {
    const stats = getStats(heroType, heroLevel);
    return {
        type: heroType,
        level: heroLevel,
        hp: stats.hp,
        appliedCards: [],
        statusEffects: [],
        target_enemy: {}
    };
}
