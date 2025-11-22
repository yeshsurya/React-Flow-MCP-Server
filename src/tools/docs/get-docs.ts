import { z } from 'zod';
import { cache } from '../../utils/cache.js';
import { logInfo } from '../../utils/logger.js';

export const schema = {
  topic: z.string().describe('Documentation topic (e.g., "getting-started", "concepts", "performance")')
};

export async function handleGetDocs(params: { topic: string }) {
  const { topic } = params;

  logInfo(`Getting React Flow docs: ${topic}`);

  const cacheKey = `react-flow-docs-${topic.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const docsInfo = getDocsInfo(topic);

  cache.set(cacheKey, docsInfo, 60 * 60 * 1000);

  return docsInfo;
}

function getDocsInfo(topic: string) {
  const docs: Record<string, any> = {
    'getting-started': {
      title: 'Getting Started with React Flow',
      content: `# Getting Started with React Flow

## Installation

\`\`\`bash
npm install @xyflow/react
\`\`\`

## Basic Setup

1. **Import the components and styles:**

\`\`\`tsx
import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
\`\`\`

2. **Define your nodes and edges:**

\`\`\`tsx
const nodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: '2', position: { x: 200, y: 100 }, data: { label: 'Node 2' } },
];

const edges = [
  { id: 'e1-2', source: '1', target: '2' },
];
\`\`\`

3. **Render the flow:**

\`\`\`tsx
function Flow() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView />
    </div>
  );
}
\`\`\`

## Important: Container Sizing

React Flow needs a parent element with defined dimensions. The flow will fill its parent container, so make sure to set width and height.

## Adding Interactivity

For full interactivity (dragging, connecting, selecting), use the state hooks:

\`\`\`tsx
import { ReactFlow, useNodesState, useEdgesState, addEdge } from '@xyflow/react';

function InteractiveFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    />
  );
}
\`\`\`

## Next Steps

- Add \`<Background />\`, \`<Controls />\`, and \`<MiniMap />\` components
- Create custom node types
- Implement save/restore functionality
- Add drag-and-drop for creating nodes`
    },

    'concepts': {
      title: 'Core Concepts',
      content: `# Core Concepts

## Nodes

Nodes are the main building blocks. Each node has:
- **id**: Unique identifier (string)
- **position**: x/y coordinates
- **data**: Custom data object (accessible in custom nodes)
- **type**: Node type (optional, references nodeTypes)

\`\`\`tsx
const node = {
  id: 'node-1',
  position: { x: 100, y: 200 },
  data: { label: 'My Node', value: 42 },
  type: 'custom', // Optional: use custom node component
};
\`\`\`

## Edges

Edges connect nodes together:
- **id**: Unique identifier
- **source**: ID of the source node
- **target**: ID of the target node
- **sourceHandle** / **targetHandle**: Specific handle IDs (optional)

\`\`\`tsx
const edge = {
  id: 'edge-1',
  source: 'node-1',
  target: 'node-2',
  animated: true, // Optional: animate the edge
};
\`\`\`

## Handles

Handles are the connection points on nodes:
- **type**: 'source' (outgoing) or 'target' (incoming)
- **position**: Top, Bottom, Left, or Right
- **id**: For multiple handles of the same type

## Viewport

The viewport represents the visible area:
- **x, y**: Pan position
- **zoom**: Zoom level

## Controlled vs Uncontrolled

React Flow supports both modes:

**Controlled** (recommended):
- You manage nodes/edges state
- Use onNodesChange/onEdgesChange callbacks
- Full control over state updates

**Uncontrolled**:
- Use defaultNodes/defaultEdges props
- React Flow manages state internally
- Less flexible but simpler for static diagrams`
    },

    'custom-nodes': {
      title: 'Custom Nodes',
      content: `# Custom Nodes

## Creating a Custom Node

\`\`\`tsx
import { Handle, Position, type NodeProps } from '@xyflow/react';

type MyNodeData = {
  label: string;
};

function CustomNode({ data, isConnectable }: NodeProps<MyNodeData>) {
  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}

export default CustomNode;
\`\`\`

## Registering Custom Nodes

\`\`\`tsx
import CustomNode from './CustomNode';

const nodeTypes = { custom: CustomNode };

function Flow() {
  return <ReactFlow nodeTypes={nodeTypes} ... />;
}
\`\`\`

## Important: Memoization

Always memoize nodeTypes to prevent unnecessary re-renders:

\`\`\`tsx
// Outside component or with useMemo
const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
\`\`\`

## Multiple Handles

\`\`\`tsx
function MultiHandleNode({ data }) {
  return (
    <div>
      <Handle type="target" position={Position.Top} id="input-1" />
      <Handle type="target" position={Position.Top} id="input-2" style={{ left: 30 }} />
      {data.label}
      <Handle type="source" position={Position.Bottom} id="output" />
    </div>
  );
}
\`\`\`

## Accessing Node State

Use hooks inside custom nodes:

\`\`\`tsx
import { useNodeId, useNodesData, useHandleConnections } from '@xyflow/react';

function CustomNode() {
  const nodeId = useNodeId();
  const connections = useHandleConnections({ type: 'target' });
  // ...
}
\`\`\``
    },

    'custom-edges': {
      title: 'Custom Edges',
      content: `# Custom Edges

## Creating a Custom Edge

\`\`\`tsx
import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react';

function CustomEdge({
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  style, markerEnd
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY,
    sourcePosition,
    targetX, targetY,
    targetPosition,
  });

  return (
    <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
  );
}
\`\`\`

## Path Helper Functions

- **getBezierPath()**: Curved bezier path
- **getSmoothStepPath()**: Stepped path with rounded corners
- **getStraightPath()**: Direct line
- **getSimpleBezierPath()**: Simple curve

## Adding Labels

Use EdgeLabelRenderer for HTML labels:

\`\`\`tsx
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';

function LabeledEdge(props) {
  const [edgePath, labelX, labelY] = getBezierPath(props);

  return (
    <>
      <BaseEdge path={edgePath} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: \`translate(-50%, -50%) translate(\${labelX}px, \${labelY}px)\`,
            pointerEvents: 'all',
          }}
        >
          <button onClick={() => console.log('clicked')}>×</button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
\`\`\`

## Built-in Edge Types

- **default**: Bezier curve
- **straight**: Straight line
- **step**: Right-angled steps
- **smoothstep**: Rounded steps
- **simplebezier**: Simple curve`
    },

    'performance': {
      title: 'Performance Optimization',
      content: `# Performance Optimization

## Key Principles

### 1. Memoize Custom Components

\`\`\`tsx
import { memo } from 'react';

const CustomNode = memo(({ data }) => {
  return <div>{data.label}</div>;
});
\`\`\`

### 2. Memoize nodeTypes and edgeTypes

\`\`\`tsx
// Define outside component or use useMemo
const nodeTypes = useMemo(() => ({
  custom: CustomNode,
}), []);
\`\`\`

### 3. Use Selectors for Store Access

\`\`\`tsx
// Bad - subscribes to all changes
const state = useStore((state) => state);

// Good - subscribes only to specific data
const zoom = useStore((state) => state.transform[2]);
\`\`\`

### 4. Avoid Inline Object Creation in Props

\`\`\`tsx
// Bad - creates new object every render
<ReactFlow style={{ width: '100%' }} />

// Good - stable reference
const style = useMemo(() => ({ width: '100%' }), []);
<ReactFlow style={style} />
\`\`\`

## Large Graphs (1000+ nodes)

### 1. Use onlyRenderVisibleElements

\`\`\`tsx
<ReactFlow onlyRenderVisibleElements />
\`\`\`

### 2. Simplify Nodes

Use simple node representations for large datasets.

### 3. Disable Features You Don't Need

\`\`\`tsx
<ReactFlow
  nodesDraggable={false}
  nodesConnectable={false}
  elementsSelectable={false}
  panOnDrag={false}
/>
\`\`\`

### 4. Batch Updates

\`\`\`tsx
// Update multiple nodes at once
setNodes((nodes) =>
  nodes.map((node) => ({ ...node, data: { ...node.data, updated: true } }))
);
\`\`\`

## Profiling

Use React DevTools Profiler to identify render bottlenecks.`
    },

    'state-management': {
      title: 'State Management',
      content: `# State Management

## Built-in State (useNodesState/useEdgesState)

Simplest approach for most use cases:

\`\`\`tsx
const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
\`\`\`

## Manual State Management

For more control:

\`\`\`tsx
const [nodes, setNodes] = useState(initialNodes);
const [edges, setEdges] = useState(initialEdges);

const onNodesChange = useCallback(
  (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
  []
);

const onEdgesChange = useCallback(
  (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
  []
);
\`\`\`

## With Zustand

\`\`\`tsx
import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

const useStore = create((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },
}));
\`\`\`

## With Redux

\`\`\`tsx
// In your slice
const flowSlice = createSlice({
  name: 'flow',
  initialState: { nodes: [], edges: [] },
  reducers: {
    setNodes: (state, action) => {
      state.nodes = action.payload;
    },
    onNodesChange: (state, action) => {
      state.nodes = applyNodeChanges(action.payload, state.nodes);
    },
  },
});
\`\`\`

## Accessing Internal Store

\`\`\`tsx
// Subscribe to specific values
const zoom = useStore((state) => state.transform[2]);

// Read without subscription
const store = useStoreApi();
const currentNodes = store.getState().nodes;
\`\`\``
    },

    'typescript': {
      title: 'TypeScript Usage',
      content: `# TypeScript with React Flow

## Basic Types

\`\`\`tsx
import type { Node, Edge, OnConnect, OnNodesChange, OnEdgesChange } from '@xyflow/react';
\`\`\`

## Typed Node Data

\`\`\`tsx
type MyNodeData = {
  label: string;
  value: number;
};

const nodes: Node<MyNodeData>[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: 'Node', value: 42 }, // Typed!
  },
];
\`\`\`

## Typed Custom Nodes

\`\`\`tsx
import { type NodeProps } from '@xyflow/react';

type CustomNodeData = {
  label: string;
  onUpdate: (value: string) => void;
};

function CustomNode({ data }: NodeProps<CustomNodeData>) {
  return (
    <div>
      <input
        value={data.label}
        onChange={(e) => data.onUpdate(e.target.value)}
      />
    </div>
  );
}
\`\`\`

## Typed Edges

\`\`\`tsx
type MyEdgeData = {
  weight: number;
};

const edges: Edge<MyEdgeData>[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    data: { weight: 0.5 },
  },
];
\`\`\`

## Typed Callbacks

\`\`\`tsx
const onConnect: OnConnect = useCallback((params) => {
  // params is typed as Connection
  console.log(params.source, params.target);
}, []);

const onNodesChange: OnNodesChange = useCallback((changes) => {
  // changes is typed as NodeChange[]
  setNodes((nds) => applyNodeChanges(changes, nds));
}, []);
\`\`\`

## Node Types Map

\`\`\`tsx
import type { NodeTypes } from '@xyflow/react';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
  input: InputNode,
} satisfies NodeTypes;
\`\`\``
    },

    'accessibility': {
      title: 'Accessibility',
      content: `# Accessibility

## Keyboard Navigation

React Flow supports keyboard navigation:

- **Tab**: Focus nodes and edges
- **Arrow keys**: Move selected nodes
- **Enter/Space**: Select focused element
- **Escape**: Deselect all
- **Delete/Backspace**: Delete selected elements

## ARIA Labels

Add aria labels to nodes and edges:

\`\`\`tsx
const node = {
  id: '1',
  data: { label: 'Process Data' },
  ariaLabel: 'Data processing node, connected to 2 other nodes',
};
\`\`\`

## Focus Management

\`\`\`tsx
<ReactFlow
  nodes={nodes}
  edges={edges}
  nodesFocusable={true}  // Allow keyboard focus
  edgesFocusable={true}
/>
\`\`\`

## Screen Reader Considerations

- Provide meaningful labels for nodes
- Describe connections in aria labels
- Use ariaLabel prop on edges to describe relationships
- Consider providing a text-based alternative view for complex flows

## Reduced Motion

React Flow respects prefers-reduced-motion:

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  .react-flow__edge.animated path {
    animation: none;
  }
}
\`\`\``
    }
  };

  const normalizedTopic = topic.toLowerCase().replace(/\s+/g, '-');
  const doc = docs[normalizedTopic];

  if (!doc) {
    return {
      content: [{
        type: "text",
        text: `Documentation topic "${topic}" not found. Available topics:\n\n` +
          Object.entries(docs)
            .map(([key, d]) => `- **${key}**: ${d.title}`)
            .join('\n') +
          `\n\nUse \`get_react_flow_docs\` with one of these topic names.`
      }]
    };
  }

  return {
    content: [{
      type: "text",
      text: doc.content
    }]
  };
}
