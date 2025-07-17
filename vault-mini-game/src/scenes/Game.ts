import config from "../config";
import ParallaxBackground from "../prefabs/ParallaxBackground";
import Scene from "../core/Scene";
import { Sprite } from "pixi.js";
import { centerObjects } from "../utils/misc";
import { gsap } from "gsap";
import { VaultCombination } from "../core/VaultCombination";

export default class Game extends Scene {
  name = "Game";

  private background!: ParallaxBackground;
  private door!: Sprite;
  private handle!: Sprite;
  private handleShadow!: Sprite;
  private vaultCombination!: VaultCombination;

  private isDragging = false;
  private lastMouseAngle = 0;
  private currentRotation = 0;
    
  

  load() {
    this.background = new ParallaxBackground(config.backgrounds.vault);
    this.vaultCombination = new VaultCombination();

    this.resizeSprite();

    this.handleInteract();

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

  handleInteract() {
    this.handle.eventMode = 'static';  // Enable interaction
    this.handle.cursor = 'pointer';

    // Bind the event handlers
    this.handle
        .on('pointerdown', this.onDragStart, this)
        .on('pointermove', this.onDragMove, this)
        .on('pointerup', this.onDragEnd, this)
        .on('pointerupoutside', this.onDragEnd, this);
}

private onDragStart(event: any): void {
    this.isDragging = true;
    const localPos = event.data.getLocalPosition(this.handle.parent);
    this.lastMouseAngle = Math.atan2(
        localPos.y - this.handle.y,
        localPos.x - this.handle.x
    );
}

private getRotationDirection(delta: number): 'clockwise' | 'counterclockwise' {
    return delta > 0 ? 'clockwise' : 'counterclockwise';
}

private onDragMove(event: any): void {
    if (!this.isDragging) return;

    const localPos = event.data.getLocalPosition(this.handle.parent);
    const currentAngle = Math.atan2(
        localPos.y - this.handle.y,
        localPos.x - this.handle.x
    );

    let delta = currentAngle - this.lastMouseAngle;
    
    // If delta is too large (wrap around), ignore this update
    if (Math.abs(delta) > Math.PI) {
        this.lastMouseAngle = currentAngle;
        return;
    }

    const direction = this.getRotationDirection(delta);
    this.currentRotation += delta;
    
    // Simple snap to 60-degree increments
    const snappedRotation = Math.round(this.currentRotation / (Math.PI / 3)) * (Math.PI / 3);

    // Animate rotation instead of direct setting
    gsap.to([this.handle, this.handleShadow], {
        rotation: snappedRotation,
        duration: 0.2,
        ease: "power2.out"
    });

    // Optional: Log rotation direction
    console.log(`Rotating ${direction}`);

    this.lastMouseAngle = currentAngle;
}

private onDragEnd(): void {
    this.isDragging = false;
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
