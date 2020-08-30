import { ICharacterActions } from "./states/i-character-movement-actions";
import { CharacterState } from "./states/character-state";
import * as PIXI from 'pixi.js';
import { IdleState } from "./states/idle-state";

export class Character implements ICharacterActions {
    private _state: CharacterState = new IdleState()
    public texture: PIXI.Sprite;
    public coords: PIXI.Point;

    constructor(texture: PIXI.Sprite, coords: PIXI.Point) {
        this.texture = texture;
        this.coords = coords;
        this.texture.anchor.set(0.5); // set anchor to center
    }

    public move(direction: { [name: string]: boolean }): void {
        this._state = this._state.move();
        console.log(this._state);
        if (direction['a'] || direction['ArrowLeft']) {
            this.coords.x -= 2;
        }
        if (direction['d'] || direction['ArrowRight']) {
            this.coords.x += 2;
        }
        if (direction['s'] || direction['ArrowDown']) {
            this.coords.y += 2;
        }
        if (direction['w'] || direction['ArrowUp']) {
            this.coords.y -= 2;
        }
    }

    public idle(): void {
        this._state = this._state.idle()
        console.log(this._state)
    }
}