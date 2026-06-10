import styles from './PipelineStep.module.scss';

interface PipelineStepProps {
  number: number;
  label: string;
  description: string;
  isLast: boolean;
}

export default function PipelineStep({ number, label, description, isLast }: PipelineStepProps) {
  return (
    <li className={styles.step}>
      <div className={styles.rail} aria-hidden="true">
        <div className={styles.circle}>{number}</div>
        {!isLast && <div className={styles.connector} />}
      </div>
      <div className={styles.content}>
        <h3 className={styles.label}>{label}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </li>
  );
}
