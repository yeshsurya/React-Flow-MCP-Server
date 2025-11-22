import { z } from 'zod';
import { cache } from '../../utils/cache.js';
import { logInfo } from '../../utils/logger.js';

export const schema = {
  hookName: z.string().describe('Name of the React Flow hook (e.g., "useReactFlow", "useNodes", "useEdges")')
};

export async function handleGetHook(params: { hookName: string }) {
  const { hookName } = params;

  logInfo(`Getting React Flow hook: ${hookName}`);

  const cacheKey = `react-flow-hook-${hookName.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const hookInfo = getHookInfo(hookName);

  cache.set(cacheKey, hookInfo, 30 * 60 * 1000);

  return hookInfo;
}

function getHookInfo(hookName: string) {
  const hooks: Record<string, any> = {
    'usereactflow': {
      name: 'useReactFlow()',
      type: 'Core Hook',
      description: 'Returns the React Flow instance with methods for programmatic control. Must be used within ReactFlowProvider.',
      returns: 'ReactFlowInstance',
      methods: [
        { name: 'getNodes()', returns: 'Node[]', description: 'Get all nodes' },
        { name: 'getEdges()', returns: 'Edge[]', description: 'Get all edges' },
        { name: 'getNode(id)', returns: 'Node | undefined', description: 'Get a node by ID' },
        { name: 'getEdge(id)', returns: 'Edge | undefined', description: 'Get an edge by ID' },
        { name: 'setNodes(nodes)', returns: 'void', description: 'Replace all nodes' },
        { name: 'setEdges(edges)', returns: 'void', description: 'Replace all edges' },
        { name: 'addNodes(nodes)', returns: 'void', description: 'Add nodes to the flow' },
        { name: 'addEdges(edges)', returns: 'void', description: 'Add edges to the flow' },
        { name: 'deleteElements({ nodes, edges })', returns: 'void', description: 'Delete specified nodes and edges' },
        { name: 'zoomIn(options?)', returns: 'void', description: 'Zoom in the viewport' },
        { name: 'zoomOut(options?)', returns: 'void', description: 'Zoom out the viewport' },
        { name: 'zoomTo(level, options?)', returns: 'void', description: 'Zoom to a specific level' },
        { name: 'setViewport(viewport, options?)', returns: 'void', description: 'Set viewport position and zoom' },
        { name: 'getViewport()', returns: 'Viewport', description: 'Get current viewport' },
        { name: 'fitView(options?)', returns: 'void', description: 'Fit all nodes in view' },
        { name: 'fitBounds(bounds, options?)', returns: 'void', description: 'Fit specific bounds in view' },
        { name: 'screenToFlowPosition(position)', returns: 'XYPosition', description: 'Convert screen to flow coordinates' },
        { name: 'flowToScreenPosition(position)', returns: 'XYPosition', description: 'Convert flow to screen coordinates' },
        { name: 'getIntersectingNodes(node)', returns: 'Node[]', description: 'Get nodes intersecting with a node' },
        { name: 'isNodeIntersecting(node, area)', returns: 'boolean', description: 'Check if node intersects area' },
        { name: 'updateNode(id, nodeUpdate)', returns: 'void', description: 'Update a node partially' },
        { name: 'updateNodeData(id, dataUpdate)', returns: 'void', description: 'Update only node data' }
      ],
      example: `import { useReactFlow } from '@xyflow/react';

function FlowControls() {
  const {
    zoomIn,
    zoomOut,
    fitView,
    addNodes,
    deleteElements,
    screenToFlowPosition
  } = useReactFlow();

  const onAddNode = useCallback(() => {
    const position = screenToFlowPosition({ x: 200, y: 200 });
    addNodes({
      id: \`node-\${Date.now()}\`,
      position,
      data: { label: 'New Node' }
    });
  }, [addNodes, screenToFlowPosition]);

  return (
    <div className="controls">
      <button onClick={() => zoomIn()}>Zoom In</button>
      <button onClick={() => zoomOut()}>Zoom Out</button>
      <button onClick={() => fitView()}>Fit View</button>
      <button onClick={onAddNode}>Add Node</button>
    </div>
  );
}`
    },

    'usenodes': {
      name: 'useNodes()',
      type: 'State Hook',
      description: 'Returns the current nodes array. Re-renders when nodes change.',
      returns: 'Node[]',
      example: `import { useNodes } from '@xyflow/react';

function NodeCounter() {
  const nodes = useNodes();
  return <div>Total nodes: {nodes.length}</div>;
}`
    },

    'useedges': {
      name: 'useEdges()',
      type: 'State Hook',
      description: 'Returns the current edges array. Re-renders when edges change.',
      returns: 'Edge[]',
      example: `import { useEdges } from '@xyflow/react';

function EdgeCounter() {
  const edges = useEdges();
  return <div>Total connections: {edges.length}</div>;
}`
    },

    'usenodesstate': {
      name: 'useNodesState(initialNodes)',
      type: 'State Hook',
      description: 'A convenience hook that returns nodes state, setter, and change handler. Useful for quick setup.',
      parameters: [
        { name: 'initialNodes', type: 'Node[]', description: 'Initial nodes array' }
      ],
      returns: '[Node[], Dispatch<SetStateAction<Node[]>>, OnNodesChange]',
      example: `import { ReactFlow, useNodesState, useEdgesState } from '@xyflow/react';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: '2', position: { x: 200, y: 100 }, data: { label: 'Node 2' } },
];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    />
  );
}`
    },

    'useedgesstate': {
      name: 'useEdgesState(initialEdges)',
      type: 'State Hook',
      description: 'A convenience hook that returns edges state, setter, and change handler. Useful for quick setup.',
      parameters: [
        { name: 'initialEdges', type: 'Edge[]', description: 'Initial edges array' }
      ],
      returns: '[Edge[], Dispatch<SetStateAction<Edge[]>>, OnEdgesChange]',
      example: `import { ReactFlow, useNodesState, useEdgesState, addEdge } from '@xyflow/react';

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

function Flow() {
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
}`
    },

    'usenodeid': {
      name: 'useNodeId()',
      type: 'Node Hook',
      description: 'Returns the ID of the current node. Only works inside custom node components.',
      returns: 'string | null',
      example: `import { Handle, Position, useNodeId } from '@xyflow/react';

function CustomNode({ data }) {
  const nodeId = useNodeId();

  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <div>ID: {nodeId}</div>
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}`
    },

    'usenodesdata': {
      name: 'useNodesData(nodeIds)',
      type: 'Data Hook',
      description: 'Returns the data of specified nodes. Useful for accessing data from multiple nodes efficiently.',
      parameters: [
        { name: 'nodeIds', type: 'string | string[]', description: 'Node ID(s) to get data for' }
      ],
      returns: 'Pick<Node, "id" | "type" | "data">[] | Pick<Node, "id" | "type" | "data"> | null',
      example: `import { useNodesData } from '@xyflow/react';

function NodeDataDisplay({ nodeIds }) {
  const nodesData = useNodesData(nodeIds);

  return (
    <div>
      {nodesData?.map((node) => (
        <div key={node.id}>
          {node.id}: {JSON.stringify(node.data)}
        </div>
      ))}
    </div>
  );
}`
    },

    'useconnection': {
      name: 'useConnection()',
      type: 'Connection Hook',
      description: 'Returns information about the current connection being made by the user.',
      returns: '{ startHandle: HandleElement | null, endHandle: HandleElement | null, status: ConnectionStatus | null }',
      example: `import { useConnection } from '@xyflow/react';

function ConnectionIndicator() {
  const connection = useConnection();

  if (!connection.startHandle) {
    return null;
  }

  return (
    <div>
      Connecting from: {connection.startHandle.nodeId}
      {connection.endHandle && \` to \${connection.endHandle.nodeId}\`}
    </div>
  );
}`
    },

    'usehandleconnections': {
      name: 'useHandleConnections({ type, id })',
      type: 'Connection Hook',
      description: 'Returns all connections for a specific handle. Useful in custom nodes to know what is connected.',
      parameters: [
        { name: 'type', type: '"source" | "target"', description: 'Handle type' },
        { name: 'id', type: 'string', description: 'Handle ID (optional)' }
      ],
      returns: 'HandleConnection[]',
      example: `import { Handle, Position, useHandleConnections } from '@xyflow/react';

function CustomNode({ data }) {
  const connections = useHandleConnections({ type: 'target' });

  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <div>Incoming connections: {connections.length}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}`
    },

    'usenodeconnections': {
      name: 'useNodeConnections({ type })',
      type: 'Connection Hook',
      description: 'Returns all connections for the current node. Only works inside custom node components.',
      parameters: [
        { name: 'type', type: '"source" | "target"', description: 'Filter by connection type (optional)' }
      ],
      returns: 'NodeConnection[]',
      example: `import { Handle, Position, useNodeConnections } from '@xyflow/react';

function CustomNode({ data }) {
  const incomingConnections = useNodeConnections({ type: 'target' });
  const outgoingConnections = useNodeConnections({ type: 'source' });

  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <div>In: {incomingConnections.length} | Out: {outgoingConnections.length}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}`
    },

    'useviewport': {
      name: 'useViewport()',
      type: 'Viewport Hook',
      description: 'Returns the current viewport (x, y, zoom). Re-renders on viewport changes.',
      returns: 'Viewport ({ x: number, y: number, zoom: number })',
      example: `import { useViewport } from '@xyflow/react';

function ViewportInfo() {
  const { x, y, zoom } = useViewport();

  return (
    <div>
      Position: ({x.toFixed(2)}, {y.toFixed(2)})
      Zoom: {(zoom * 100).toFixed(0)}%
    </div>
  );
}`
    },

    'useonviewportchange': {
      name: 'useOnViewportChange({ onStart, onChange, onEnd })',
      type: 'Viewport Hook',
      description: 'Registers callbacks for viewport change events without re-rendering.',
      parameters: [
        { name: 'onStart', type: '(viewport: Viewport) => void', description: 'Called when viewport change starts' },
        { name: 'onChange', type: '(viewport: Viewport) => void', description: 'Called during viewport change' },
        { name: 'onEnd', type: '(viewport: Viewport) => void', description: 'Called when viewport change ends' }
      ],
      returns: 'void',
      example: `import { useOnViewportChange } from '@xyflow/react';

function ViewportLogger() {
  useOnViewportChange({
    onStart: (viewport) => console.log('Start:', viewport),
    onChange: (viewport) => console.log('Change:', viewport),
    onEnd: (viewport) => console.log('End:', viewport),
  });

  return null;
}`
    },

    'useonselectionchange': {
      name: 'useOnSelectionChange({ onChange })',
      type: 'Selection Hook',
      description: 'Registers a callback for selection changes without re-rendering.',
      parameters: [
        { name: 'onChange', type: '({ nodes, edges }) => void', description: 'Called when selection changes' }
      ],
      returns: 'void',
      example: `import { useOnSelectionChange } from '@xyflow/react';

function SelectionHandler() {
  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      console.log('Selected nodes:', nodes.map(n => n.id));
      console.log('Selected edges:', edges.map(e => e.id));
    },
  });

  return null;
}`
    },

    'usekeypress': {
      name: 'useKeyPress(keyCode)',
      type: 'Interaction Hook',
      description: 'Returns whether a key is currently pressed.',
      parameters: [
        { name: 'keyCode', type: 'KeyCode | KeyCode[] | null', description: 'Key(s) to watch' }
      ],
      returns: 'boolean',
      example: `import { useKeyPress } from '@xyflow/react';

function DeleteHandler() {
  const deletePressed = useKeyPress('Delete');
  const shiftPressed = useKeyPress('Shift');

  useEffect(() => {
    if (deletePressed) {
      // Handle delete action
    }
  }, [deletePressed]);

  return null;
}`
    },

    'usestore': {
      name: 'useStore(selector)',
      type: 'Store Hook',
      description: 'Access the internal zustand store with a selector for fine-grained subscriptions.',
      parameters: [
        { name: 'selector', type: '(state: ReactFlowState) => T', description: 'Selector function' }
      ],
      returns: 'T',
      example: `import { useStore } from '@xyflow/react';

function CustomComponent() {
  const transform = useStore((state) => state.transform);
  const [x, y, zoom] = transform;

  return (
    <div>
      Transform: x={x}, y={y}, zoom={zoom}
    </div>
  );
}`
    },

    'usestoreapi': {
      name: 'useStoreApi()',
      type: 'Store Hook',
      description: 'Returns the store API for reading state without subscribing to changes.',
      returns: 'StoreApi<ReactFlowState>',
      example: `import { useStoreApi } from '@xyflow/react';

function StoreReader() {
  const store = useStoreApi();

  const logState = () => {
    const state = store.getState();
    console.log('Current nodes:', state.nodes);
    console.log('Current edges:', state.edges);
  };

  return <button onClick={logState}>Log State</button>;
}`
    },

    'useupdatenodeinternals': {
      name: 'useUpdateNodeInternals()',
      type: 'Utility Hook',
      description: 'Returns a function to update node internals (handle positions). Useful when handles change dynamically.',
      returns: '(nodeId: string | string[]) => void',
      example: `import { useUpdateNodeInternals } from '@xyflow/react';

function DynamicHandleNode({ id, data }) {
  const updateNodeInternals = useUpdateNodeInternals();
  const [handleCount, setHandleCount] = useState(1);

  const addHandle = () => {
    setHandleCount(c => c + 1);
    // Must update internals after handles change
    updateNodeInternals(id);
  };

  return (
    <div>
      {Array.from({ length: handleCount }).map((_, i) => (
        <Handle key={i} type="source" position={Position.Right} id={\`handle-\${i}\`} />
      ))}
      <button onClick={addHandle}>Add Handle</button>
    </div>
  );
}`
    },

    'usenodesinitialized': {
      name: 'useNodesInitialized(options?)',
      type: 'Utility Hook',
      description: 'Returns true when all nodes have been measured and have dimensions.',
      parameters: [
        { name: 'includeHiddenNodes', type: 'boolean', description: 'Include hidden nodes in check', default: 'false' }
      ],
      returns: 'boolean',
      example: `import { useNodesInitialized, useReactFlow } from '@xyflow/react';

function FitViewOnInit() {
  const nodesInitialized = useNodesInitialized();
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (nodesInitialized) {
      fitView();
    }
  }, [nodesInitialized, fitView]);

  return null;
}`
    },

    'useinternalnode': {
      name: 'useInternalNode(nodeId)',
      type: 'Utility Hook',
      description: 'Returns internal node data including computed dimensions. Useful for advanced customizations.',
      parameters: [
        { name: 'nodeId', type: 'string', description: 'Node ID to get internal data for' }
      ],
      returns: 'InternalNode | undefined',
      example: `import { useInternalNode } from '@xyflow/react';

function NodeDimensions({ nodeId }) {
  const internalNode = useInternalNode(nodeId);

  if (!internalNode) return null;

  return (
    <div>
      Width: {internalNode.measured.width}
      Height: {internalNode.measured.height}
    </div>
  );
}`
    }
  };

  const normalizedName = hookName.toLowerCase().replace(/[()]/g, '');
  const hook = hooks[normalizedName];

  if (!hook) {
    return {
      content: [{
        type: "text",
        text: `Hook "${hookName}" not found. Available hooks: ${Object.keys(hooks).map(k => hooks[k].name).join(', ')}`
      }]
    };
  }

  let content = `# ${hook.name}\n\n`;
  content += `**Type:** ${hook.type}\n\n`;
  content += `**Description:** ${hook.description}\n\n`;

  if (hook.parameters && hook.parameters.length > 0) {
    content += `## Parameters\n\n`;
    hook.parameters.forEach((param: any) => {
      content += `- **${param.name}** (\`${param.type}\`): ${param.description}`;
      if (param.default) content += ` - Default: \`${param.default}\``;
      content += `\n`;
    });
    content += `\n`;
  }

  if (hook.returns) {
    content += `## Returns\n\n`;
    content += `\`${hook.returns}\`\n\n`;
  }

  if (hook.methods && hook.methods.length > 0) {
    content += `## Methods\n\n`;
    hook.methods.forEach((method: any) => {
      content += `- **${method.name}** → \`${method.returns}\`: ${method.description}\n`;
    });
    content += `\n`;
  }

  if (hook.example) {
    content += `## Example\n\n\`\`\`tsx\n${hook.example}\n\`\`\`\n`;
  }

  return {
    content: [{
      type: "text",
      text: content
    }]
  };
}
