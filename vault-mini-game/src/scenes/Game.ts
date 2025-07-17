import config from "../config";
import ParallaxBackground from "../prefabs/ParallaxBackground";
import Scene from "../core/Scene";
import { Sprite } from "pixi.js";
import { centerObjects } from "../utils/misc";

export default class Game extends Scene {
  name = "Game";

  private background!: ParallaxBackground;
  private door!: Sprite;
  private handle!: Sprite;
  private handleShadow!: Sprite;



  load() {
    this.background = new ParallaxBackground(config.backgrounds.vault);
    
    this.resizeSprite();

    // centerObjects(this.door, this.handle);

    this.addChild(this.background);
  }

  resizeSprite(){
    //get sprites from background
    this.door = this.background.getChildAt(1) as Sprite;
    this.handleShadow = this.background.getChildAt(2) as Sprite;
    this.handle = this.background.getChildAt(3) as Sprite;

    //assign sizes
    this.door.width = 450;
    this.door.height = 450;
    this.handle.width = 150;
    this.handle.height = 150;
    this.handleShadow.width = 150;
    this.handleShadow.height = 150;

    //set anchor points
    this.door.anchor.set(0.48, 0.52);
    this.handle.anchor.set(0.55, 0.58);
    this.handleShadow.anchor.set(0.53, 0.53);
  }

  onResize(width: number, height: number): void {
    // Keep background aspect ratio, scale to cover
    const bgTexture = this.background;
    const bgRatio = bgTexture.width / bgTexture.height;
    const screenRatio = width / height;

    if (screenRatio > bgRatio) {
      // Wider screen, match width
      this.background.width = width;
      this.background.height = width / bgRatio;
    } else {
      // Taller screen, match height
      this.background.height = height;
      this.background.width = height * bgRatio;
    }

    // Center background
    this.background.x = (width - this.background.width) / 2;
    this.background.y = (height - this.background.height) / 2;

    // Center the door (no scaling, keep original size)
    this.door.x = width / 2;
    this.door.y = height / 2;

    centerObjects(this.door, this.background);
  }

  async start() {
    
  }
}
