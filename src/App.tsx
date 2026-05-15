import { useState, useEffect, useRef, useCallback } from 'react';
import type { HistoryEntry } from '@/types';
import { useControls, useHistory, useSceneGenerator, usePixi } from '@/hooks';
import {
  Header,
  SceneCanvas,
  Panel,
  PromptInput,
  StatusLog,
  SceneJSON,
  HistoryPanel,
  HowItWorksModal,
} from '@/components';
import { slugify } from '@/utils';
import styles from './App.module.scss';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { renderScene } = usePixi(canvasRef);
  const { controls, setSpeedMult, setZoom, setPalette } = useControls();
  const { history, addEntry, selectedIds, toggleSelect, clearSelection, getRemixScene, getRemixPrompt } =
    useHistory();
  const { scene, loading, error, stepLabel, progress, generate } = useSceneGenerator();

  const [prompt, setPrompt] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [hasScene, setHasScene] = useState(false);

  const lastPromptRef = useRef('');

  // Re-render PIXI scene whenever scene data or controls change
  useEffect(() => {
    if (!scene) return;
    renderScene(scene, controls);
  }, [scene, controls, renderScene]);

  // Track new scenes for history (fires only when scene reference changes)
  useEffect(() => {
    if (!scene) return;
    setHasScene(true);
    addEntry(lastPromptRef.current, scene);
  }, [scene, addEntry]);

  const handleGenerate = useCallback(() => {
    lastPromptRef.current = prompt;
    void generate(prompt);
  }, [generate, prompt]);

  const handleLoad = useCallback(
    (entry: HistoryEntry) => {
      renderScene(entry.scene, controls);
      setPrompt(entry.prompt);
      setHasScene(true);
    },
    [renderScene, controls],
  );

  const handleRemix = useCallback(() => {
    const remixScene = getRemixScene();
    if (!remixScene) return;
    renderScene(remixScene, controls);
    addEntry(getRemixPrompt(), remixScene);
    clearSelection();
    setHasScene(true);
  }, [getRemixScene, getRemixPrompt, renderScene, controls, addEntry, clearSelection]);

  return (
    <div className={styles.app}>
      <Header
        hasScene={hasScene}
        promptSlug={slugify(lastPromptRef.current || 'visio')}
        canvasRef={canvasRef}
        onHowItWorks={() => setShowHowItWorks(true)}
      />
      <main className={styles.main}>
        <SceneCanvas
          canvasRef={canvasRef}
          hasScene={hasScene}
          onOpenPanel={() => setPanelOpen(true)}
          controls={controls}
          onSpeedMult={setSpeedMult}
          onZoom={setZoom}
          onPalette={setPalette}
        />
        <Panel isOpen={panelOpen} onClose={() => setPanelOpen(false)}>
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onGenerate={handleGenerate}
            loading={loading}
          />
          <HistoryPanel
            history={history}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onClearSelection={clearSelection}
            onRemix={handleRemix}
            onLoad={handleLoad}
          />
          <SceneJSON scene={scene} />
          <StatusLog loading={loading} error={error} stepLabel={stepLabel} progress={progress} />
        </Panel>
      </main>
      {showHowItWorks && <HowItWorksModal onClose={() => setShowHowItWorks(false)} />}
    </div>
  );
}
