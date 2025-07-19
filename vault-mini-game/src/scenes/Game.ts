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
  private vaultOpen!: ParallaxBackground;
  private door!: Sprite;
  private handle!: Sprite;
  private handleShadow!: Sprite;
  private doorOpen!: Sprite;
  private doorOpenShadow!: Sprite;
  private blink1!: Sprite;
  private blink2!: Sprite;
  private blink3!: Sprite;
  private vaultCombination!: VaultCombination;

  
  private isDragging = false;
  private lastMouseAngle = 0;
  private currentRotation = 0;
  private currCombination: { number: number; direction: 'clockwise' | 'counterclockwise' } | null = null;

    
  

  load() {
    this.background = new ParallaxBackground(config.backgrounds.vault);
    this.vaultOpen = new ParallaxBackground(config.backgrounds.opened);

    this.vaultCombination = new VaultCombination();

    this.resizeSprite();

    this.handleInteract();

    this.addChild(this.background);
  }

  unlock(){
    this.door.visible = false;
    this.handle.visible = false;
    this.handleShadow.visible = false;


    // Get the sprites
    this.doorOpenShadow = this.vaultOpen.getChildAt(0) as Sprite;
    this.doorOpen = this.vaultOpen.getChildAt(1) as Sprite;
    this.blink1 = this.vaultOpen.getChildAt(2) as Sprite;
    this.blink2 = this.vaultOpen.getChildAt(3) as Sprite;
    this.blink3 = this.vaultOpen.getChildAt(4) as Sprite;

    // Resize the sprites
    this.doorOpen.width = 250;
    this.doorOpen.height = 450;
    this.doorOpenShadow.width = 250;
    this.doorOpenShadow.height = 450;
    this.blink1.width = 150;
    this.blink1.height = 150;
    this.blink2.width = 150;
    this.blink2.height = 150;
    this.blink3.width = 150;
    this.blink3.height = 150;

    // Set anchor points
    this.doorOpen.anchor.set(-.6, 0.52);
    this.doorOpenShadow.anchor.set(-.68, 0.5);
    this.blink1.anchor.set(1.3, 0.55);
    this.blink2.anchor.set(.6, 0.6);
    this.blink3.anchor.set(0.25, -.05);

    this.setupGlitterAnimation();

    this.addChild(this.vaultOpen);
  }

  resizeSprite(){
    // Get sprites from background
    this.door = this.background.getChildAt(1) as Sprite;
    this.handleShadow = this.background.getChildAt(2) as Sprite;
    this.handle = this.background.getChildAt(3) as Sprite;

    // Assign sizes
    this.door.width = 450;
    this.door.height = 450;
    this.handle.width = 150;
    this.handle.height = 150;
    this.handleShadow.width = 150;
    this.handleShadow.height = 150;

    // Set anchor points
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

 private updateCurrentCombination(direction: 'clockwise' | 'counterclockwise'): void {
        // Calculate number based on complete rotations (60 degrees each)
        const rotations = Math.abs(Math.round(this.currentRotation / (Math.PI / 3)));
        const number = ((rotations % 9) || 9); // Convert 0 to 9, keep 1-9 as is

        this.currCombination = {
            number,
            direction
        };

        // Debug log
        // console.log('%cCurrent Combination:', 'color: #0000ff; font-weight: bold');
        // console.log(`Number: ${this.currCombination.number} (${rotations} rotations)`);
        // console.log(`Direction: ${this.currCombination.direction}`);
    }

  private onDragStart(event: any): void {
      this.isDragging = true;
      const localPos = event.data.getLocalPosition(this.handle.parent);
      this.lastMouseAngle = Math.atan2(
          localPos.y - this.handle.y,
          localPos.x - this.handle.x
  );
}
private setupGlitterAnimation(): void {
    // Hide blinks initially
    this.blink1.alpha = 0;
    this.blink2.alpha = 0;
    this.blink3.alpha = 0;

    // Create timeline for sequence
    const timeline = gsap.timeline({
        repeat: -1, // Infinite repeat
    });

    // Add blinks to timeline with staggered starts
    timeline
        .to(this.blink1, {
            alpha: 1,
            duration: 0.5,
            yoyo: true,
            repeat: 1
        })
        .to(this.blink2, {
            alpha: 1,
            duration: 0.5,
            yoyo: true,
            repeat: 1
        }, "-=0.5")
        .to(this.blink3, {
            alpha: 1,
            duration: 0.5,
            yoyo: true,
            repeat: 1
        }, "-=0.6")
        .to({}, { duration: .1 }); // Pause between sequences
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
    
    if (Math.abs(delta) > Math.PI) {
        this.lastMouseAngle = currentAngle;
        return;
    }

    const direction = this.getRotationDirection(delta);
    this.currentRotation += delta;

    // Update current combination
    this.updateCurrentCombination(direction);
    
    const snappedRotation = Math.round(this.currentRotation / (Math.PI / 3)) * (Math.PI / 3);

    gsap.to([this.handle, this.handleShadow], {
        rotation: snappedRotation,
        duration: 0.2,
    });

    this.lastMouseAngle = currentAngle;
}

private onDragEnd(): void {
    this.isDragging = false;


    if (this.currCombination) {
        const isCorrect = this.vaultCombination.checkMove(
            this.currCombination.number,
            this.currCombination.direction);

        if(this.vaultCombination.isCracked()) {
          this.combinationCorrect();
        };

        if (!isCorrect) {
            this.spinHandleCrazy(); // Spin when wrong
            return;
        }

        console.log(
            '%cFinal Move:', 
            'color: #ff0000; font-weight: bold; font-size: 14px'
        );
        console.log(
            `%c🔒 Locked at: Number ${this.currCombination.number}, Direction: ${this.currCombination.direction}`,
            'color: #ff0000; font-style: italic'
        );
    }

    // Reset combination after logging
    this.resetCurrentCombination();

    // Snap to final position with animation
    const snappedRotation = Math.round(this.currentRotation / (Math.PI / 3)) * (Math.PI / 3);
    gsap.to([this.handle, this.handleShadow], {
        rotation: snappedRotation,
        duration: 0.3,
        ease: "back.out(1.7)"
    });
}

private resetCurrentCombination(): void {
    this.currCombination = null;
    this.currentRotation = 0;
}

private combinationCorrect(): Promise<void> {
    return new Promise((resolve) => {
        this.unlock();
        // Wait 5 seconds before resetting and resolving
        gsap.delayedCall(5, () => {
            this.reset();
            resolve();
        });
    });
}

private spinHandleCrazy(): void {
    // Reset current rotation first
    this.currentRotation = 0;

    // Spin multiple full rotations clockwise
    gsap.to([this.handle, this.handleShadow], {
        rotation: Math.PI * 20, // Spin number of rotations
        duration: 1,
        ease: "elastic.out(0.5, 0.1)", // Amplitude to period / more bouncy
        onComplete: () => {
            // Reset rotation after spin
            gsap.to([this.handle, this.handleShadow], {
                rotation: 0,
                duration: 0,
                onComplete: () => {
                    this.resetCurrentCombination();
                }
            });
        }
    });
}

private spinHandleCrazyNoCombinationReset(): void {
    // Reset current rotation first
    this.currentRotation = 0;

    // Spin multiple full rotations clockwise
    gsap.to([this.handle, this.handleShadow], {
        rotation: Math.PI * 20, // Spin number of rotations
        duration: 1,
        ease: "elastic.out(0.5, 0.1)", // Amplitude to period / more bouncy
        onComplete: () => {
            // Reset rotation after spin
            gsap.to([this.handle, this.handleShadow], {
                rotation: 0,
                duration: 0,
                onComplete: () => {
                    // No reset of current combination here
                }
            });
        }
    });
}



  onResize(width: number, height: number): void {
    const scaleX = width / 1920 *2;
    const scaleY = height / 1080 *2;
    const scale = Math.min(scaleX, scaleY); // Changed to Math.min to fit screen

    this.background.scale.set(scale);
    this.vaultOpen.scale.set(scale);

    centerObjects(this.background);
    centerObjects(this.vaultOpen);
  }


  reset(){
    this.removeChildren();
    this.load();
    this.spinHandleCrazyNoCombinationReset();
  }

  async start() {
    
  }
}
