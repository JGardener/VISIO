import PipelineStep from './PipelineStep';
import styles from './HowItWorksModal.module.scss';

const STEPS = [
  { label: 'Describe', description: 'Type a scene description in the panel' },
  { label: 'Generate', description: 'Claude AI creates a structured scene JSON' },
  { label: 'Render', description: 'PIXI.js animates your scene in real time' },
  { label: 'Explore', description: 'Adjust controls, remix, and export as PNG' },
];

const BADGES = ['React 19', 'PIXI.js v7', 'Claude API', 'TypeScript', 'SCSS Modules'];

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
