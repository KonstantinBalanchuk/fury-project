import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import { Character } from "../character_module/character";

export class GameScene {
    private readonly app: PIXI.Application;
    private readonly textures: { [name: string]: PIXI.Sprite };
    private readonly keys: { [name: string]: boolean } = {};
    // this variable is created for performance purpose: while it's false ticker invokes nothing
    private isKeyPressed: boolean = false;
    private player!: Character;
    private readonly controlKeys: Array<string> = ['KeyA', 'KeyS', 'KeyW', 'KeyD', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'];

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
    }

    public createGameScene() {
        this.init();
        this.player = new Character(this.textures.tank, new PIXI.Point(this.app.renderer.width / 2, this.app.renderer.height / 2));
        this.app.stage.addChild(this.player.texture);
        this.app.ticker.add(this.gameLoop, this);
    }

    protected registerKeyPress(event: KeyboardEvent): void {
        if (event.code !== undefined && (this.controlKeys.indexOf(event.code) !== -1)) {
            // Handle the event with KeyboardEvent.key and set handled true.
            this.keys[event.code] = true;
            this.isKeyPressed = true;
        }
    }

    protected registerKeyRelease(event: KeyboardEvent): void {
        if (event.code !== undefined && (this.controlKeys.indexOf(event.code) !== -1)) {
            // Handle the event with KeyboardEvent.key and set handled false.
            this.keys[event.code] = false;
            if(!Object.values(this.keys).some((element: boolean)  => element)) {
                this.player.idle();
                this.isKeyPressed = false;
            }
        }
    }
}