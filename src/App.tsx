import { useState, useEffect, useRef, useCallback } from 'react';
import type { HistoryEntry, SceneDefinition } from '@/types';
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

  // activeScene is the single source of truth for what's on the canvas.
  // It is set either by generation (via the scene effect below) or by handleLoad.
  // Using state ensures the render effect always has the correct scene when
  // palette changes, eliminating the race where setPalette would trigger the
  // effect with the generator's old scene rather than the loaded entry's scene.
  const [activeScene, setActiveScene] = useState<SceneDefinition | null>(null);

  const lastPromptRef = useRef('');

  // Adopt generator output as the active scene
  useEffect(() => {
    if (!scene) return;
    setActiveScene(scene);
    setHasScene(true);
    addEntry(lastPromptRef.current, scene);
  }, [scene, addEntry]);

  // Re-render PIXI whenever the active scene or palette changes
  useEffect(() => {
    if (!activeScene) return;
    renderScene(activeScene, controls.palette?.colors ?? null);
  }, [activeScene, controls.palette, renderScene]);

  // Apply speed/zoom to PIXI without re-rendering scene objects
  useEffect(() => {
    applyControls(controls.speedMult, controls.zoom);
  }, [controls.speedMult, controls.zoom, applyControls]);

  const handleGenerate = useCallback(() => {
    lastPromptRef.current = prompt;
    setSpeedMult(1);
    setZoom(1);
    setPalette(PALETTES[0]);
    void generate(prompt);
  }, [generate, prompt, setSpeedMult, setZoom, setPalette]);

  const handleLoad = useCallback(
    (entry: HistoryEntry) => {
      setSpeedMult(1);
      setZoom(1);
      setPalette(PALETTES[0]);
      setActiveScene(entry.scene);
      setPrompt(entry.prompt);
      lastPromptRef.current = entry.prompt;
      setHasScene(true);
    },
    [setSpeedMult, setZoom, setPalette],
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
          <SceneJSON scene={activeScene} />
          <StatusLog loading={loading} error={error} stepLabel={stepLabel} progress={progress} />
        </Panel>
      </main>
      {showHowItWorks && <HowItWorksModal onClose={() => setShowHowItWorks(false)} />}
    </div>
  );
}
