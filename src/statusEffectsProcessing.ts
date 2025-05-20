import {Enemy, Hero, StatusEffect} from "./types.ts";
import {Action, DamageEffect, Effect} from "./action.ts";
import e from "express";

//If the effect does something, returns corresponding action.
//Returns none action if effect does not modify the state of the target (except for effect duration).
//Does not remove the effect from the target if it expires.
export function processStatusEffect(target: Enemy | Hero, effect: StatusEffect) : Action{
    if (effect.duration > 0){
        effect.duration--;
        if (effect.type == 'fire'){
            return processFire(target);
        }
    }

    //Some effect may do nothing when processed
    return new Action (
        "none",
        target,
        [],
        []
    );
}

function processFire(target: Enemy | Hero) : Action{
    const source = target;
    const targets = convertToTypedArray(target);
    const effects: Effect[] = [];
    //TODO: Make it possible to configure how much damage fire does
    effects.push(new DamageEffect(1));
    return new Action("burning", source, targets, effects);
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