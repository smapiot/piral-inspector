import * as dagre from 'dagre';
import ReactFlow, { ReactFlowProvider, isNode, Node, Connection, Edge } from 'react-flow-renderer';
import { useState, useEffect, FC, useRef } from 'react';
import { jsx } from '@emotion/core';
import { getDependencyMap } from './commands';
import { DependencyMap, DependencyRelation, useStore } from './store';

interface PiletDependencyRelation extends DependencyRelation {
  pilet: string;
}

interface DisplayDependenciesProps {
  dependencies: DependencyMap;
}

const edgeType = 'smoothstep';
const nodeWidth = 172;
const nodeHeight = 36;
const position = { x: 0, y: 0 };

function getLayoutedElements(dagreGraph: dagre.graphlib.Graph<{}>, elements: Array<Node | Connection | Edge>) {
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
}

const DisplayDependencies: FC<DisplayDependenciesProps> = ({ dependencies }) => {
  const [elements, setElements] = useState([]);
  let height = screen.height - screen.height * 0.2;

  useEffect(() => {
    const dagreGraph = new dagre.graphlib.Graph();
    const piletNames: Array<string> = [];
    const dependencyNames: Array<string> = [];
    const dependencyRelations: Array<PiletDependencyRelation> = [];

    for (const pilet of Object.keys(dependencies)) {
      for (const dependency of dependencies[pilet]) {
        const dep = typeof dependency === 'string' ? { resolved: dependency, demanded: dependency } : dependency;

        if (!dependencyNames.includes(dep.resolved)) {
          dependencyNames.push(dep.resolved);
        }

        dependencyRelations.push({ ...dep, pilet });
      }

      piletNames.push(pilet);
    }

    const initialElements = [
      {
        id: 'Piral',
        data: { label: 'Piral' },
        position,
      },
      ...piletNames.map(pilet => ({
        id: pilet,
        type: 'input',
        data: { label: pilet },
        position,
      })),
      ...piletNames.map(pilet => ({
        id: pilet,
        source: 'Piral',
        target: pilet,
        type: edgeType,
        animated: true,
      })),
      ...dependencyNames.map(depName => ({
        id: depName,
        type: 'output',
        data: { label: depName },
        position,
      })),
      ...dependencyRelations.map(dep => ({
        id: `${dep.pilet}/${dep.resolved}/${dep.demanded}`,
        source: dep.pilet,
        target: dep.resolved,
        type: 'straight',
        animated: false,
        label: dep.demanded,
        labelBgStyle: { fill: '#FFCC00', fillOpacity: 0.7 },
      })),
    ];

    dagreGraph.setDefaultEdgeLabel(() => ({}));
    setElements(getLayoutedElements(dagreGraph, initialElements));
  }, [dependencies]);

  const style = {
    height: `${height}px`,
  };

  return (
    <ReactFlowProvider>
      <ReactFlow className="react-flow" elements={elements} connectionLineType="smoothstep" />
    </ReactFlowProvider>
  );
};

export interface DependenciesProps {
  active: boolean;
}

export const Dependencies: FC<DependenciesProps> = ({ active }) => {
  const dependencies = useStore(m => m.state.dependencyMap);

  useEffect(() => {
    if (active) {
      getDependencyMap();
    }
  }, [active]);

  return <DisplayDependencies dependencies={dependencies} />;
};
