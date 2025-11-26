import React from 'react';
import { useResizable } from 'react-resizable-layout';
import Splitter from './Splitter';
import Explorer from './Explorer';
import StepsLibrary from './StepsLibrary';
import Terminal from './Terminal';
import TestCaseEditor from './TestCaseEditor';
import '../styles/IdeClone.css';

const IdeClone = () => {
  // Terminal panel (bottom)
  const {
    isDragging: isTerminalDragging,
    position: terminalHeight,
    splitterProps: terminalSplitterProps,
  } = useResizable({
    axis: 'y',
    initial: 200,
    min: 100,
    max: 600,
    reverse: true,
  });

  // Explorer panel (left)
  const {
    isDragging: isExplorerDragging,
    position: explorerWidth,
    splitterProps: explorerSplitterProps,
  } = useResizable({
    axis: 'x',
    initial: 280,
    min: 150,
    max: 500,
  });

  // Steps Library panel (right)
  const {
    isDragging: isStepsDragging,
    position: stepsWidth,
    splitterProps: stepsSplitterProps,
  } = useResizable({
    axis: 'x',
    initial: 250,
    min: 150,
    max: 500,
    reverse: true,
  });

  return (
    <div className="flex flex-column h-screen bg-dark font-mono color-white overflow-hidden">
      {/* Main content area */}
      <div className="flex grow">
        {/* Explorer Panel */}
        <div className={`shrink-0 ${isExplorerDragging ? 'panel-dragging' : ''}`} style={{ width: explorerWidth }}>
          <Explorer />
        </div>

        {/* Splitter for Explorer */}
        <Splitter orientation="vertical" isDragging={isExplorerDragging} {...explorerSplitterProps} />

        {/* Center content area */}
        <div className="flex grow">
          {/* Test Case Editor */}
          <div className="grow bg-darker">
            <TestCaseEditor />
          </div>

          {/* Splitter for Steps Library */}
          <Splitter orientation="vertical" isDragging={isStepsDragging} {...stepsSplitterProps} />

          {/* Steps Library Panel */}
          <div className={`shrink-0 ${isStepsDragging ? 'panel-dragging' : ''}`} style={{ width: stepsWidth }}>
            <StepsLibrary />
          </div>
        </div>
      </div>

      {/* Horizontal Splitter for Terminal */}
      <Splitter orientation="horizontal" isDragging={isTerminalDragging} {...terminalSplitterProps} />

      {/* Terminal Panel */}
      <div
        className={`shrink-0 bg-darker ${isTerminalDragging ? 'panel-dragging' : ''}`}
        style={{ height: terminalHeight }}
      >
        <Terminal />
      </div>
    </div>
  );
};

export default IdeClone;
