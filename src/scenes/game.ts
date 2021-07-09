import * as PIXI from 'pixi.js';
import {Character} from "../character_module/character";
import {IdleState} from "../character_module/states/idle-state";
import {Bullet} from "../character_module/bullet";
import {Map} from "../map/map";
import {Collider} from "../collider_module/Collider";

export class GameScene {
    private readonly app: PIXI.Application;
    private readonly resources: PIXI.IResourceDictionary;
    private readonly keys: { [name: string]: boolean } = {};
    // this variable is created for performance purpose: while it's false ticker invokes nothing
    private isKeyPressed: boolean = false;
    private player!: Character;
    private map!: Map;
    private collider!: Collider;
    private bullets: Bullet[] = [];
    private readonly controlKeys: Array<string> = ['KeyA', 'KeyS', 'KeyW', 'KeyD', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'];

    constructor(app: PIXI.Application, resources: PIXI.IResourceDictionary) {
        this.app = app;
        // this.app.view.offsetLeft =1 ;
        this.resources = resources;
    }

    protected init(): void {
        // keyboard event handlers
        window.addEventListener('keydown', this.registerKeyPress.bind(this), false);
        window.addEventListener('keyup', this.registerKeyRelease.bind(this), false);
    }

    protected gameLoop(): void {
        // player controls
        if (this.isKeyPressed) {
            this.player.getVelocity(this.keys);
            const {platform} = this.collider.calculateCharatcerCollisions(this.map, this.player);
            this.player.move(this.keys, platform);
        }

        // bullet update position
        if(this.bullets?.length) {
            for(let b = this.bullets.length - 1; b >= 0; b--){
                const { platform } = this.collider.calculateBulletCollisions(this.map, this.bullets[b]);
                const { h,v } = platform;

                this.bullets[b].position.x += Math.cos(this.bullets[b].rotation)*this.bullets[b].speed;
                this.bullets[b].position.y += Math.sin(this.bullets[b].rotation)*this.bullets[b].speed;
                if(this.isOutOfMap(this.bullets[b].position.x, this.bullets[b].position.y) || h || v) {
                    this.playSmallExplodeAnimation(this.bullets[b].position.x, this.bullets[b].position.y);
                    this.app.stage.removeChild(this.bullets[b]);
                    this.bullets.splice(b, 1);
                    this.bullets[b].destroy();
                }
            }
        }
    }

    private playSmallExplodeAnimation(x: number, y: number): void {
        const smallExplodeArray = this.resources.smallExplode.spritesheet?.animations.explodeSmall;
        const smallExplodeAnimation = new PIXI.AnimatedSprite(smallExplodeArray);

        smallExplodeAnimation.loop = false;
        smallExplodeAnimation.x = x;
        smallExplodeAnimation.y = y;
        smallExplodeAnimation.play();
        this.app.stage.addChild(smallExplodeAnimation);
        smallExplodeAnimation.onComplete = () => smallExplodeAnimation.destroy();
    }

    public createGameScene(): void {
        this.init();
        const texture: PIXI.Sprite = new PIXI.Sprite(this.resources.tank.texture);
        const enemyBullet: PIXI.Sprite = new PIXI.Sprite(this.resources.enemyBullet.texture);
        const bullet: PIXI.Sprite = new PIXI.Sprite(this.resources.bullet.texture);
        this.player = new Character({ texture , enemyBullet, bullet}, new PIXI.Point(this.app.renderer.width / 2, this.app.renderer.height / 2), new IdleState());
        this.map = new Map(this.resources,  this.app.stage);
        this.app.stage.addChild(this.player.texture);
        this.collider = new Collider();
        this.app.ticker.add(this.gameLoop, this);
    }

    protected registerKeyPress(event: KeyboardEvent): void {
        if (event.code !== undefined && (this.controlKeys.indexOf(event.code) !== -1)) {
            // Handle the event with KeyboardEvent.key and set handled true.
            if(event.code === 'Space') {
                this.createBullet();
            } else {
                this.keys[event.code] = true;
                this.isKeyPressed = true;
            }
        }
    }

    protected registerKeyRelease(event: KeyboardEvent): void {
        if (event.code !== undefined && (this.controlKeys.indexOf(event.code) !== -1)) {
            // Handle the event with KeyboardEvent.key and set handled false.
            this.keys[event.code] = false;
            if (!Object.values(this.keys).some((element: boolean) => element)) {
                this.isKeyPressed = false;
                if(event.code !== 'Space') {
                    this.player.idle();
                    this.player.stopMovement('x', 'y');
                }
            }
        }
    }

    protected createBullet(): void {
        const bullet: Bullet = this.player.shoot();
        this.bullets.push(bullet);
        this.app.stage.addChild(bullet);
        // console.log(this.bullets);
    }

    private isOutOfMap(y: number, x: number): boolean {
        return (y <= 0) ||
               (x <= 0) ||
               (y >= this.app.view.height) ||
               (x >= this.app.view.width)
    }
}