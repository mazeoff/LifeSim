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

    it('keeps block pattern stable', () => {
        const engine = new LifeEngine(50, 50);

        engine.setCell(10, 10, true);
        engine.setCell(11, 10, true);
        engine.setCell(10, 11, true);
        engine.setCell(11, 11, true);

        engine.step();

        expect(engine.isAlive(10, 10)).toBe(true);
        expect(engine.isAlive(11, 10)).toBe(true);
        expect(engine.isAlive(10, 11)).toBe(true);
        expect(engine.isAlive(11, 11)).toBe(true);
    });

    it('updates blinker pattern to the next generation', () => {
        const engine = new LifeEngine(50, 50);

        engine.setCell(10, 9, true);
        engine.setCell(10, 10, true);
        engine.setCell(10, 11, true);

        engine.step();

        expect(engine.isAlive(9, 10)).toBe(true);
        expect(engine.isAlive(10, 10)).toBe(true);
        expect(engine.isAlive(11, 10)).toBe(true);

        expect(engine.isAlive(10, 9)).toBe(false);
        expect(engine.isAlive(10, 11)).toBe(false);
    });

    it('finishes when blinker returns to its initial state', () => {
        const engine = new LifeEngine(50, 50);

        engine.setCell(10, 9, true);
        engine.setCell(10, 10, true);
        engine.setCell(10, 11, true);

        engine.nextStep();

        expect(engine.isFinished).toBe(false);
        expect(engine.stepNumber).toBe(1);

        engine.nextStep();

        expect(engine.isFinished).toBe(true);
        expect(engine.stepNumber).toBe(1);
        expect(engine.historyLength).toBe(2);
    });

    it('applies Conway rules across toroidal boundaries', () => {
        const engine = new LifeEngine(50, 50);

        engine.setCell(49, 0, true);
        engine.setCell(0, 0, true);
        engine.setCell(1, 0, true);

        engine.step();

        expect(engine.isAlive(0, 49)).toBe(true);
        expect(engine.isAlive(0, 0)).toBe(true);
        expect(engine.isAlive(0, 1)).toBe(true);
    });

    it('moves back through calculated history', () => {
        const engine = new LifeEngine(50, 50);

        engine.setCell(11, 10, true);
        engine.setCell(12, 11, true);
        engine.setCell(10, 12, true);
        engine.setCell(11, 12, true);
        engine.setCell(12, 12, true);

        engine.nextStep();
        engine.nextStep();

        expect(engine.stepNumber).toBe(2);

        engine.prevStep();

        expect(engine.stepNumber).toBe(1);

        engine.prevStep();

        expect(engine.stepNumber).toBe(0);
    });

    it('does not move before the initial state', () => {
        const engine = new LifeEngine(50, 50);

        engine.prevStep();

        expect(engine.stepNumber).toBe(0);
    });

    it('calculates a new state when moving forward from history end', () => {
        const engine = new LifeEngine(50, 50);

        engine.setCell(10, 9, true);
        engine.setCell(10, 10, true);
        engine.setCell(10, 11, true);

        expect(engine.historyLength).toBe(1);

        engine.nextStep();

        expect(engine.stepNumber).toBe(1);
        expect(engine.historyLength).toBe(2);
    });

    it('reports available history navigation correctly', () => {
        const engine = new LifeEngine(50, 50);

        engine.setCell(10, 9, true);
        engine.setCell(10, 10, true);
        engine.setCell(10, 11, true);

        expect(engine.canGoBack).toBe(false);
        expect(engine.canGoForward).toBe(false);

        engine.nextStep();

        expect(engine.canGoBack).toBe(true);
        expect(engine.canGoForward).toBe(false);

        engine.prevStep();

        expect(engine.canGoBack).toBe(false);
        expect(engine.canGoForward).toBe(true);
    });

    it('finishes simulation when stable state repeats', () => {
        const engine = new LifeEngine(50, 50);

        engine.setCell(10, 10, true);
        engine.setCell(11, 10, true);
        engine.setCell(10, 11, true);
        engine.setCell(11, 11, true);

        engine.nextStep();

        expect(engine.isFinished).toBe(true);
    });

    it('does not allow editing after simulation starts', () => {
        const engine = new LifeEngine(50, 50);

        engine.setCell(10, 9, true);
        engine.setCell(10, 10, true);
        engine.setCell(10, 11, true);

        engine.nextStep();

        const stateBeforeEdit = engine.cells;

        engine.toggleCell(20, 20);
        engine.setCell(21, 21, true);
        engine.clear();

        expect(engine.cells).toEqual(stateBeforeEdit);
    });

    it('allows editing initial state before simulation starts', () => {
        const engine = new LifeEngine(50, 50);

        expect(engine.canEdit).toBe(true);

        engine.setCell(10, 10, true);

        expect(engine.isAlive(10, 10)).toBe(true);
    });

    it('resets simulation to initial state', () => {
    const engine = new LifeEngine(50, 50);

        engine.setCell(10, 9, true);
        engine.setCell(10, 10, true);
        engine.setCell(10, 11, true);

        engine.nextStep();
        engine.nextStep();

        expect(engine.isFinished).toBe(true);

        engine.reset();

        expect(engine.stepNumber).toBe(0);
        expect(engine.historyLength).toBe(1);
        expect(engine.isFinished).toBe(false);
        expect(engine.canEdit).toBe(true);
        expect(engine.cells.every((cell) => cell === 0)).toBe(true);
    });
});