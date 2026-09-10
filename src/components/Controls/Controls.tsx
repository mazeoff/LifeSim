import { observer } from "mobx-react-lite";
import { LANGS } from "../../engine/constants";
import type { LifeEngine } from "../../engine/LifeEngine";
import styles from './Controls.module.scss';


type ControlsProps = {
    engine: LifeEngine;
};

function Controls(props: ControlsProps) {
    const { engine } = props;

    return (
        <div className={styles.controls}>
            <button
                type="button"
                disabled={!engine.canGoBack}
                onClick={() => engine.prevStep()}
            >
                {LANGS.BACK}
            </button>

            <span>
                {LANGS.STEP}: {engine.stepNumber}
            </span>

            <button
                type="button"
                disabled={engine.isFinished && !engine.canGoForward}
                onClick={() => engine.nextStep()}
            >
                {LANGS.FORWARD}
            </button>

            <button
                type="button"
                disabled={!engine.canEdit}
                onClick={() => engine.clear()}
            >
                {LANGS.CLEAR}
            </button>

            {engine.isFinished && (
                <>
                    <span className={styles.finished}>
                        {LANGS.FINISH}
                    </span>
                    <button
                        type="button"
                        onClick={() => engine.reset()}
                    >
                        {LANGS.RETRY}
                    </button>
                </>
            )}
        </div>
    );
}

export default observer(Controls);