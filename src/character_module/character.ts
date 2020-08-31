import {ICharacterActions} from "./states/i-character-movement-actions";
import {CharacterState} from "./states/character-state";
import * as PIXI from 'pixi.js';
import {IdleState} from "./states/idle-state";
import gsap from "gsap";
import {TweenMax} from "gsap/all";

export class Character implements ICharacterActions {
    private _state: CharacterState = new IdleState();
    public texture: PIXI.Sprite;
    public coords: PIXI.Point;
    private vector: number = 0;

    constructor(texture: PIXI.Sprite, spawnCoords: PIXI.Point) {
        this.texture = texture;
        this.coords = spawnCoords;
        this.texture.x = spawnCoords.x;
        this.texture.y = spawnCoords.y;
        this.texture.anchor.set(0.5); // set anchor to center
    }

    public move(direction: { [name: string]: boolean }): void {
        this._state = this._state.move();
        // console.log(Math.atan2(p2.y - p1.y, p2.x - p1.x));
        // const a = -90 * Math.PI / 180;
        if (direction['KeyA'] || direction['ArrowLeft']) {
            TweenMax.to(this.texture, 0.8, {rotation: (this.texture.angle < 90 || this.texture.angle  > 180) ? (270 * Math.PI / 180) : (-90 * Math.PI / 180)});
            this.coords.x -= 2;

        }
        if (direction['KeyD'] || direction['ArrowRight']) {
            TweenMax.to(this.texture, 0.8, {rotation: 90 * Math.PI / 180});
            this.coords.x += 2;
        }
        if (direction['KeyS'] || direction['ArrowDown']) {
            TweenMax.to(this.texture, 0.8, {rotation: 180 * Math.PI / 180});
            this.coords.y += 2;

        }
        if (direction['KeyW'] || direction['ArrowUp']) {
            TweenMax.to(this.texture, 0.8, {rotation: (this.texture.angle > 180) ? (360 * Math.PI / 180) : 0});
            this.coords.y -= 2;
        }
        this.texture.x = this.coords.x;
        this.texture.y = this.coords.y;
    }

    public idle(): void {
        this._state = this._state.idle()
        // console.log(this._state);

        console.log(this.texture.angle)

    }
}