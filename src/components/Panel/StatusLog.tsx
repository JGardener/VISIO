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
    displayText = 'Scene ready';
  } else if (isIdle) {
    displayText = 'Enter to generate · Shift+Enter for a new line';
  }

  return (
    <div className={styles.statusLog}>
      <div className={styles.progressTrack} aria-hidden="true">
        <div
          className={styles.progressBar}
          style={{ width: `${progress}%`, opacity: loading ? 1 : 0 }}
        />
      </div>
      <div
        className={`${styles.logRow}${textClass ? ` ${textClass}` : ''}${isIdle ? ` ${styles.hint}` : ''}`}
        role={error ? 'alert' : 'status'}
        aria-live={error ? 'assertive' : 'polite'}
      >
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        <span>{displayText}</span>
      </div>
    </div>
  );
}
