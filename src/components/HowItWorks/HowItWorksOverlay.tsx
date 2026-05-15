import PipelineStep from './PipelineStep';
import styles from './HowItWorksOverlay.module.scss';

const STEPS = [
  {
    label: 'Describe a scene',
    description:
      'Type anything in plain English — a solar system, a fire, a digital rainstorm.',
  },
  {
    label: 'Claude interprets it',
    description:
      "Your prompt is sent to Claude's API, which returns a structured JSON scene definition.",
  },
  {
    label: 'PIXI.js renders it',
    description: 'The JSON drives a WebGL canvas — animated in real time, entirely in your browser.',
  },
  {
    label: 'You take control',
    description: 'Adjust speed, zoom, and palette. Remix two scenes together. Export as PNG.',
  },
];

interface HowItWorksOverlayProps {
  visible: boolean;
}

export default function HowItWorksOverlay({ visible }: HowItWorksOverlayProps) {
  return (
    <div className={`${styles.overlay}${visible ? '' : ` ${styles.hidden}`}`}>
      <div className={styles.title}>
        Welcome to <span className={styles.accent}>VISIO</span>
      </div>
      <div className={styles.subtitle}>AI-powered interactive scene visualiser</div>
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
    </div>
  );
}
