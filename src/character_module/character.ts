import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import {Context} from "./states/context";
import {State} from "./states/state";
import {Bullet} from "./bullet";

// register the plugin
gsap.registerPlugin(PixiPlugin);
// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);

export class Character extends Context {
    public texture: PIXI.Sprite;
    public bullets: { [name: string]: PIXI.Sprite};
    public coords: PIXI.Point;
    private direction!: { [name: string]: boolean };
    private prevDirection!: { [name: string]: boolean };

    constructor(textures: { [name: string]: PIXI.Sprite}, spawnCoords: PIXI.Point, state: State) {
        const { texture, enemyBullet, bullet } = textures;
        super(state);
        this.texture = texture;
        this.bullets = {enemyBullet: enemyBullet, bullet: bullet};
        this.coords = spawnCoords;
        this.texture.x = spawnCoords.x;
        this.texture.y = spawnCoords.y;
        this.texture.anchor.set(0.5); // set anchor to center
    }

    public move(direction: { [name: string]: boolean }): void {
        this.direction = {
            left:  direction['KeyA'] || direction['ArrowLeft'] || false,
            right: direction['KeyD'] || direction['ArrowRight'] || false,
            down: direction['KeyS'] || direction['ArrowDown'] || false,
            up: direction['KeyW'] || direction['ArrowUp'] || false
        };
        let { up, down, left, right } = this.direction;
        if(up && down) {
            up = false;
            down = false;
        }
        if(left && right) {
            left = false;
            right = false
        }
        // checking if the move is initial and direction wasn't change
        if ((this.prevDirection && JSON.stringify(this.direction) !== JSON.stringify(this.prevDirection)) || (!this.prevDirection && (JSON.stringify(this.direction) !== '{"left":false,"right":false,"down":false,"up":true}'))) {
            this.changeDirection(this.direction, this.prevDirection);
        }
        super.move(direction);
        if (left)this.coords.x -= 2;
        if (right)this.coords.x += 2;
        if (down)this.coords.y += 2;
        if (up)this.coords.y -= 2;
        this.texture.x = this.coords.x;
        this.texture.y = this.coords.y;
        this.prevDirection = this.direction;
    }

    public changeDirection(newDirection: { [name: string]: boolean }, prevDirection: { [name: string]: boolean } = {left: false, right: false, down: false, up: true}): void {
        super.changeDirection(prevDirection, newDirection);
        let angle = 0;
        if(newDirection.right) { angle = 90}
        if(newDirection.left) { angle =  270}
        if(newDirection.up) { angle = 0}
        if(newDirection.down) { angle = 180}
        if(newDirection.down && newDirection.right) { angle = 135}
        if(newDirection.down && newDirection.left) { angle = 225}
        if(newDirection.up && newDirection.left) { angle = 315}
        if(newDirection.up && newDirection.right) { angle = 45}
        gsap.to(this.texture, {
            pixi: {rotation: `${angle}_short`},
            duration: 0.3
        });
    }

    public shoot(): Bullet {
        return new Bullet(this.coords, this.bullets.bullet, this.texture.rotation - 90 * (Math.PI/180));
    }
}