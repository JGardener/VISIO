import { SUGGESTION_PROMPTS } from '@/constants';
import styles from './PromptInput.module.scss';

interface PromptInputProps {
  value: string;
  onChange: (v: string) => void;
  onGenerate: () => void;
  onRefine: () => void;
  onChipSelect: (prompt: string) => void;
  loading: boolean;
  hasScene: boolean;
}

export default function PromptInput({ value, onChange, onGenerate, onRefine, onChipSelect, loading, hasScene }: PromptInputProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !loading) {
      hasScene ? onRefine() : onGenerate();
    }
  }

  const placeholder = hasScene
    ? "Refine: 'add a comet', 'make it darker', 'add a storm'…"
    : "Describe a scene… (Cmd+Enter to generate)";

  return (
    <div className={styles.section}>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={loading}
      />
      <div className={styles.chips}>
        {SUGGESTION_PROMPTS.map((p) => (
          <button key={p} className={styles.chip} onClick={() => onChipSelect(p)} disabled={loading}>
            {p}
          </button>
        ))}
      </div>
      {hasScene ? (
        <div className={styles.actionButtons}>
          <button
            className={styles.refineBtn}
            onClick={onRefine}
            disabled={loading || !value.trim()}
          >
            Refine Scene
          </button>
          <button
            className={styles.newSceneBtn}
            onClick={onGenerate}
            disabled={loading}
          >
            New Scene
          </button>
        </div>
      ) : (
        <button
          className={styles.generateBtn}
          onClick={onGenerate}
          disabled={loading || !value.trim()}
        >
          Generate Scene
        </button>
      )}
    </div>
  );
}
