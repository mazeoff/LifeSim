export class LifeEngine {
    readonly width: number;
    readonly height: number;

    private grid: Uint8Array;

    constructor (width: number, height: number) {

        this.width = width;
        this.height = height;
        this.grid = new Uint8Array(width * height);
    }

    private getIndex(x: number, y: number): number {
        return y * this.width + x;
    }

    private wrap(value: number, size: number): number {
        return (value + size) % size;
    }

    public get cells(): Uint8Array {
        return this.grid;
    }
    
    public setCell(x: number, y: number, isAlive: boolean) {
        this.grid[this.getIndex(x, y)] = Number(isAlive);
    }

    public toggleCell(x: number, y: number) {
        const index = this.getIndex(x, y);

        this.grid[index] = Number(!this.grid[index]);
    }

    public isAlive(x: number, y: number): boolean {
        return Boolean(this.grid[this.getIndex(x, y)]);
    }

    public clear() {
        this.grid.fill(0);
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
}