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
import { PALETTES } from '@/constants';
import { slugify } from '@/utils';
import styles from './App.module.scss';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { renderScene, applyControls } = usePixi(canvasRef);
  const { controls, setSpeedMult, setZoom, setPalette } = useControls();
  const { history, addEntry, clearHistory, selectedIds, toggleSelect, clearSelection, getRemixPrompt } =
    useHistory();
  const { scene, loading, error, stepLabel, progress, generate } = useSceneGenerator();

  const [prompt, setPrompt] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [hasScene, setHasScene] = useState(false);

  const lastPromptRef = useRef('');

  // Re-render PIXI scene when scene data or palette changes
  useEffect(() => {
    if (!scene) return;
    renderScene(scene, controls.palette?.colors ?? null);
  }, [scene, controls.palette, renderScene]);

  // Apply speed/zoom to PIXI without re-rendering scene objects
  useEffect(() => {
    applyControls(controls.speedMult, controls.zoom);
  }, [controls.speedMult, controls.zoom, applyControls]);

  // Track new scenes in history
  useEffect(() => {
    if (!scene) return;
    setHasScene(true);
    addEntry(lastPromptRef.current, scene);
  }, [scene, addEntry]);

  const handleGenerate = useCallback(() => {
    lastPromptRef.current = prompt;
    // Reset controls to defaults for every new generation
    setSpeedMult(1);
    setZoom(1);
    setPalette(PALETTES[0]);
    void generate(prompt);
  }, [generate, prompt, setSpeedMult, setZoom, setPalette]);

  const handleLoad = useCallback(
    (entry: HistoryEntry) => {
      // Reset controls when restoring a history entry
      setSpeedMult(1);
      setZoom(1);
      setPalette(PALETTES[0]);
      renderScene(entry.scene, null);
      setPrompt(entry.prompt);
      lastPromptRef.current = entry.prompt;
      setHasScene(true);
    },
    [renderScene, setSpeedMult, setZoom, setPalette],
  );

  const handleRemix = useCallback(() => {
    const blendedPrompt = getRemixPrompt();
    if (!blendedPrompt) return;
    setPrompt(blendedPrompt);
    lastPromptRef.current = blendedPrompt;
    clearSelection();
    setSpeedMult(1);
    setZoom(1);
    setPalette(PALETTES[0]);
    void generate(blendedPrompt);
  }, [getRemixPrompt, clearSelection, generate, setSpeedMult, setZoom, setPalette]);

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
            onClearHistory={clearHistory}
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
