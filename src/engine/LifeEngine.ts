export class LifeEngine {
    readonly width: number;
    readonly height: number;

    private history: Uint8Array[] = [];
    private currentStep: number = 0;

    constructor (width: number, height: number) {
        this.width = width;
        this.height = height;

        this.history.push(
            new Uint8Array(new Uint8Array(width * height))
        );
    }

    private get currentGrid(): Uint8Array {
        return this.history[this.currentStep];
    }

    private getIndex(x: number, y: number): number {
        return y * this.width + x;
    }

    private wrap(value: number, size: number): number {
        return (value + size) % size;
    }

    public get cells(): Uint8Array {
        return new Uint8Array(this.currentGrid);
    }

    public get stepNumber(): number {
        return this.currentStep;
    }

    public get historyLength(): number {
        return this.history.length;
    }

    public getHistoryStep(step: number): Uint8Array | undefined {
        const state = this.history[step];

        return !step ? undefined : new Uint8Array(state)
    }
    
    public setCell(x: number, y: number, isAlive: boolean) {
        this.currentGrid[this.getIndex(x, y)] = Number(isAlive);
    }

    public toggleCell(x: number, y: number) {
        const index = this.getIndex(x, y);

        this.currentGrid[index] = Number(!this.currentGrid[index]);
    }

    public isAlive(x: number, y: number): boolean {
        return Boolean(this.currentGrid[this.getIndex(x, y)]);
    }

    public clear() {
        this.currentGrid.fill(0);
    }

    public countNeighbors(x: number, y: number): number {
        let count = 0;

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if  (!dx && !dy) {
                    continue;
                }

                const neighborCell = {
                    x: this.wrap(x + dx, this.width),
                    y: this.wrap(y + dy, this.height)
                };

                if (this.isAlive(neighborCell.x, neighborCell.y)) {
                    count++;
                }
            }
        }

        return count;
    }

    public step() {
        const currentGrid = this.currentGrid;
        const nextGrid = new Uint8Array(currentGrid.length);

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const index = this.getIndex(x, y);

                const isAlive = Boolean(currentGrid[index]);
                const neighborsCount = this.countNeighbors(x, y);

                nextGrid[index] = isAlive
                    ? Number(neighborsCount === 2 || neighborsCount === 3)
                    : Number(neighborsCount === 3);
            }
        }

        this.history.push(nextGrid);
        this.currentStep++;
    }
}