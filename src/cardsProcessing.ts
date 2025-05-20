//This module is dedicated to deciding what action should hero perform based on their cards
//Currently there is a lot of "if-else-yanderecode" stuff.

import {Card, Enemy, Hero} from "./types.ts";
import {Action, DamageEffect, Effect, FireEffect, ProtectionEffect} from "./action.ts";



export function getAction(card: Card, hero: Hero): Action{
    //TODO: Make it so each card can provide a processor on its own
    if (card.name == 'arrow_shot'){
        return processArrowShot(hero, card.level);
    }
    if (card.name == 'shield_up'){
        return processShieldUp(hero, card.level);
    }
    if (card.name == 'ignite'){
        return processIgnite(hero, card.level);
    }

    //If no processors found for the card, return a none action
    return new Action (
         "none",
        hero,
        [],
        []
    );
}

function processIgnite(hero: Hero, cardLevel: number): Action{
    const targets: Enemy[] = [];
    if (hero.target_enemy){
        targets.push(hero.target_enemy);
    }
    const effects: Effect[] = [];
    //TODO: once again, I need a handy way to configure the stats of the card effects.
    effects.push(new FireEffect(1 + cardLevel - 1));
    return new Action (
        "ember_throw",
        hero,
        targets,
        effects
    );
}

function processShieldUp(hero: Hero, cardLevel: number): Action {
    const targets: Hero[] = [];
    targets.push(hero);
    const effects: Effect[] = [];
    //TODO: once again, I need a handy way to configure the stats of the card effects.
    effects.push(new ProtectionEffect(1+cardLevel-1));
    return new Action(
        "shield_up",
        hero,
        targets,
        effects
    );
}

function processArrowShot(hero: Hero, cardLevel: number): Action{
    const targets: Enemy[] = [];
    const effects: Effect[] = [];
    //TODO: Need a way to configure the damage dealt by an arrow shot
    effects.push(new DamageEffect(2 + cardLevel));
    //If target is not null, add it to targets list
    if (hero.target_enemy){
        targets.push(hero.target_enemy);
    }
    //Check if the next card has a 'modifier' type
    let nextCard: Card | undefined = hero.applied_cards[0];
    while (nextCard && nextCard.type == "modifier"){
        //TODO: Figure out how to auto-extend this method when new modifier cards appear.
        if (nextCard.name == "ignite"){
            effects.push(new FireEffect(3 + nextCard.level)); //TODO: Need a way to configure the duration of fire effect
            hero.applied_cards.pop();
        }
        nextCard = hero.applied_cards[0];
    }
    return new Action (
        "arrow_shot",
        hero,
        targets,
        effects
    );
}