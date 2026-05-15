import PipelineStep from './PipelineStep';
import styles from './HowItWorksModal.module.scss';

const STEPS = [
  {
    label: 'You describe a scene',
    description:
      'Type anything — a solar system, a fire, a digital rainstorm. Plain English, no special syntax needed.',
  },
  {
    label: 'Claude interprets it',
    description:
      "Your prompt is sent to Claude — Anthropic's AI. Claude translates your description into a structured JSON scene definition, specifying elements, colours, sizes, speeds, and animation types.",
  },
  {
    label: 'PIXI.js renders it',
    description:
      'The JSON is passed to PIXI.js, a high-performance WebGL rendering engine, which builds and animates the scene in real time on the canvas — entirely in your browser, no server required.',
  },
  {
    label: 'You take control',
    description:
      'Adjust speed and colour palette in real time. Remix two scenes together. Export your creation as a PNG. Every scene is saved to history so you can revisit or blend previous ideas.',
  },
];

const BADGES = ['Claude API', 'PIXI.js', 'React + TypeScript', 'WebGL'];

interface HowItWorksModalProps {
  onClose: () => void;
}

export default function HowItWorksModal({ onClose }: HowItWorksModalProps) {
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>How It Works</span>
          <button className={styles.closeBtn} onClick={onClose}>
            CLOSE
          </button>
        </div>
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <PipelineStep
              key={s.label}
              number={i + 1}
              label={s.label}
              description={s.description}
              isLast={i === STEPS.length - 1}
            />
          ))}
        </div>
        <div className={styles.footer}>
          {BADGES.map((b) => (
            <span key={b} className={styles.badge}>
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
