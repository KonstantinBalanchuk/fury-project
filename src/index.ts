import * as PIXI from 'pixi.js';
import {Preloader} from './preloader_module/preloader/Preloader'
//Create a Pixi Application
let app = new PIXI.Application({width: 1024, height: 768, backgroundColor: 0x1b273a});
//Add the canvas that Pixi automatically created for you to the HTML document
// const initialLoader = new PIXI.Loader('./assets');
const assetLoader = new Preloader(app,'./assets');
assetLoader.initLoadingScene();
document.body.appendChild(app.view);
window.PIXI = PIXI;
