import { getEnemyInfos} from "./locationsManager.ts";
import { getTeam} from "./teamManager.ts";
import { getRewards } from "./locationsManager.ts";
import { createEnemy } from "./enemyFactory.ts";
import { getDeck } from "./deckManager.ts";
import { createHero } from "./heroFactory.ts";
import {Enemy, Position, Raid} from "./types.ts";
import {getAction} from "./cardsProcessing.ts";
import {Action} from "./action.ts";
import {processStatusEffect} from "./statusEffectsProcessing.ts";
import {processEnemyAttack} from "./enemiesAttackProcessing.ts";
import {HandPicker, RandomHandPicker} from "./raidControllerComponents/cardsPickers.ts";
import {EnemyTargetPicker} from "./raidControllerComponents/enemyTargetPickers.ts";

export class RaidController{
    private activeRaids = new Map<string, Raid>;

    constructor(private cardsPicker: HandPicker, private enemyTargetPicker: EnemyTargetPicker) {}

    private getRaid(playerId: string): Raid{
        const raid = this.activeRaids.get(playerId);
        if (!raid){
            throw new Error(`Player ${playerId} is not in game`);
        }
        return raid;
    }

    // Creates and returns a new game instance for the player if it doesn't exist.
    // Returns an existing game instance if the player is already in game.
    startRaid(playerId: string, locationId: string): Raid{
        if (this.activeRaids.get(playerId)){
            return this.getRaid(playerId);
        }

        //Setting up enemies for the picked location
        const enemiesConfig = getEnemyInfos(locationId);
        const enemiesTeam =[];
        for (const conf of enemiesConfig){
            const enemy = createEnemy(conf.name, conf.level);
            const position = conf.position;
            enemiesTeam.push({enemy, position})
        }

        //Setting up heroes
        const teamConfig = getTeam(playerId);
        const team = [];
        for (const conf of teamConfig){
            const hero = createHero(conf.name, conf.level);
            team.push(hero);
        }

        const deck = getDeck(playerId);
        const availableCards = this.cardsPicker.pickHand(deck);

        const raidId = `${playerId}-${locationId}`;
        const raid = {
            raid_id: raidId,
            player_id: playerId,
            location_id: locationId,
            enemies_team: enemiesTeam,
            heroes_team: team,
            available_cards: availableCards,
            player_deck: deck
        };

        this.activeRaids.set(playerId, raid);
        return raid;
    }

    isInRaid(playerId: string){
        return !!this.getRaid(playerId);;
    }

    // Returns false if player is not in game, picked the non-existing card or hero
    canApplyCard(playerId: string, cardNumber: number, heroNumber: number){
        if(!this.isInRaid(playerId)){
            return false;
        }
        const raid = this.getRaid(playerId);
        const card = raid.available_cards[cardNumber];
        if (!card){
            return false;
        }
        const hero = raid.heroes_team[heroNumber];
        if (!hero){
            return false;
        }
        return true;
    }

    // Applies the card to the hero and returns the raid state.
    applyCard(playerId: string, cardNumber: number, heroNumber: number){
        const raid = this.getRaid(playerId);
        if (!raid){
            throw new Error(`Player ${playerId} is not in game`);
        }
        if(!this.canApplyCard(playerId, cardNumber, heroNumber)){
            throw new Error(`Player ${playerId} can't apply card ${cardNumber} to hero ${heroNumber}`);
        }
        const card = raid.available_cards[cardNumber];
        //Remove card from available cards
        raid.available_cards.splice(cardNumber, 1);
        //Add card to hero
        const hero = raid.heroes_team[heroNumber];
        hero.applied_cards.push(card);
        return raid;
    }

    canAttack(playerId: string){
        if(!this.isInRaid(playerId)){
            return false;
        }
    }

    pickTarget(playerId: string, heroNumber: number, targetPosition: Position){
        if (!this.isInRaid(playerId)) return;

        const raid = this.getRaid(playerId);
        if (raid.heroes_team.length <= heroNumber) return;

        const enemiesTeam = raid.enemies_team;
        let target: Enemy | null = null;
        //Pick an enemy with corresponding position or null
        for (const enemy of enemiesTeam){
            if (enemy.position.x == targetPosition.x && enemy.position.y == targetPosition.y){
                target = enemy.enemy;
                break;
            }
        }
        if (target){
            const hero = raid.heroes_team[heroNumber];
            hero.target_enemy = target;
        }
    }

    processAttack(playerId: string) :
        {
            heroesActions: Action[],
            enemiesActions: Action[],
            finalState: Raid,
            status: 'defeat' | 'win' | 'going'
        }{
        if (!this.isInRaid(playerId)){
            throw new Error(`Player ${playerId} is not in game`);
        }
        const heroesAttackResult = this.heroesAttack(playerId);
        const enemiesAttackResult = this.enemiesAttack(playerId);

        let enemiesAreDead = true;
        let heroesAreDead = true;
        //Check if all enemies are dead
        for (const enemy of enemiesAttackResult.raid.enemies_team){
            if (enemy.enemy.hp > 0){
                enemiesAreDead = false;
                break;
            }
        }
        //Check if all heroes are dead
        for (const hero of heroesAttackResult.raid.heroes_team){
            if (hero.hp > 0){
                heroesAreDead = false;
                break;
            }
        }

        //Checking end
        if (enemiesAreDead){
            return {
                heroesActions: heroesAttackResult.actions,
                enemiesActions: enemiesAttackResult.actions,
                finalState: enemiesAttackResult.raid,
                status: 'win'
            };
        }
        if (heroesAreDead){
            this.activeRaids.delete(playerId);
            return  {
                heroesActions: heroesAttackResult.actions,
                enemiesActions: enemiesAttackResult.actions,
                finalState: enemiesAttackResult.raid,
                status: 'defeat'
            };
        }

        //If no end, then pick fill the deck of available cards with new ones
        const raid = this.getRaid(playerId);
        raid.available_cards = this.cardsPicker.topUpHand(raid.available_cards, raid.player_deck);
        return  {
            heroesActions: heroesAttackResult.actions,
            enemiesActions: enemiesAttackResult.actions,
            finalState: raid,
            status: 'going'
        };
    }

    enemiesAttack(playerId: string) : {actions: Action[], raid: Raid}{
        if (!this.isInRaid(playerId)){
            throw new Error(`Player ${playerId} is not in game`);
        }
        const raid = this.getRaid(playerId);
        const enemiesTeam = raid.enemies_team;
        const aliveHeroes = raid.heroes_team.filter(hero => hero.hp > 0);
        const enemiesActions: Action[] = [];
        //Pick enemies with hp > 0
        const aliveEnemies = enemiesTeam.filter(enemy => enemy.enemy.hp > 0);
        for (const enemy of aliveEnemies){
            const target = this.enemyTargetPicker.pickTarget(enemy.enemy, aliveHeroes);
            if (!target){
                console.log("Could not find a target for an enemy. Something went wrong.");
                continue;
            }
            const action = processEnemyAttack(enemy.enemy, target);
            action.apply();
            enemiesActions.push(action);
        }
        return {actions: enemiesActions, raid: raid};
    }

    heroesAttack(playerId: string) : {actions: Action[], raid: Raid} {
        if (!this.isInRaid(playerId)){
            throw new Error(`Player ${playerId} is not in game`);
        }
        const raid = this.getRaid(playerId);
        const heroesTeam = raid.heroes_team;
        const appliedActions: Action[] = [];
        //Filter heroes by hp > 0
        const aliveHeroes = heroesTeam.filter(hero => hero.hp > 0);

        //For each hero check if their target is undefined or dead (hp < 0)
        //If yes, pick an arbitrary target with hp > 0
        for (const hero of aliveHeroes){
            if (!hero.target_enemy || hero.target_enemy.hp <= 0){
                for (const enemy of raid.enemies_team){
                    if (enemy.enemy.hp > 0){
                        hero.target_enemy = enemy.enemy;
                        break;
                    }
                }
            }
        }

        //Processing actions of each hero, based on applied cards
        for (const hero of aliveHeroes){

            while (hero.applied_cards.length > 0){
                const card = hero.applied_cards[0];
                //If card is undefined (for whatever reason), skip it
                if (!card){
                    continue;
                }
                //Remove the card from heroes applied cards
                hero.applied_cards.shift();
                const action = getAction(card, hero);
                appliedActions.push(action);
                action.apply();
            }
        }

        //Process the status effects on enemies and reduce their durations by 1.
        for (const enemy of raid.enemies_team){
            for (const effect of enemy.enemy.status_effects){
                const action = processStatusEffect(enemy.enemy, effect);
                appliedActions.push(action);
                action.apply();
            }
        }
        //For each enemy, remove status effects that expired
        for (const enemy of raid.enemies_team){
            enemy.enemy.status_effects = enemy.enemy.status_effects.filter(effect => effect.duration > 0);
        }

        return {
            actions: appliedActions,
            raid: raid
        };
    }
}