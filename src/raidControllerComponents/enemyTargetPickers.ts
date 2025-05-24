//Here is a bunch of classes that define how enemies pick their targets

import {Enemy, Hero} from "../types.ts";

export abstract class EnemyTargetPicker{
    //Returns undefined if heroes array is empty
    abstract pickTarget(enemy: Enemy, heroes: Hero[]): Hero | undefined;
}

export class HealthiestPicker extends EnemyTargetPicker{
    pickTarget(enemy: Enemy, heroes: Hero[]): Hero | undefined
    {
        if (heroes.length === 0) return undefined; // No heroes to target
        let maxHpHero = heroes[0];
        for (const hero of heroes) {
            if (maxHpHero.hp < hero.hp) {
                maxHpHero = hero;
            }
        }
        return maxHpHero;
    }
}

export class RandomPicker extends EnemyTargetPicker{
    pickTarget(enemy: Enemy, heroes: Hero[]): Hero | undefined {
        if (heroes.length === 0) return undefined; // No heroes to target
        const randomIndex = Math.floor(Math.random() * heroes.length);
        return heroes[randomIndex];
    }
}