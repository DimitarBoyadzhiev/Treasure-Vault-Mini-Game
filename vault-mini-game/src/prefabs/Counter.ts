import { Container, Text} from 'pixi.js';

export class Counter extends Container{
    private timeText: Text;
    private seconds: number = 0;
    private isRunning: boolean = false;
    private intervalId: NodeJS.Timeout | null = null;

    constructor() {
        super();
        
        // Create text display
        this.timeText = new Text('0', {
            fontFamily: 'sans',
            fontSize: 18,
            fontWeight: "bold",
            fill: 0xff0000,
            align: 'center',
        });

        // Center the text anchor
        this.timeText.anchor.set(0.5);
        
        // Add to container
        this.addChild(this.timeText);
    }

    public start(): void {
        if (!this.isRunning) {
            this.isRunning = true;
            this.intervalId = setInterval(() => {
                this.seconds++;
                this.updateDisplay();
            }, 1000);
        }
    }

    public stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
    }

    public reset(): void {
        this.seconds = 0;
        this.updateDisplay();
    }

    public getTime(): number {
        return this.seconds;
    }

    private updateDisplay(): void {
        this.timeText.text = `${this.seconds}`;
    }
}