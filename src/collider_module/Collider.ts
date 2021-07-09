import {IRectShape} from "./IRectShape";
import PIXI from "pixi.js";
import {ICollision} from "./ICollision";
import {Map} from "../map/map";
import {Character} from "../character_module/character";
import {Bullet} from "../character_module/bullet";

export class Collider {
    private checkCoordinates(rect1: IRectShape, rect2: IRectShape): boolean {
        return (
            rect1.x + rect1.width > rect2.x &&
            rect1.x < rect2.x + rect2.width &&
            rect1.y + rect1.height > rect2.y &&
            rect1.y < rect2.y + rect2.height
        );
    }

    private checkOrdinateCollision(rect1: IRectShape, rect2: IRectShape, velocityX: number): number {
        const adjustedRect1: IRectShape = {
            ...rect1,
            x: rect1.x + velocityX
        };

        // const adjustedRect2 : IRectShape = {
        //     x: rect2.x,
        //     y: rect2.y,
        //     width: rect2.width,
        //     height: rect2.height
        // };

        if(this.checkCoordinates(adjustedRect1, rect2)) {
            return velocityX >= 0 ? rect2.x - (adjustedRect1.x + adjustedRect1.width) : rect2.x + rect2.width - adjustedRect1.x;
        } else {
            return 0;
        }
    }

    private checkAbscissaCollision(rect1: IRectShape, rect2: IRectShape, velocityY: number): number {
        const adjustedRect1: IRectShape = {
            ...rect1,
            y: rect1.y + velocityY
        };

        if(this.checkCoordinates(adjustedRect1, rect2)) {
            return velocityY >= 0 ? rect2.y - (adjustedRect1.y + adjustedRect1.height) : rect2.y + rect2.height - adjustedRect1.y;

        } else {

            return 0;
        }
    }

    private checkDiagonalCollision(rect1: IRectShape, rect2: IRectShape, velocityX: number, velocityY: number): ICollision {
        const adjustedRect1: IRectShape = {
            ...rect1,
            x: rect1.x + velocityX,
            y: rect1.y + velocityY
        };
        const NE: boolean = velocityX >= 0 && velocityY <= 0;
        const NW: boolean = velocityX <= 0 && velocityY <= 0;
        const SE: boolean = velocityX >= 0 && velocityY >= 0;
        const SW: boolean = velocityX <= 0 && velocityY >= 0;

        if (this.checkCoordinates(adjustedRect1, rect2)) {
            if (NE) {
                return {
                    h: rect2.x - (adjustedRect1.x + adjustedRect1.width),
                    v: rect2.y + rect2.height - adjustedRect1.y,
                };
            } else if (NW) {
                return {
                    h: rect2.x + rect2.width - adjustedRect1.x,
                    v: rect2.y + rect2.height - adjustedRect1.y,
                };
            } else if (SE) {
                return {
                    h: rect2.x - (adjustedRect1.x + adjustedRect1.width),
                    v: rect2.y - (adjustedRect1.y + adjustedRect1.height),
                };
            } else if (SW) {
                return {
                    h: rect2.x + rect2.width - adjustedRect1.x,
                    v: rect2.y - (adjustedRect1.y + adjustedRect1.height),
                };
            }
        }

        return {
            h: 0,
            v: 0,
        };
    }

    protected createCenteredCollisionBox(box: IRectShape): IRectShape {
        return {
            x: Math.ceil(box.x - box.width / 2),
            y: Math.ceil(box.y - box.height / 2),
            width: box.width,
            height: box.height
        };
    }

    protected collisionsWithMap(
        collisionBox: IRectShape,
        level: Map,
        predictedVx: number,
        predictedVy: number): ICollision {
        const collisions: Array<any> = level.tileSet.map(tile => ({
            h: this.checkOrdinateCollision(collisionBox, tile, predictedVx),
            v: this.checkAbscissaCollision(collisionBox, tile, predictedVy),
            diag: this.checkDiagonalCollision(collisionBox, tile, predictedVx, predictedVy)
        }));
        // console.log(collisionBox, predictedVx, predictedVy);
        //TODO find the type of these funcs
        const collisionHorizontal: any = collisions.find(collision  => collision.h);
        const collisionVertical: any = collisions.find(collision => collision.v);
        const collisionDiag: any = collisions.find(
            collision => collision.diag.h || collision.diag.v
        );

        // console.log(collisionHorizontal, 'collisionHorizontal');
        // console.log(collisionVertical, 'collisionVertical');
        // console.log(collisionDiag, 'collisionDiag');
        if (collisionHorizontal || collisionVertical) {
            return {
                h: collisionHorizontal ? collisionHorizontal.h : 0,
                v: collisionVertical ? collisionVertical.v : 0
            };
        }

        return {
            h: collisionDiag ? collisionDiag.h : 0,
            v: collisionDiag ? collisionDiag.v : 0
        };
    }

    public calculateCharatcerCollisions(
        map: Map,
        character: Character,
    ): { [name: string]: ICollision } {
        const characterCollisionBox: IRectShape = this.createCenteredCollisionBox({
            x: character.texture.x,
            y: character.texture.y,
            width: character.texture.width,
            height: character.texture.height
        });
        const platform = this.collisionsWithMap(
            characterCollisionBox,
            map,
            character.predictedVx,
            character.predictedVy
        );

        return {
            platform
        };
    }

    public calculateBulletCollisions(
      map: Map,
      bullet: Bullet
    ): { [name: string]: ICollision } {
        const bulletCollisionBox: IRectShape = this.createCenteredCollisionBox({
            x: bullet.position.x,
            y: bullet.position.y,
            width: bullet.width,
            height: bullet.height
        });
        const platform = this.collisionsWithMap(
            bulletCollisionBox,
            map,
            bullet.predictedVx,
            bullet.predictedVy
        );

        return {
            platform
        };
    }
}
