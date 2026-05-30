import { useState, useCallback } from 'react';
import type { SceneDefinition } from '@/types';
import { syntaxHighlight } from '@/utils';
import styles from './SceneJSON.module.scss';

interface SceneJSONProps {
  scene: SceneDefinition | null;
}

export default function SceneJSON({ scene }: SceneJSONProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!scene) return;
    void navigator.clipboard.writeText(JSON.stringify(scene, null, 2)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [scene]);

  if (!scene) return null;

  return (
    <div className={styles.sceneJson}>
      <div className={styles.jsonHeader}>
        <button
          className={styles.toggleBtn}
          onClick={() => setIsExpanded((v) => !v)}
          aria-expanded={isExpanded}
        >
          <span className={styles.label}>Scene JSON</span>
          <span className={styles.chevron}>{isExpanded ? '▲' : '▼'}</span>
        </button>
        {isExpanded && (
          <button
            className={`${styles.copyBtn}${copied ? ` ${styles.copied}` : ''}`}
            onClick={handleCopy}
          >
            {copied ? 'COPIED ✓' : 'COPY'}
          </button>
        )}
      </div>
      {isExpanded && (
        <div
          className={styles.jsonBlock}
          // syntaxHighlight escapes HTML before wrapping in <span> tags — safe
          dangerouslySetInnerHTML={{ __html: syntaxHighlight(scene) }}
        />
      )}
    </div>
  );
}
