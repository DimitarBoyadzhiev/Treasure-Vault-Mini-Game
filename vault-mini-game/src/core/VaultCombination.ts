interface CombinationPair {
    number: number;
    direction: 'clockwise' | 'counterclockwise';
}

export class VaultCombination {
    private combination: CombinationPair[] = [];
    private currentIndex: number = 0;
    private vaultCracked: boolean = false;
    
    constructor() {
        this.combination = this.generateRandomCombination();
    }

    private generateRandomCombination(): CombinationPair[] {
        const combination: CombinationPair[] = [];
        for (let i = 0; i < 3; i++) {
            combination.push({
                number: Math.floor(Math.random() * 9) + 1, // Random number 1-9
                direction: Math.random() < 0.5 ? 'clockwise' : 'counterclockwise'
            });
        }
        console.log('%cVault Combination:', 'color: #ff0000; font-weight: bold; font-size: 14px');
        combination.forEach((pair, index) => {
            console.log(
                `%cPair ${index + 1}: Number ${pair.number} - ${pair.direction}`,
                'color: #00ff00; font-weight: bold'
            );
        });
        return combination;
    }

    public checkMove(number: number, direction: 'clockwise' | 'counterclockwise'): boolean {
        if (this.currentIndex >= this.combination.length) {
            return false;
        }

        const currentPair = this.combination[this.currentIndex];
        console.log(`Checking move: ${number} ${direction}`);
        console.log(`Expected: ${currentPair.number} ${currentPair.direction}`);
        
        if (currentPair.number === number && currentPair.direction === direction) {
            console.log(`Correct! Progress: ${this.currentIndex + 1}/${this.combination.length}`);
            this.currentIndex++;
            return true;
        }

        console.log('Wrong move, resetting progress');
        this.currentIndex = 0;
        this.combination = this.generateRandomCombination();
        return false;
    }

    public isCracked(): boolean {
        return this.vaultCracked;
    }

    public isComplete(): boolean {
        const complete = this.currentIndex === this.combination.length;
        if (complete) {
            console.log('Combination complete!');
        }
        return complete;
    }

    public reset(): void {
        this.currentIndex = 0;
        console.log('Combination progress reset');
    }
}