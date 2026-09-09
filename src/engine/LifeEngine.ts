import { DEFAULT_AREA_SETTINGS } from "./constants";

export class LifeEngine {
    readonly width: number;
    readonly height: number;

    private grid: Uint8Array;

    constructor () {
        const { width, height } = DEFAULT_AREA_SETTINGS;

        this.width = width;
        this.height = height;
        this.grid = new Uint8Array(width * height);
    }

    private getIndex(x: number, y: number): number {
        return y * this.width + x;
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
}