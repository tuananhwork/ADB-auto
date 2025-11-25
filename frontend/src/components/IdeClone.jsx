import React from 'react';
import { useResizable } from 'react-resizable-layout';
import { cn } from '../utils/cn';
import SampleSplitter from './SampleSplitter';
import Explorer from './Explorer';
import StepsLibrary from './StepsLibrary';
import Terminal from './Terminal';
import TestCaseEditor from './TestCaseEditor';

const IdeClone = () => {
  const {
    isDragging: isTerminalDragging,
    position: terminalH,
    splitterProps: terminalDragBarProps,
  } = useResizable({
    axis: 'y',
    initial: 150,
    min: 50,
    reverse: true,
  });

  const {
    isDragging: isFileDragging,
    position: fileW,
    splitterProps: fileDragBarProps,
  } = useResizable({
    axis: 'x',
    initial: 250,
    min: 50,
  });

  const {
    isDragging: isPluginDragging,
    position: pluginW,
    splitterProps: pluginDragBarProps,
  } = useResizable({
    axis: 'x',
    initial: 200,
    min: 50,
    reverse: true,
  });

  return (
    <div className={'flex flex-column h-screen bg-dark font-mono color-white overflow-hidden'}>
      <div className={'flex grow'}>
        <div className={cn('shrink-0 contents', isFileDragging && 'dragging')} style={{ width: fileW }}>
          <Explorer />
        </div>
        <SampleSplitter isDragging={isFileDragging} {...fileDragBarProps} />
        <div className={'flex grow'}>
          <div className={'grow bg-darker contents'}>
            <TestCaseEditor />
          </div>
          <SampleSplitter isDragging={isPluginDragging} {...pluginDragBarProps} />
          <div className={cn('shrink-0 contents', isPluginDragging && 'dragging')} style={{ width: pluginW }}>
            <StepsLibrary />
          </div>
        </div>
      </div>
      <SampleSplitter dir={'horizontal'} isDragging={isTerminalDragging} {...terminalDragBarProps} />
      <div
        className={cn('shrink-0 bg-darker contents', isTerminalDragging && 'dragging')}
        style={{ height: terminalH }}
      >
        <Terminal />
      </div>
    </div>
  );
};

export default IdeClone;
