import PIXI from "pixi.js";

export class GameScene {
    private readonly app: PIXI.Application;
    private readonly textures: { [name: string]: PIXI.Sprite };
    private readonly keys: { [name: string]: boolean } = {};
    private readonly controlKeys: Array<string> = ['a', 's', 'w', 'd', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'];
    private readonly player: PIXI.Sprite;

    constructor(app: PIXI.Application, textures: { [name: string]: PIXI.Sprite }) {
        this.app = app;
        this.textures = textures;
        this.player = this.textures.tank;
    }

    // creates player and event handlers
    protected init(): void {
        // keyboard event handlers
        window.addEventListener('keydown', this.registerKeyPress.bind(this), false);
        window.addEventListener('keyup', this.registerKeyRelease.bind(this), false);
    }

    protected gameLoop(): void {
        if (this.keys['a'] || this.keys['ArrowLeft']) {
            this.player.x -= 2;
        }
        if (this.keys['d'] || this.keys['ArrowRight']) {
            this.player.x += 2;
        }
        if (this.keys['s'] || this.keys['ArrowDown']) {
            this.player.y += 2;
        }
        if (this.keys['w'] || this.keys['ArrowUp']) {
            this.player.y -= 2;
        }
    }

    public createGameScene(gameScene: GameScene) {
        this.init();
        this.player.x = this.app.renderer.width / 2;
        this.player.y = this.app.renderer.height / 2;
        this.app.stage.addChild(this.player);
        this.app.ticker.add(this.gameLoop.bind(gameScene));
    }

    protected registerKeyPress(event: KeyboardEvent): void {
        if (event.key !== undefined && (this.controlKeys.indexOf(event.key) !== -1)) {
            // Handle the event with KeyboardEvent.key and set handled true.
            this.keys[event.key] = true;
        }
    }

    protected registerKeyRelease(event: KeyboardEvent): void {
        if (event.key !== undefined && (this.controlKeys.indexOf(event.key) !== -1)) {
            // Handle the event with KeyboardEvent.key and set handled false.
            this.keys[event.key] = false;
            console.log(this.keys);
        }
    }
}