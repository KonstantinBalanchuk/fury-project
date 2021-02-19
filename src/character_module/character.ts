import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import {Context} from "./states/context";
import {State} from "./states/state";
import {Bullet} from "./bullet";
import {ICollision} from "../collider_module/ICollision";

// register the plugin
gsap.registerPlugin(PixiPlugin);
// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);

type DirectionType = {
    [name: string]: boolean
}

type LocationType = {
    x: number,
    y: number
}

export class Character extends Context {
    public texture: PIXI.Sprite;
    public bullets: { [name: string]: PIXI.Sprite};
    public coords: PIXI.Point;
    public predictedVx: number;
    public predictedVy: number;
    public speed: number;
    private direction!: DirectionType;
    private prevDirection!: DirectionType;

    constructor(textures: { [name: string]: PIXI.Sprite}, spawnCoords: PIXI.Point, state: State) {
        const { texture, enemyBullet, bullet } = textures;
        super(state);
        this.texture = texture;
        this.bullets = {enemyBullet: enemyBullet, bullet: bullet};
        this.coords = spawnCoords;
        this.texture.x = spawnCoords.x;
        this.texture.y = spawnCoords.y;
        this.texture.anchor.set(0.5); // set anchor to center
        this.predictedVx = 0;
        this.predictedVy = 0;
        this.speed = 4;
    }

    private getDirection(direction: DirectionType): DirectionType {
        return  {
            left:  direction['KeyA'] || direction['ArrowLeft'] || false,
            right: direction['KeyD'] || direction['ArrowRight'] || false,
            down: direction['KeyS'] || direction['ArrowDown'] || false,
            up: direction['KeyW'] || direction['ArrowUp'] || false
        };
    }

    public move(keys: DirectionType, platform: ICollision): void {
        let { up, down, left, right } = this.direction;
        const { h,v } = platform;
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
        super.move(keys, platform);
        if (left && (h === 0)) {
            this.coords.x -= this.speed;
        }
        if (right && (h === 0)) {
            this.coords.x += this.speed;
        }
        if (down && (v === 0)) {
            this.coords.y += this.speed;
        }
        if (up && (v === 0)) {
            this.coords.y -= this.speed;
        }
        this.texture.x = this.coords.x;
        this.texture.y = this.coords.y;
        this.prevDirection = this.direction;
    }

    public getVelocity(keys: DirectionType): void {
        const directions = this.getDirection(keys);
        this.direction = directions;
        let { up, down, left, right } = directions;

        if(up && down) {
            up = false;
            down = false;
            this.predictedVy = 0;
        }
        if(left && right) {
            left = false;
            right = false
            this.predictedVx = 0;
        }
        if (left) {
            this.predictedVx = -this.speed;
        }
        if (right) {
            this.predictedVx = this.speed;
        }
        if (down) {
            this.predictedVy = this.speed;
        }
        if (up) {
            this.predictedVy = -this.speed;
        }
    }

    public stopMovement(x: string,  y: string): void {
        if(x) {
            this.predictedVx = 0;
        }
        if(y) {
            this.predictedVy = 0;
        }
    }

    public changeDirection(newDirection: DirectionType, prevDirection: DirectionType = {left: false, right: false, down: false, up: true}): void {
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
        this.calculateShortestAngleToRotate(angle);
    }

    private calculateShortestAngleToRotate(angle: number): void {
        gsap.to(this.texture, {
            pixi: {rotation: `${angle}_short`},
            duration: 0.3
        });
    }

    public shoot(): Bullet {
        return new Bullet(this.coords, this.bullets.bullet, this.texture.rotation - 90 * (Math.PI/180));
    }
}