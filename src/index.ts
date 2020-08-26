import * as PIXI from 'pixi.js';
//Create a Pixi Application
let app = new PIXI.Application({width: 1024, height: 768});
//Add the canvas that Pixi automatically created for you to the HTML document
const initialLoader = new PIXI.Loader();
const assetLoader = new PIXI.Loader();

initialLoader.baseUrl = './assets';
initialLoader.add('loader-bar', 'loader-bar/loader-bar.png')
             .add('loader-bg', 'loader-bar/loader-bg.png')
             .load(initLoadingScene);

assetLoader.baseUrl = './assets';
assetLoader.add('eagle', 'board/eagle.png')
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
          .load(setup);

function setup() {
    let sprite = new PIXI.Sprite(
        assetLoader.resources["tank"].texture
    );
    app.stage.addChild(sprite);
}

let loadingBar:PIXI.Sprite;
let loadingBarInitialWidth:number =  0;

function initLoadingScene() {
    const sceneContainer = new PIXI.Container();
    app.stage.addChild(sceneContainer);
    const loadingBarWrapper = new PIXI.Sprite(
        initialLoader.resources['loader-bg'].texture
    );
    loadingBar = new PIXI.Sprite(
        initialLoader.resources['loader-bar'].texture
    );
    loadingBarInitialWidth = loadingBar.width;
    loadingBarWrapper.x = (app.renderer.width - loadingBarWrapper.width) / 2;
    loadingBarWrapper.y = (app.renderer.height - loadingBarWrapper.height) / 2;
    loadingBar.x = (app.renderer.width - loadingBar.width) / 2;
    loadingBar.y =( app.renderer.height - loadingBar.height) / 2;
    sceneContainer.addChild(loadingBarWrapper);
    sceneContainer.addChild(loadingBar);
}

assetLoader.onProgress.add((e) => {
    console.log( loadingBarInitialWidth);
    loadingBar.width = Math.floor(e.progress) / 100 * loadingBarInitialWidth;
});
assetLoader.onError.add(error => console.log(error));
document.body.appendChild(app.view);

