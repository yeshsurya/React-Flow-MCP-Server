import { z } from 'zod';
import { cache } from '../../utils/cache.js';
import { logInfo } from '../../utils/logger.js';

export const schema = {
  exampleType: z.string().describe('Type of example (e.g., "basic-flow", "custom-node", "drag-and-drop")')
};

export async function handleGetExample(params: { exampleType: string }) {
  const { exampleType } = params;

  logInfo(`Getting React Flow example: ${exampleType}`);

  const cacheKey = `react-flow-example-${exampleType.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const exampleInfo = getExampleInfo(exampleType);

  cache.set(cacheKey, exampleInfo, 30 * 60 * 1000);

  return exampleInfo;
}

function getExampleInfo(exampleType: string) {
  const examples: Record<string, any> = {
    'basic-flow': {
      name: 'Basic Flow',
      description: 'A simple React Flow setup with nodes, edges, and basic interactivity.',
      tags: ['beginner', 'setup', 'nodes', 'edges'],
      code: `import { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
  { id: '3', position: { x: 200, y: 50 }, data: { label: 'Node 3' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

export default function BasicFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}`
    },

    'custom-node': {
      name: 'Custom Node',
      description: 'Creating a custom node component with handles and custom styling.',
      tags: ['intermediate', 'custom', 'nodes', 'handles'],
      code: `import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

type CustomNodeData = {
  label: string;
  value: number;
};

const CustomNode = memo(({ data, isConnectable }: NodeProps<CustomNodeData>) => {
  return (
    <div className="custom-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="custom-node__header">{data.label}</div>
      <div className="custom-node__body">
        Value: <strong>{data.value}</strong>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={{ left: 'auto', right: 10 }}
        isConnectable={isConnectable}
      />
    </div>
  );
});

export default CustomNode;

// Usage in your flow:
// const nodeTypes = { custom: CustomNode };
// <ReactFlow nodeTypes={nodeTypes} ... />
// Node: { id: '1', type: 'custom', data: { label: 'My Node', value: 42 }, position: { x: 0, y: 0 } }

// CSS:
/*
.custom-node {
  padding: 10px;
  border-radius: 5px;
  background: white;
  border: 1px solid #ddd;
  min-width: 150px;
}

.custom-node__header {
  font-weight: bold;
  margin-bottom: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}
*/`
    },

    'custom-edge': {
      name: 'Custom Edge',
      description: 'Creating a custom edge with a button to delete the connection.',
      tags: ['intermediate', 'custom', 'edges'],
      code: `import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: \`translate(-50%, -50%) translate(\${labelX}px,\${labelY}px)\`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <button className="edge-button" onClick={onEdgeClick}>
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

// Usage:
// const edgeTypes = { custom: CustomEdge };
// <ReactFlow edgeTypes={edgeTypes} ... />
// Edge: { id: 'e1-2', source: '1', target: '2', type: 'custom' }`
    },

    'drag-and-drop': {
      name: 'Drag and Drop',
      description: 'Adding nodes via drag and drop from a sidebar.',
      tags: ['intermediate', 'drag-drop', 'add-nodes'],
      code: `import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type OnConnect,
} from '@xyflow/react';

let id = 0;
const getId = () => \`dndnode_\${id++}\`;

function DnDFlow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: \`\${type} node\` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  return (
    <div className="dndflow">
      <div className="sidebar">
        <div
          className="dndnode"
          onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'default')}
          draggable
        >
          Default Node
        </div>
        <div
          className="dndnode input"
          onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'input')}
          draggable
        >
          Input Node
        </div>
        <div
          className="dndnode output"
          onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'output')}
          draggable
        >
          Output Node
        </div>
      </div>
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        />
      </div>
    </div>
  );
}

export default function () {
  return (
    <ReactFlowProvider>
      <DnDFlow />
    </ReactFlowProvider>
  );
}`
    },

    'sub-flows': {
      name: 'Sub Flows (Nested Nodes)',
      description: 'Creating nodes that contain other nodes using parent-child relationships.',
      tags: ['advanced', 'nested', 'groups', 'layout'],
      code: `import { ReactFlow, useNodesState, useEdgesState, type Node } from '@xyflow/react';

const initialNodes: Node[] = [
  {
    id: 'group-1',
    type: 'group',
    position: { x: 0, y: 0 },
    style: { width: 300, height: 200 },
    data: {},
  },
  {
    id: '1',
    position: { x: 20, y: 20 },
    data: { label: 'Child 1' },
    parentId: 'group-1',
    extent: 'parent',
  },
  {
    id: '2',
    position: { x: 150, y: 80 },
    data: { label: 'Child 2' },
    parentId: 'group-1',
    extent: 'parent',
  },
  {
    id: '3',
    position: { x: 400, y: 50 },
    data: { label: 'External Node' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

export default function SubFlows() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    />
  );
}

// The 'group' node type is built-in and renders a container
// Child nodes use 'parentId' to reference their parent
// 'extent: "parent"' constrains child movement to parent bounds`
    },

    'validation': {
      name: 'Connection Validation',
      description: 'Validating connections before they are created.',
      tags: ['intermediate', 'validation', 'connections'],
      code: `import { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  type IsValidConnection,
  type Node,
} from '@xyflow/react';

const initialNodes: Node[] = [
  { id: '1', type: 'input', position: { x: 0, y: 0 }, data: { label: 'Input' } },
  { id: '2', position: { x: 100, y: 100 }, data: { label: 'Process' } },
  { id: '3', type: 'output', position: { x: 200, y: 200 }, data: { label: 'Output' } },
];

export default function ValidationFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Validation function - return true to allow connection
  const isValidConnection: IsValidConnection = useCallback(
    (connection) => {
      // Prevent self-connections
      if (connection.source === connection.target) {
        return false;
      }

      // Only allow output nodes as final targets
      const targetNode = nodes.find((n) => n.id === connection.target);
      if (targetNode?.type === 'input') {
        return false;
      }

      // Check for cycles (simplified)
      const hasCycle = edges.some(
        (edge) =>
          edge.source === connection.target &&
          edge.target === connection.source
      );
      if (hasCycle) {
        return false;
      }

      return true;
    },
    [nodes, edges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      isValidConnection={isValidConnection}
      fitView
    />
  );
}`
    },

    'save-restore': {
      name: 'Save and Restore',
      description: 'Saving flow state to JSON and restoring it.',
      tags: ['intermediate', 'persistence', 'json'],
      code: `import { useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  addEdge,
  type OnConnect,
} from '@xyflow/react';

const flowKey = 'react-flow-state';

function SaveRestoreFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { setViewport, toObject } = useReactFlow();

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onSave = useCallback(() => {
    const flow = toObject();
    localStorage.setItem(flowKey, JSON.stringify(flow));
    console.log('Flow saved!');
  }, [toObject]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const stored = localStorage.getItem(flowKey);
      if (stored) {
        const flow = JSON.parse(stored);

        if (flow) {
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);
          if (flow.viewport) {
            setViewport(flow.viewport);
          }
        }
      }
    };

    restoreFlow();
  }, [setNodes, setEdges, setViewport]);

  const onClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  return (
    <div style={{ height: '100vh' }}>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 4 }}>
        <button onClick={onSave}>Save</button>
        <button onClick={onRestore}>Restore</button>
        <button onClick={onClear}>Clear</button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}

export default function () {
  return (
    <ReactFlowProvider>
      <SaveRestoreFlow />
    </ReactFlowProvider>
  );
}`
    },

    'resizable-node': {
      name: 'Resizable Node',
      description: 'Creating nodes that can be resized by users.',
      tags: ['intermediate', 'resize', 'custom-node'],
      code: `import { memo } from 'react';
import { Handle, Position, NodeResizer, type NodeProps } from '@xyflow/react';

const ResizableNode = memo(({ data, selected }: NodeProps) => {
  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
      />
      <Handle type="target" position={Position.Top} />
      <div style={{ padding: 10, height: '100%' }}>
        {data.label}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
});

export default ResizableNode;

// Usage:
// const nodeTypes = { resizable: ResizableNode };
// Node: { id: '1', type: 'resizable', data: { label: 'Resize me!' }, position: { x: 0, y: 0 }, style: { width: 180, height: 100 } }`
    },

    'toolbar-node': {
      name: 'Node with Toolbar',
      description: 'Adding a toolbar that appears when a node is selected.',
      tags: ['intermediate', 'toolbar', 'custom-node'],
      code: `import { memo, useCallback } from 'react';
import {
  Handle,
  Position,
  NodeToolbar,
  useReactFlow,
  type NodeProps,
} from '@xyflow/react';

const ToolbarNode = memo(({ id, data }: NodeProps) => {
  const { setNodes } = useReactFlow();

  const onDelete = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  const onDuplicate = useCallback(() => {
    setNodes((nodes) => {
      const node = nodes.find((n) => n.id === id);
      if (!node) return nodes;

      return [
        ...nodes,
        {
          ...node,
          id: \`\${id}-copy-\${Date.now()}\`,
          position: {
            x: node.position.x + 50,
            y: node.position.y + 50,
          },
        },
      ];
    });
  }, [id, setNodes]);

  return (
    <>
      <NodeToolbar isVisible={data.forceToolbarVisible || undefined}>
        <button onClick={onDuplicate}>Duplicate</button>
        <button onClick={onDelete}>Delete</button>
      </NodeToolbar>
      <Handle type="target" position={Position.Top} />
      <div className="toolbar-node">
        {data.label}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
});

export default ToolbarNode;`
    },

    'layout-elk': {
      name: 'Auto Layout with ELK',
      description: 'Using ELK.js for automatic graph layout.',
      tags: ['advanced', 'layout', 'elk', 'auto-layout'],
      code: `import { useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
} from '@xyflow/react';
import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

// ELK layout options
const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100',
  'elk.spacing.nodeNode': '80',
};

const getLayoutedElements = async (nodes: Node[], edges: Edge[]) => {
  const graph = {
    id: 'root',
    layoutOptions: elkOptions,
    children: nodes.map((node) => ({
      ...node,
      width: 172,
      height: 36,
    })),
    edges: edges.map((edge) => ({
      ...edge,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layoutedGraph = await elk.layout(graph);

  return {
    nodes: nodes.map((node) => {
      const layoutedNode = layoutedGraph.children?.find((n) => n.id === node.id);
      return {
        ...node,
        position: {
          x: layoutedNode?.x ?? 0,
          y: layoutedNode?.y ?? 0,
        },
      };
    }),
    edges,
  };
};

function LayoutFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { fitView } = useReactFlow();

  const onLayout = useCallback(async () => {
    const layouted = await getLayoutedElements(nodes, edges);
    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);
    window.requestAnimationFrame(() => fitView());
  }, [nodes, edges, setNodes, setEdges, fitView]);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      />
      <button onClick={onLayout} style={{ position: 'absolute', top: 10, left: 10 }}>
        Auto Layout
      </button>
    </>
  );
}

// Wrap with ReactFlowProvider for useReactFlow hook
export default () => (
  <ReactFlowProvider>
    <LayoutFlow />
  </ReactFlowProvider>
);`
    }
  };

  const normalizedType = exampleType.toLowerCase().replace(/\s+/g, '-');
  const example = examples[normalizedType];

  if (!example) {
    return {
      content: [{
        type: "text",
        text: `Example "${exampleType}" not found. Available examples:\n\n${Object.entries(examples)
          .map(([key, ex]) => `- **${key}**: ${ex.description}`)
          .join('\n')}`
      }]
    };
  }

  let content = `# ${example.name}\n\n`;
  content += `**Description:** ${example.description}\n\n`;
  content += `**Tags:** ${example.tags.join(', ')}\n\n`;
  content += `## Code\n\n\`\`\`tsx\n${example.code}\n\`\`\`\n`;

  return {
    content: [{
      type: "text",
      text: content
    }]
  };
}
