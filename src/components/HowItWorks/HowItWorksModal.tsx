import { useRef } from 'react';
import { useFocusTrap } from '@/hooks';
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
      "Your prompt is sent to Claude — Anthropic's AI. Claude translates your description into a structured JSON scene definition: elements, colours, sizes, speeds, and animation types.",
  },
  {
    label: 'PIXI.js renders it',
    description:
      'The JSON drives PIXI.js, a high-performance WebGL engine, which builds and animates the scene in real time — entirely in your browser.',
  },
  {
    label: 'You take control',
    description:
      'Refine the scene with follow-up instructions, adjust speed and palette, blend two scenes together, or export your creation as a PNG. Everything is saved to your Library.',
  },
];

const BADGES = ['Claude API', 'PIXI.js', 'React + TypeScript', 'WebGL'];

interface HowItWorksModalProps {
  onClose: () => void;
}

export default function HowItWorksModal({ onClose }: HowItWorksModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(true, modalRef, onClose);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hiw-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title} id="hiw-title">
            How it works
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none">
              <path
                d="M4 4l8 8m0-8l-8 8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <ol className={styles.steps}>
          {STEPS.map((s, i) => (
            <PipelineStep
              key={s.label}
              number={i + 1}
              label={s.label}
              description={s.description}
              isLast={i === STEPS.length - 1}
            />
          ))}
        </ol>
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
