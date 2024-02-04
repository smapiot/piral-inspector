import * as dagre from 'dagre';
import { jsx } from '@emotion/core';
import ReactFlow, { ReactFlowProvider, isNode, Node, Connection, Edge, ReactFlowInstance } from 'react-flow-renderer';
import { useState, useEffect, FC } from 'react';
import { getDependencyMap } from './commands';
import { DependencyMap, DependencyRelation, useStore } from './store';
import { reactFlowContainer } from './styles';

interface PiletDependencyRelation extends DependencyRelation {
  pilet: string;
}

interface DisplayDependenciesProps {
  dependencies: DependencyMap;
  appName: string;
  layout: 'TB' | 'LR';
}

const nodeWidth = 240;
const nodeHeight = 80;
const position = { x: 0, y: 0 };

function getLayoutedElements(
  dagreGraph: dagre.graphlib.Graph<{}>,
  elements: Array<Node | Connection | Edge>,
  rankdir: 'TB' | 'LR',
) {
  dagreGraph.setGraph({ rankdir, nodesep: 100, edgesep: 30, ranksep: 500 });

  elements.forEach(el => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, {
        width: nodeWidth,
        height: nodeHeight,
      });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);

  return elements.map(el => {
    if (isNode(el)) {
      const node = dagreGraph.node(el.id);
      el.position = {
        x: node.x - nodeWidth / 2,
        y: node.y - nodeHeight / 2,
      };
    }
    return el;
  });
}

const DisplayDependencies: FC<DisplayDependenciesProps> = ({ appName, dependencies, layout }) => {
  const [elements, setElements] = useState<Array<Node | Connection | Edge>>([]);
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance>(undefined);

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
        id: '$@',
        data: { label: appName },
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
        source: '$@',
        target: pilet,
        type: 'straight',
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
    setElements(getLayoutedElements(dagreGraph, initialElements, layout));
  }, [dependencies, layout]);

  useEffect(() => {
    flowInstance?.fitView();
  }, [elements]);

  return (
    <ReactFlowProvider>
      <ReactFlow
        onInit={setFlowInstance}
        className="react-flow"
        elements={elements}
        connectionLineType="smoothstep"
        nodesConnectable={false}
      />
    </ReactFlowProvider>
  );
};

export interface DependenciesProps {
  active: boolean;
}

function getCurrentLayout(): 'TB' | 'LR' {
  return document.body.clientWidth >= document.body.clientHeight ? 'TB' : 'LR';
}

export const Dependencies: FC<DependenciesProps> = ({ active }) => {
  const appName = useStore(m => m.state.name);
  const dependencies = useStore(m => m.state.dependencyMap);
  const [layout, setLayout] = useState(getCurrentLayout);

  useEffect(() => {
    if (active) {
      const handler = () => setLayout(getCurrentLayout);
      window.addEventListener('resize', handler);

      getDependencyMap();

      return () => {
        window.removeEventListener('resize', handler);
      };
    }
  }, [active]);

  return (
    <div css={reactFlowContainer}>
      <DisplayDependencies appName={appName} dependencies={dependencies} layout={layout} />
    </div>
  );
};
