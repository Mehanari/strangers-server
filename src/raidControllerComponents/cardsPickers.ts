//Here is a bunch of classes that you can use to define how the cards for players are picked for the next move

import {Card} from "../types.ts";

export abstract class HandPicker {
    abstract pickHand(deck: Card[]): Card[];
    //Takes the player's available cards (hand) and their deck and adds new cards to the hand if necessary
    abstract topUpHand(hand: Card[], deck: Card[]) : Card[];
}

export class BakedHandPicker extends HandPicker{
    constructor(public cards: Card[]) {
        super();
    }

    pickHand(deck: Card[]): Card[] {
        return [...this.cards];
    }

    topUpHand(hand: Card[], deck: Card[]): Card[] {
        return [...this.cards];
    }
}

export class RandomHandPicker extends HandPicker{
    constructor(private cardsNumber: number) {
        super();
    }

    pickHand(deck: Card[]): Card[] {
        const cards: Card[] = [];
        for (let i = 0; i < this.cardsNumber; i++) {
            const randomIndex = Math.floor(Math.random() * deck.length);
            cards.push(deck[randomIndex]);
        }
        return cards;
    }

    topUpHand(hand: Card[], deck: Card[]): Card[] {
        const lack = this.cardsNumber - hand.length;//How many card to add to the hand
        if (lack > 0){
            for (let i = 0; i <lack; i++){
                const randomIndex = Math.floor(Math.random() * deck.length);
                hand.push(deck[randomIndex]);
            }
            return hand;
        }
        return hand;
    }
}