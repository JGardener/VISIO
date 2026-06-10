import styles from './HowItWorksOverlay.module.scss';

const STEPS = [
  { number: 1, label: 'Describe', detail: 'any scene in plain English' },
  { number: 2, label: 'Generate', detail: 'Claude builds it as living art' },
  { number: 3, label: 'Play', detail: 'refine, remix, recolour, export' },
];

interface HowItWorksOverlayProps {
  visible: boolean;
}

export default function HowItWorksOverlay({ visible }: HowItWorksOverlayProps) {
  return (
    <div className={`${styles.overlay}${visible ? '' : ` ${styles.hidden}`}`} aria-hidden={!visible}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}>AI scene studio</p>
        <h1 className={styles.title}>
          Describe a scene.
          <br />
          <span className={styles.titleAccent}>Watch it come alive.</span>
        </h1>
        <p className={styles.subtitle}>
          VISIO turns a sentence into animated WebGL art — interpreted by Claude, rendered live in
          your browser.
        </p>
        <ol className={styles.steps}>
          {STEPS.map((s) => (
            <li key={s.number} className={styles.step}>
              <span className={styles.stepNumber} aria-hidden="true">
                {s.number}
              </span>
              <span className={styles.stepText}>
                <strong>{s.label}</strong> {s.detail}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
