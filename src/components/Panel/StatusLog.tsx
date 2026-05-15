import styles from './StatusLog.module.scss';

interface StatusLogProps {
  loading: boolean;
  error: string | null;
  stepLabel: string;
  progress: number;
}

export default function StatusLog({ loading, error, stepLabel, progress }: StatusLogProps) {
  const isIdle = !loading && !error && progress === 0;

  let textClass = '';
  let displayText = stepLabel;
  if (error) {
    textClass = styles.errorText;
    displayText = error;
  } else if (progress === 100) {
    textClass = styles.successText;
  }

  return (
    <div className={styles.statusLog}>
      <div className={styles.progressTrack}>
        <div
          className={styles.progressBar}
          style={{ width: `${progress}%`, opacity: isIdle ? 0 : 1 }}
        />
      </div>
      <div className={`${styles.logRow}${textClass ? ` ${textClass}` : ''}`}>
        {loading && <div className={styles.spinner} />}
        <span>{displayText}</span>
      </div>
    </div>
  );
}
