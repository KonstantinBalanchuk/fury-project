import * as PIXI from 'pixi.js';

export class Tile extends PIXI.Sprite {
    constructor(texture: PIXI.Sprite) {
        super(texture.texture);
        // this.position.x =  startCoords.x+Math.cos(texture.rotation);
        // this.position.y =  startCoords.y+Math.sin(texture.rotation);
        // this.rotation = direction;
    }
}