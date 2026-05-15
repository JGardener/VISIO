import styles from './PipelineStep.module.scss';

interface PipelineStepProps {
  number: number;
  label: string;
  description: string;
  isLast: boolean;
}

export default function PipelineStep({ number, label, description, isLast }: PipelineStepProps) {
  return (
    <div className={styles.step}>
      <div className={styles.circle}>{number}</div>
      <div className={styles.content}>
        <div className={styles.label}>{label}</div>
        <div className={styles.description}>{description}</div>
      </div>
      {!isLast && <div className={styles.connector} />}
    </div>
  );
}
