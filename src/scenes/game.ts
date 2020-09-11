import * as PIXI from 'pixi.js';
import {Character} from "../character_module/character";
import {IdleState} from "../character_module/states/idle-state";
import {Bullet} from "../character_module/bullet";

export class GameScene {
    private readonly app: PIXI.Application;
    private readonly textures: { [name: string]: PIXI.Sprite };
    private readonly keys: { [name: string]: boolean } = {};
    // this variable is created for performance purpose: while it's false ticker invokes nothing
    private isKeyPressed: boolean = false;
    private player!: Character;
    private bullets: PIXI.Sprite[] = [];
    private readonly controlKeys: Array<string> = ['KeyA', 'KeyS', 'KeyW', 'KeyD', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'];

    constructor(app: PIXI.Application, textures: { [name: string]: PIXI.Sprite }) {
        this.app = app;
        this.textures = textures;
    }

    protected init(): void {
        // keyboard event handlers
        window.addEventListener('keydown', this.registerKeyPress.bind(this), false);
        window.addEventListener('keyup', this.registerKeyRelease.bind(this), false);
    }

    protected gameLoop(): void {
        if (this.isKeyPressed) {
            this.player.move(this.keys);
        }
        if(this.bullets?.length) {
            for(let b = this.bullets.length - 1; b >=0; b--){
                this.bullets[b].position.x += Math.cos(this.bullets[b].rotation)*5;
                this.bullets[b].position.y += Math.sin(this.bullets[b].rotation)*5;
            }
        }
    }

    public createGameScene(): void {
        this.init();
        this.player = new Character({texture: this.textures.tank, enemyBullet: this.textures.enemyBullet, bullet: this.textures.bullet}, new PIXI.Point(this.app.renderer.width / 2, this.app.renderer.height / 2), new IdleState());
        this.app.stage.addChild(this.player.texture);
        this.app.ticker.add(this.gameLoop, this);
    }

    protected registerKeyPress(event: KeyboardEvent): void {
        if (event.code !== undefined && (this.controlKeys.indexOf(event.code) !== -1)) {
            // Handle the event with KeyboardEvent.key and set handled true.
            if(event.code ==='Space') {
                const bullet: Bullet = this.player.shoot();
                this.bullets.push(bullet);
                console.log(this.bullets);
                this.app.stage.addChild(bullet);
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
                if(event.code !=='Space') {
                    this.player.idle();
                }
            }
        }
    }
}