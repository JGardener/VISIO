import PipelineStep from './PipelineStep';
import styles from './HowItWorksOverlay.module.scss';

const STEPS = [
  { label: 'Describe', description: 'Type a scene description in the panel' },
  { label: 'Generate', description: 'Claude AI creates a structured scene JSON' },
  { label: 'Render', description: 'PIXI.js animates your scene in real time' },
  { label: 'Explore', description: 'Adjust controls, remix, export' },
];

interface HowItWorksOverlayProps {
  visible: boolean;
}

export default function HowItWorksOverlay({ visible }: HowItWorksOverlayProps) {
  return (
    <div className={`${styles.overlay}${visible ? '' : ` ${styles.hidden}`}`}>
      <div className={styles.title}>Welcome to VISIO</div>
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
