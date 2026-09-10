import GameBoard from "./components/GameBoard/GameBoard"
import { LifeEngine } from "./engine/LifeEngine";
import styles from './App.module.scss';
import { DEFAULT_AREA_SETTINGS } from "./constants";
import Controls from "./components/Controls/Controls";

const { width, height } = DEFAULT_AREA_SETTINGS;
const engine = new LifeEngine(width, height);

function App() {

    return (
        <main className={styles.app}>
            <Controls engine={engine} />
            <GameBoard engine={engine} />
        </main>
    )
}

export default App;
