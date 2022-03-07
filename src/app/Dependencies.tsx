import { useState, useCallback, useEffect } from 'react';
import { jsx } from '@emotion/core';
import ReactFlow, { ReactFlowProvider, addEdge, removeElements, isNode } from 'react-flow-renderer';
import * as dagre from 'dagre';
import { v4 as uuid } from 'uuid';
import { getDependencyMap } from './commands';
import { useStore } from './store';

export const Dependencies = () => {
  const position = { x: 0, y: 0 };
  const edgeType = 'smoothstep';
  const test = useStore(m => m.state.dependencyMap);

  const dependencies = {
    pilet1: ['react-router', 'react', 'foo@1.2.3'],
    pilet2: ['react', 'foo@1.2.3'],
  };

  console.log(test)
  console.log(dependencies)

  // const dependencies = {
  //   pilet1: [{ desired: 'react-router', resolved: 'react-router' }, { desired: 'react', resolved: 'react' }, { desired: 'foo@1.2.3', resolved: 'foo@1.2.3' }],
  //   pilet2: [{ desired: 'react', resolved: 'react' }, { desired: 'foo@1.2.3', resolved: 'foo@1.2.3' }],
  // };

  let nonDuplicatedDependencies = [];

  const initialElements = [
    {
      id: 'Piral',
      data: { label: 'Piral' },
      position,
    },
    ...Object.keys(dependencies).map(
      pilet => (
        dependencies[pilet].map(dep => nonDuplicatedDependencies.push(dep.resolved || dep)),
        {
          id: pilet,
          type: 'input',
          data: { label: pilet },
          position,
        }
      ),
    ),
    ...Object.keys(dependencies).map(pilet => ({
      id: pilet,
      source: 'Piral',
      target: pilet,
      type: edgeType,
      animated: true,
    })),
    ...Array.from(new Set(nonDuplicatedDependencies)).map(depName => ({
      id: depName,
      type: 'output',
      data: { label: depName },
      position,
    })),
    ...Object.keys(dependencies).flatMap(pilet =>
      dependencies[pilet].map(depName => ({
        id: uuid(),
        source: pilet,
        target: depName.resolved || depName,
        type: 'straight',
        animated: false,
        label: depName.resolved || depName,
      })),
    ),
  ];

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 172;
  const nodeHeight = 36;

  const getLayoutedElements = (elements, direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    elements.forEach(el => {
      if (isNode(el)) {
        dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
      } else {
        dagreGraph.setEdge(el.source, el.target);
      }
    });

    dagre.layout(dagreGraph);

    return elements.map(el => {
      if (isNode(el)) {
        const nodeWithPosition = dagreGraph.node(el.id);
        el.position = {
          x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
          y: nodeWithPosition.y - nodeHeight / 2,
        };
      }
      return el;
    });
  };

  const layoutedElements = getLayoutedElements(initialElements);

  const [elements, setElements] = useState(layoutedElements);
  const onConnect = params => setElements(els => addEdge({ ...params, type: 'smoothstep', animated: true }, els));
  const onElementsRemove = elementsToRemove => setElements(els => removeElements(elementsToRemove, els));

  useEffect(() => {
    getDependencyMap();
  }, []);

  return (
    <ReactFlowProvider>
      <ReactFlow
        className="react-flow"
        elements={elements}
        onConnect={onConnect}
        onElementsRemove={onElementsRemove}
        connectionLineType="smoothstep"
      />
    </ReactFlowProvider>
  );
};
