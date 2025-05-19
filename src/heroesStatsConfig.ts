import {HeroStats} from "./types.ts";

const baseStats: Record<string, HeroStats> = {
    hunter: { hp: 8 },
    knight: { hp: 10 },
};

export function getStats(heroType: string, heroLevel: number): HeroStats {
    if (!baseStats[heroType]) {
        throw new Error(`Invalid hero type: ${heroType}`);
    }
    if (!Number.isInteger(heroLevel) || heroLevel < 1) {
        throw new Error(`Invalid hero level: ${heroLevel}`);
    }

    const { hp: baseHp } = baseStats[heroType];
    const multiplier = 1 + 0.2 * (heroLevel - 1); // Linear growth: base + base * 0.2 * (level - 1)
    return {
        hp: Math.round(baseHp * multiplier),
    };
}