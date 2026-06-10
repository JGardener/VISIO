import { useState, useEffect, useRef, useCallback } from "react";
import type { HistoryEntry, SceneDefinition } from "@/types";
import { useControls, useHistory, useSceneGenerator, usePixi } from "@/hooks";
import {
  Header,
  SceneCanvas,
  Panel,
  PromptInput,
  StatusLog,
  SceneJSON,
  HistoryPanel,
  ControlsBar,
  HowItWorksModal,
} from "@/components";
import type { AppStatus } from "@/components/Header/Header";
import { PALETTES, DEFAULT_SCENE } from "@/constants";
import { slugify } from "@/utils";
import styles from "./App.module.scss";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { renderScene, applyControls } = usePixi(canvasRef);
  const { controls, setSpeedMult, setPalette } = useControls();
  const {
    history,
    addEntry,
    clearHistory,
    selectedIds,
    toggleSelect,
    clearSelection,
    getRemixPrompt,
  } = useHistory();
  const { loading, error, stepLabel, progress, streamBuffer, generate } = useSceneGenerator();

  const [prompt, setPrompt] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [hasScene, setHasScene] = useState(false);

  // activeScene is the single source of truth for what's on the canvas.
  // It is set either by a finished generation (runGeneration) or by handleLoad.
  // Using state ensures the render effect always has the correct scene when
  // palette changes, eliminating the race where setPalette would trigger the
  // effect with the generator's old scene rather than the loaded entry's scene.
  const [activeScene, setActiveScene] = useState<SceneDefinition | null>(DEFAULT_SCENE);

  // Re-render PIXI whenever the active scene or palette changes
  useEffect(() => {
    if (!activeScene) return;
    renderScene(activeScene, controls.palette?.colors ?? null);
  }, [activeScene, controls.palette, renderScene]);

  // Re-render scene content when window resizes (canvas size changes via resizeTo,
  // but element positions are computed at render time so need a fresh render)
  useEffect(() => {
    if (!activeScene) return;
    let timer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        renderScene(activeScene, controls.palette?.colors ?? null);
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [activeScene, controls.palette, renderScene]);

  // Apply speed to PIXI without re-rendering scene objects
  useEffect(() => {
    applyControls(controls.speedMult);
  }, [controls.speedMult, applyControls]);

  // Single path for every generation: resets controls, runs the request,
  // and on success adopts the result as the active scene + history entry.
  const runGeneration = useCallback(
    async (requestPrompt: string, currentScene?: SceneDefinition) => {
      setLastPrompt(requestPrompt);
      setSpeedMult(1);
      setPalette(PALETTES[0]);
      const result = await generate(requestPrompt, currentScene);
      if (result) {
        setActiveScene(result);
        setHasScene(true);
        setPrompt("");
        addEntry(requestPrompt, result);
      }
    },
    [generate, setSpeedMult, setPalette, addEntry],
  );

  const handleGenerate = useCallback(() => {
    void runGeneration(prompt);
  }, [runGeneration, prompt]);

  const handleRefine = useCallback(() => {
    if (!activeScene) return;
    void runGeneration(prompt, activeScene);
  }, [runGeneration, prompt, activeScene]);

  const handleChipSelect = useCallback(
    (chipPrompt: string) => {
      setPrompt(chipPrompt);
      void runGeneration(chipPrompt);
    },
    [runGeneration],
  );

  const handleRemix = useCallback(() => {
    const blendedPrompt = getRemixPrompt();
    if (!blendedPrompt) return;
    setPrompt(blendedPrompt);
    clearSelection();
    setPanelOpen(false);
    void runGeneration(blendedPrompt);
  }, [getRemixPrompt, clearSelection, runGeneration]);

  const handleLoad = useCallback(
    (entry: HistoryEntry) => {
      setSpeedMult(1);
      setPalette(PALETTES[0]);
      setActiveScene(entry.scene);
      setPrompt("");
      setLastPrompt(entry.prompt);
      setHasScene(true);
      setPanelOpen(false);
    },
    [setSpeedMult, setPalette],
  );

  const appStatus: AppStatus = error
    ? 'error'
    : loading
      ? 'streaming'
      : hasScene
        ? 'ready'
        : 'idle';

  return (
    <div className={styles.app}>
      <SceneCanvas
        canvasRef={canvasRef}
        hasScene={hasScene}
        sceneLabel={lastPrompt || 'ambient particles'}
      />
      <Header
        hasScene={hasScene}
        promptSlug={slugify(lastPrompt || "visio")}
        canvasRef={canvasRef}
        onHowItWorks={() => setShowHowItWorks(true)}
        onOpenLibrary={() => setPanelOpen(true)}
        libraryOpen={panelOpen}
        libraryCount={history.length}
        status={appStatus}
      />
      <main className={styles.dockArea}>
        <ControlsBar
          visible={hasScene}
          speedMult={controls.speedMult}
          palette={controls.palette}
          onSpeedMult={setSpeedMult}
          onPalette={setPalette}
        />
        <div className={styles.dock}>
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onGenerate={handleGenerate}
            onRefine={handleRefine}
            onChipSelect={handleChipSelect}
            loading={loading}
            hasScene={hasScene}
          />
          <StatusLog
            loading={loading}
            error={error}
            stepLabel={stepLabel}
            progress={progress}
          />
        </div>
      </main>
      <Panel isOpen={panelOpen} onClose={() => setPanelOpen(false)} title="Library">
        <HistoryPanel
          history={history}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onClearSelection={clearSelection}
          onClearHistory={clearHistory}
          onRemix={handleRemix}
          onLoad={handleLoad}
        />
        <SceneJSON scene={activeScene} streamBuffer={streamBuffer} />
      </Panel>
      {showHowItWorks && (
        <HowItWorksModal onClose={() => setShowHowItWorks(false)} />
      )}
    </div>
  );
}
