import { getStats } from './enemiesStatsConfig.ts';
import {StatusEffect, Enemy} from "./types.ts";



export function createEnemy(enemyType: string, enemyLevel: number): Enemy {
    const stats = getStats(enemyType, enemyLevel);
    return {
        type: enemyType,
        level: enemyLevel,
        hp: stats.hp,
        damage: stats.damage,
        status_effects: [], // Array of { type, duration } objects, empty for now
    };
}