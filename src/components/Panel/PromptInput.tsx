import { SUGGESTION_PROMPTS } from '@/constants';
import styles from './PromptInput.module.scss';

interface PromptInputProps {
  value: string;
  onChange: (v: string) => void;
  onGenerate: () => void;
  loading: boolean;
}

export default function PromptInput({ value, onChange, onGenerate, loading }: PromptInputProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !loading) {
      onGenerate();
    }
  }

  return (
    <div className={styles.section}>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe a scene… (Cmd+Enter to generate)"
        disabled={loading}
      />
      <div className={styles.chips}>
        {SUGGESTION_PROMPTS.map((p) => (
          <button key={p} className={styles.chip} onClick={() => onChange(p)}>
            {p}
          </button>
        ))}
      </div>
      <button
        className={styles.generateBtn}
        onClick={onGenerate}
        disabled={loading || !value.trim()}
      >
        {loading ? 'Generating…' : 'Generate Scene'}
      </button>
    </div>
  );
}
