import { useState, useRef } from 'react';
import { SUGGESTION_PROMPTS, REFINE_SUGGESTIONS } from '@/constants';
import styles from './PromptInput.module.scss';

type Mode = 'refine' | 'new';

interface PromptInputProps {
  value: string;
  onChange: (v: string) => void;
  onGenerate: () => void;
  onRefine: () => void;
  onChipSelect: (prompt: string) => void;
  loading: boolean;
  hasScene: boolean;
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor">
      <path d="M8 1.5l1.55 4.1 4.1 1.55-4.1 1.55L8 12.8 6.45 8.7l-4.1-1.55 4.1-1.55L8 1.5z" />
      <path d="M13 11l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z" opacity="0.7" />
    </svg>
  );
}

export default function PromptInput({
  value,
  onChange,
  onGenerate,
  onRefine,
  onChipSelect,
  loading,
  hasScene,
}: PromptInputProps) {
  const [mode, setMode] = useState<Mode>(hasScene ? 'refine' : 'new');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Adjust mode during render (not in an effect) when props change:
  // once a scene exists — or a generation just finished — the scene on canvas
  // is the new baseline, so refining it becomes the natural next step.
  const [prevHasScene, setPrevHasScene] = useState(hasScene);
  if (prevHasScene !== hasScene) {
    setPrevHasScene(hasScene);
    setMode(hasScene ? 'refine' : 'new');
  }
  const [prevLoading, setPrevLoading] = useState(loading);
  if (prevLoading !== loading) {
    setPrevLoading(loading);
    if (!loading && hasScene) setMode('refine');
  }

  const refining = hasScene && mode === 'refine';

  function submit() {
    if (loading || !value.trim()) return;
    if (refining) {
      onRefine();
    } else {
      onGenerate();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function handleChip(chip: string) {
    if (refining) {
      // Refinement ideas fill the input so the user stays in control
      onChange(chip);
      textareaRef.current?.focus();
    } else {
      onChipSelect(chip);
    }
  }

  const placeholder = refining
    ? 'Describe a change — “add a comet”, “make it darker”…'
    : 'Describe a scene — “a neon city in the rain”…';

  const chips = refining ? REFINE_SUGGESTIONS : SUGGESTION_PROMPTS;
  const showChips = value.trim() === '';

  return (
    <form
      className={styles.dock}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {hasScene && (
        <div className={styles.modeRow} role="group" aria-label="What to do next">
          <button
            type="button"
            className={`${styles.modeBtn}${mode === 'refine' ? ` ${styles.modeActive}` : ''}`}
            aria-pressed={mode === 'refine'}
            onClick={() => setMode('refine')}
            disabled={loading}
          >
            Refine this scene
          </button>
          <button
            type="button"
            className={`${styles.modeBtn}${mode === 'new' ? ` ${styles.modeActive}` : ''}`}
            aria-pressed={mode === 'new'}
            onClick={() => setMode('new')}
            disabled={loading}
          >
            Start new
          </button>
        </div>
      )}

      <div className={styles.inputRow}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={refining ? 'Refinement instruction' : 'Scene description'}
          rows={2}
          disabled={loading}
        />
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading || !value.trim()}
          aria-label={refining ? 'Refine scene' : 'Generate scene'}
        >
          <SparkleIcon />
          <span>{refining ? 'Refine' : 'Generate'}</span>
        </button>
      </div>

      {showChips && (
        <div className={styles.chipsRow}>
          <span className={styles.chipsLabel} id="chips-label">
            {refining ? 'Quick ideas' : 'Try one'}
          </span>
          <div className={styles.chips} aria-labelledby="chips-label">
            {chips.map((p) => (
              <button
                key={p}
                type="button"
                className={styles.chip}
                onClick={() => handleChip(p)}
                disabled={loading}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
