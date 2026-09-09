import { describe, expect, it } from 'vitest';

import { LifeEngine } from './LifeEngine';

describe('LifeEngine', () => {
    it('creates an empty grid', () => {
        const engine = new LifeEngine(50, 50);

        expect(engine.cells.length).toBe(2500);
        expect(engine.cells.every((cell) => cell === 0)).toBe(true);
    });

    it('sets a cell as alive', () => {
        const engine = new LifeEngine(50, 50);

        engine.setCell(10, 5, true);

        expect(engine.isAlive(10, 5)).toBe(true);
    });

    it('sets a cell as dead', () => {
        const engine = new LifeEngine(50, 50);

        engine.setCell(10, 5, true);
        engine.setCell(10, 5, false);

        expect(engine.isAlive(10, 5)).toBe(false);
    });

    it('toggles a cell state', () => {
        const engine = new LifeEngine(50, 50);

        engine.toggleCell(10, 5);

        expect(engine.isAlive(10, 5)).toBe(true);

        engine.toggleCell(10, 5);

        expect(engine.isAlive(10, 5)).toBe(false);
    });

    it('clears the grid', () => {
        const engine = new LifeEngine(50, 50);

        engine.setCell(1, 1, true);
        engine.setCell(10, 20, true);
        engine.setCell(49, 49, true);

        engine.clear();

        expect(engine.cells.every((cell) => cell === 0)).toBe(true);
    });

    it('counts neighbors around a cell', () => {
        const engine = new LifeEngine(50, 50);

        engine.setCell(9, 9, true);
        engine.setCell(10, 9, true);
        engine.setCell(11, 9, true);

        expect(engine.countNeighbors(10, 10)).toBe(3);
    });

    it('counts neighbors through toroidal boundaries', () => {
        const engine = new LifeEngine(50, 50);

        engine.setCell(49, 0, true);
        engine.setCell(0, 49, true);
        engine.setCell(49, 49, true);

        expect(engine.countNeighbors(0, 0)).toBe(3);
    });

    it('wraps neighbors from bottom-right to top-left', () => {
        const engine = new LifeEngine(50, 50);

        engine.setCell(0, 49, true);
        engine.setCell(49, 0, true);
        engine.setCell(0, 0, true);

        expect(engine.countNeighbors(49, 49)).toBe(3);
    });
});