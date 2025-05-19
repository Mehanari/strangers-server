export interface Position{
    x: number,
    y: number
}

export interface StatusEffect {
    type: string;
    duration: number;
}

export interface Enemy {
    type: string,
    level: number,
    hp: number,
    damage: number,
    status_effects: StatusEffect[]
}

export interface EnemyStats {
    hp: number,
    damage: number
}

export interface HeroStats{
    hp: number
}

export interface Card{
    id: string,
    name: string,
    type: 'modifier' | 'attack' | 'defence',
    level: number
}

export interface Hero {
    name: string,
    level: number,
    hp: number,
    applied_cards: Card[],
    status_effects: StatusEffect[],
    target_enemy: Enemy | null
}

export interface Raid{
    raid_id: string,
    player_id: string,
    location_id: string,
    enemies_team: {
        enemy: Enemy,
        position: Position
    }[],
    heroes_team: Hero[],
    available_cards: Card[]
}