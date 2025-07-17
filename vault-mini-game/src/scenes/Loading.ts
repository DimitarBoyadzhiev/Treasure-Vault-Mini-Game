import { Sprite} from "pixi.js";
import Scene from "../core/Scene";
import { centerObjects } from "../utils/misc";

export default class Loading extends Scene {
  name = "Loading";

  async load() {
    await this.utils.assetLoader.loadAssetsGroup("Loading");

    const bg = Sprite.from("bgVault");

    // Make the background fill the screen
    const width = window.innerWidth;
    const height = window.innerHeight;

    //fit the background to the screen
    bg.width = width;
    bg.height = height;

    centerObjects(bg);

    this.addChild(bg);
  }

  async start() {
    await this.utils.assetLoader.loadAssetsGroup("Game");
  }
}
