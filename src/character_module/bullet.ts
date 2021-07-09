import * as PIXI from 'pixi.js';

export class Bullet extends PIXI.Sprite {
    // public predictedVx: number;
    // public predictedVy: number;
    public speed: number = 5;
    public predictedVx: number;
    public predictedVy: number;
    constructor(startCoords: PIXI.Point, texture: PIXI.Sprite, direction: number) {
        super(texture.texture);
        this.position.x = startCoords.x + Math.cos(texture.rotation);
        this.position.y = startCoords.y + Math.sin(texture.rotation);
        this.rotation = direction;

        this.predictedVx = (direction >= 0) ? this.speed : - this.speed;
        this.predictedVy = (direction >= 0) ? this.speed : - this.speed;
    }
}