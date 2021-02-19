import * as PIXI from 'pixi.js';
import {Character} from "../character_module/character";
import {IdleState} from "../character_module/states/idle-state";
import {Bullet} from "../character_module/bullet";
import {Map} from "../map/map";
import {Collider} from "../collider_module/Collider";

export class GameScene {
    private readonly app: PIXI.Application;
    private readonly textures: { [name: string]: PIXI.Sprite };
    private readonly keys: { [name: string]: boolean } = {};
    // this variable is created for performance purpose: while it's false ticker invokes nothing
    private isKeyPressed: boolean = false;
    private player!: Character;
    private map!: Map;
    private collider!: Collider;
    private bullets: Bullet[] = [];
    private readonly controlKeys: Array<string> = ['KeyA', 'KeyS', 'KeyW', 'KeyD', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'];

    constructor(app: PIXI.Application, textures: { [name: string]: PIXI.Sprite }) {
        this.app = app;
        // this.app.view.offsetLeft =1 ;
        this.textures = textures;
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
                this.bullets[b].position.x += Math.cos(this.bullets[b].rotation)*this.bullets[b].speed;
                this.bullets[b].position.y += Math.sin(this.bullets[b].rotation)*this.bullets[b].speed;
                // console.log(this.bullets[b]);

                if(this.bullets[b].position.y < 0) {
                    // console.log(this.bullets[b].position.y);
                    // this.bullets[b].isExist = true;
                    this.app.stage.removeChild(this.bullets[b]);
                    this.bullets.splice(b, 1);
                }
            }
        }
    }

    public createGameScene(): void {
        this.init();
        this.player = new Character({texture: this.textures.tank, enemyBullet: this.textures.enemyBullet, bullet: this.textures.bullet}, new PIXI.Point(this.app.renderer.width / 2, this.app.renderer.height / 2), new IdleState());
        this.map = new Map(this.textures,  this.app.stage);
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
}