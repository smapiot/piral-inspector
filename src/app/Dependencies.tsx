import { useState, useEffect, Fragment, FC } from 'react';
import { jsx } from '@emotion/core';
import ReactFlow, { ReactFlowProvider, isNode } from 'react-flow-renderer';
import * as dagre from 'dagre';
import { v4 as uuid } from 'uuid';
import { getDependencyMap } from './commands';
import { useStore } from './store';

interface ExtensionItemProps {
  dependencies: Record<string, string[]>;
}

const DisplayDependencies: FC<ExtensionItemProps> = ({ dependencies }) => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const position = { x: 0, y: 0 };
  const edgeType = 'smoothstep';
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 172;
  const nodeHeight = 36;

  function getData() {
    let nonDuplicatedDependencies: Array<string> = [];

    Object.keys(dependencies).map(pilet =>
      dependencies[pilet].map(dep => nonDuplicatedDependencies.push(dep.resolved || dep)),
    );

    const allDependencies = nonDuplicatedDependencies.filter((v, i, a) => a.indexOf(v) === i);

    const initialElements = [
      {
        id: 'Piral',
        data: { label: 'Piral' },
        position,
      },
      ...Object.keys(dependencies).map(pilet => ({
        id: pilet,
        type: 'input',
        data: { label: pilet },
        position,
      })),
      ...Object.keys(dependencies).map(pilet => ({
        id: pilet,
        source: 'Piral',
        target: pilet,
        type: edgeType,
        animated: true,
      })),
      ...allDependencies.map(depName => ({
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
          labelBgStyle: { fill: '#FFCC00', fillOpacity: 0.7 }
        })),
      ),
    ];

    const layoutedElements = getLayoutedElements(initialElements);
    setElements(layoutedElements);
  }

  const getLayoutedElements = elements => {
    dagreGraph.setGraph({ rankdir: 'TB' });

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

  return (
    <ReactFlowProvider>
      <ReactFlow className="react-flow" elements={elements} connectionLineType="smoothstep" />
    </ReactFlowProvider>
  );
};

export interface DependenciesProps { }

export const Dependencies: FC<DependenciesProps> = () => {
  const dependencies = useStore(m => m.state.dependencyMap);

  useEffect(() => {
    getDependencyMap();
  }, []);

  return (
    <Fragment>{Object.keys(dependencies).length >= 1 && <DisplayDependencies dependencies={dependencies} />}</Fragment>
  );
};
