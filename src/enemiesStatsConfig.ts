//This module answers the question "What are stats of the enemy with given type and level?"

import {EnemyStats} from "./types.ts";

const baseStats: Record<string, EnemyStats>  = {
    'goblin': { hp: 10, damage: 2 },
    'wolf': { hp: 8, damage: 3 },
};



export function getStats(enemyType: string, enemyLevel: number) : EnemyStats {
    if (!baseStats[enemyType]) {
        throw new Error(`Invalid enemy type: ${enemyType}`);
    }
    if (!Number.isInteger(enemyLevel) || enemyLevel < 1) {
        throw new Error(`Invalid enemy level: ${enemyLevel}`);
    }

    const { hp: baseHp, damage: baseDamage } = baseStats[enemyType];
    const multiplier = 1 + 0.2 * (enemyLevel - 1); // Linear growth: base + base * 0.2 * (level - 1)
    return {
        hp: Math.round(baseHp * multiplier),
        damage: Math.round(baseDamage * multiplier),
    };
}
