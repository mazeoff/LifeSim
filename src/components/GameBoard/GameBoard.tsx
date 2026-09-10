import { observer } from "mobx-react-lite";
import styles from "./GameBoard.module.scss";
import type { LifeEngine } from "../../engine/LifeEngine";

type GameBoardProps = {
    engine: LifeEngine
}

function GameBoard(props: GameBoardProps) {
    const { engine } = props;

    return (
        <div className={styles.board}>
            {
                Array.from(engine.cells).map((cell, index) => {
                    const x = index % engine.width;
                    const y = Math.floor(index / engine.width);

                    return (
                        <button
                            key={index}
                            type="button"
                            className={`${styles.cell} ${cell ? styles.alive : ''}`}
                            disabled={!engine.canEdit}
                            onClick={() => engine.toggleCell(x, y)}
                        />
                    );
                })
            }
        </div>
    );
}

export default observer(GameBoard);