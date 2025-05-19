import { getStats } from './heroesStatsConfig.ts';
import {Card, Enemy, Hero, StatusEffect} from "./types.ts";



export function createHero(heroType : string, heroLevel : number  = 1) : Hero {
    const stats = getStats(heroType, heroLevel);
    return {
        name: heroType,
        level: heroLevel,
        hp: stats.hp,
        applied_cards: [],
        status_effects: [],
        target_enemy: null
    };
}
