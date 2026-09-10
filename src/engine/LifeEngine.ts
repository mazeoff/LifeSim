export class LifeEngine {
    readonly width: number;
    readonly height: number;

    private history: Uint8Array[] = [];
    private currentStep: number = 0;
    private seenStates = new Set<string>();
    private finished = false;

    constructor (width: number, height: number) {
        this.width = width;
        this.height = height;

        this.history.push(new Uint8Array(width * height));
    }

    private serialize(grid: Uint8Array): string {
        return grid.join('');
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

    public get canGoBack(): boolean {
        return this.currentStep > 0;
    }

    public get canGoForward(): boolean {
        return this.currentStep < this.history.length - 1;
    }

    public get isFinished(): boolean {
        return this.finished;
    }

    public get canEdit(): boolean {
        return this.history.length === 1;
    }

    public prevStep() {
        if (!this.canGoBack) return;

        this.currentStep--;
    }

    public nextStep() {
        if (this.canGoForward) {
            this.currentStep++;
            return;
        }

        this.step();
    }

    public getHistoryStep(step: number): Uint8Array | undefined {
        const state = this.history[step];

        return state ? new Uint8Array(state) : undefined;
    }
    
    public setCell(x: number, y: number, isAlive: boolean) {
        if (!this.canEdit) return;

        this.currentGrid[this.getIndex(x, y)] = Number(isAlive);
    }

    public toggleCell(x: number, y: number) {
        if (!this.canEdit) return;

        const index = this.getIndex(x, y);

        this.currentGrid[index] = Number(!this.currentGrid[index]);
    }

    public isAlive(x: number, y: number): boolean {
        return Boolean(this.currentGrid[this.getIndex(x, y)]);
    }

    public clear() {
        if (!this.canEdit) return;
        
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
        if (this.finished) return;

        if (this.history.length === 1 && this.seenStates.size === 0) {
            this.seenStates.add(this.serialize(this.currentGrid));
        }

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
        
        const serializedState = this.serialize(nextGrid);
        
        if (this.seenStates.has(serializedState)) {
            this.finished = true;
            
            return;
        }

        this.history.push(nextGrid);
        this.currentStep++;

        this.seenStates.add(serializedState);
    }
}