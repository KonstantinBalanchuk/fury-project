import * as PIXI from 'pixi.js';

export class Preloader extends PIXI.Loader {
    private readonly app: PIXI.Application;
    private loadingBarInitialWidth: number = 0;

    constructor(app: PIXI.Application, baseUrl: string) {
        super(baseUrl);
        this.app = app;
    }

    protected loadAssets(loadingBar: PIXI.Sprite): void {
        this.add('eagle', 'board/eagle.png')
            .add('leaves', 'board/leaves.png')
            .add('small_wall_1', 'board/small_wall_1.png')
            .add('small_wall_2', 'board/small_wall_2.png')
            .add('small_wall_3', 'board/small_wall_3.png')
            .add('small_wall_4', 'board/small_wall_4.png')
            .add('bonus_immortal', 'bonus/bonus_immortal.png')
            .add('bonus_live', 'bonus/bonus_live.png')
            .add('bonus_slow', 'bonus/bonus_slow.png')
            .add('bonus_speed', 'bonus/bonus_speed.png')
            .add('enemy_blue', 'tanks/enemy_blue.png')
            .add('enemy_red', 'tanks/enemy_red.png')
            .add('enemy_white', 'tanks/enemy_white.png')
            .add('tank', 'tanks/tank.png')
            .add('appear', 'appear.png')
            .add('bullet', 'bullet.png')
            .add('button', 'button.png')
            .add('enemy_bullet', 'enemy_bullet.png')
            .add('explode', 'explode.png')
            .add('explode_small', 'explode_small.png')
            .add('scores', 'scores.png')
            .add('menu', 'screens/scr1.png')
            .load(this.switchToMenuScene.bind(this));
        this.onProgress.add((e) => {
            loadingBar.width = Math.floor(e.progress) / 100 * this.loadingBarInitialWidth;
        });
        this.onError.add(error => console.log(error));
    }

    protected switchToMenuScene(): void {
        const menuScreen = new PIXI.Sprite(this.resources["menu"].texture);
        const button = new PIXI.Graphics();
        const buttonWidth = 302;
        const buttonHeight = 62;
        menuScreen.x = (this.app.renderer.width - menuScreen.width) / 2;
        menuScreen.y = (this.app.renderer.height - menuScreen.height) / 2;


        button.beginFill(0x000000, 0.01);
        button.drawRect((this.app.renderer.width - buttonWidth) / 2, 525, buttonWidth, buttonHeight);
        button.endFill();
        button.interactive = true;
        button.buttonMode = true;
        button.on('pointerdown', this.switchToGameScene.bind(this));
        this.app.stage.removeChildren();
        this.app.stage.addChild(menuScreen);
        this.app.stage.addChild(button);

    }

    public initLoadingScene(): void {
        this.add('loader-bar', 'loader-bar/loader-bar.png')
            .add('loader-bg', 'loader-bar/loader-bg.png')
            .load(this.onLoadingScene.bind(this));
    }

    protected switchToGameScene(): void {
        this.app.stage.removeChildren();
        const tank = new PIXI.Sprite(this.resources["tank"].texture);
        tank.x = this.app.renderer.width  / 2;
        tank.y = this.app.renderer.height / 2;
        this.app.stage.addChild(tank);
    }

    protected onLoadingScene(): void {
        const sceneContainer = new PIXI.Container();
        sceneContainer.name = 'gameContainer';
        this.app.stage.addChild(sceneContainer);
        const loadingBarWrapper = new PIXI.Sprite(
            this.resources['loader-bg'].texture
        );
        const loadingBar = new PIXI.Sprite(
            this.resources['loader-bar'].texture
        );
        this.loadAssets(loadingBar);
        this.loadingBarInitialWidth = loadingBar.width;
        loadingBarWrapper.x = (this.app.renderer.width - loadingBarWrapper.width) / 2;
        loadingBarWrapper.y = (this.app.renderer.height - loadingBarWrapper.height) / 2;
        loadingBar.x = (this.app.renderer.width - loadingBar.width) / 2;
        loadingBar.y = (this.app.renderer.height - loadingBar.height) / 2;
        sceneContainer.addChild(loadingBarWrapper);
        sceneContainer.addChild(loadingBar);
    }
}