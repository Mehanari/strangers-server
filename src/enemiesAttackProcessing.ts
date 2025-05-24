import {Enemy, Hero} from "./types.ts";
import {Action, DamageEffect, Effect} from "./action.ts";

export function processEnemyAttack(enemy: Enemy, target: Hero): Action{
    const effects: Effect[] = [];
    effects.push(new DamageEffect(enemy.damage));
    const action = new Action("", enemy, convertToTypedArray(target), effects);
    if (enemy.type == "wolf"){
        action.type = "bite";
    }
    if (enemy.type == "goblin"){
        action.type = "stub";
    }

    return action;
}

function convertToTypedArray(target: Hero | Enemy): Hero[] | Enemy[] {
    if (isHero(target)) {
        return [target] as Hero[]; // TypeScript knows target is Hero here
    } else {
        return [target] as Enemy[]; // TypeScript knows target is Enemy here
    }
}

function isHero(character: Hero | Enemy): character is Hero {
    return 'applied_cards' in character;
}