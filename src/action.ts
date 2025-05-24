import {Enemy, Hero} from "./types.ts";

//Action is a description of the change in the Raid state caused by either Hero or an Enemy.
//Action can deal damage, heal or apply buffs/debuffs (status effects) to a list of targets.
//Actions can be grouped by types. This is needed mostly to know how to depict an action (show harm animation or heal animation or whatever)
export class Action {
    constructor(public type: string, public source: Hero | Enemy, public targets: Hero[] | Enemy[], public effects: Effect[]) {
    }

    apply() {
        for (const target of this.targets){
            for (const effect of this.effects){
                effect.apply(target);
            }
        }
    }
}

export abstract class Effect {
    abstract apply(entity: Hero | Enemy): void;
}

export class DamageEffect extends Effect{
    constructor(private damage: number) {
        super();
    }
    apply(entity: Hero | Enemy): void {
        if (entity.hp > 0){
            entity.hp -= this.damage;
        }
    }
}

export class FireEffect extends Effect{
    constructor(private duration: number) {
        super();
    }
    apply(entity: Hero | Enemy): void {
        entity.status_effects.push({type: "fire", duration: this.duration})
    }
}

export class ProtectionEffect extends Effect{
    constructor(private duration: number) {
        super();
    }
    apply(entity: Hero | Enemy): void {
        entity.status_effects.push({type: "protection", duration: this.duration})
    }
}