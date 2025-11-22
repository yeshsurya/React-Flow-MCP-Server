import { z } from 'zod';
import { cache } from '../../utils/cache.js';
import { logInfo } from '../../utils/logger.js';

export const schema = {
  utilityName: z.string().describe('Name of the React Flow utility function (e.g., "addEdge", "applyNodeChanges")')
};

export async function handleGetUtility(params: { utilityName: string }) {
  const { utilityName } = params;

  logInfo(`Getting React Flow utility: ${utilityName}`);

  const cacheKey = `react-flow-utility-${utilityName.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const utilityInfo = getUtilityInfo(utilityName);

  cache.set(cacheKey, utilityInfo, 30 * 60 * 1000);

  return utilityInfo;
}

function getUtilityInfo(utilityName: string) {
  const utilities: Record<string, any> = {
    'addedge': {
      name: 'addEdge()',
      type: 'Edge Utility',
      description: 'Adds a new edge to an existing array of edges. Prevents duplicate edges.',
      signature: 'addEdge(edgeParams: Edge | Connection, edges: Edge[]): Edge[]',
      parameters: [
        { name: 'edgeParams', type: 'Edge | Connection', description: 'The edge or connection to add' },
        { name: 'edges', type: 'Edge[]', description: 'Current edges array' }
      ],
      returns: 'Edge[] - Updated edges array with the new edge',
      example: `import { addEdge, useEdgesState } from '@xyflow/react';

function Flow() {
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return <ReactFlow edges={edges} onConnect={onConnect} />;
}`
    },

    'applynodechanges': {
      name: 'applyNodeChanges()',
      type: 'Node Utility',
      description: 'Applies an array of node changes to an existing array of nodes. Handles position, selection, dimensions, and removal.',
      signature: 'applyNodeChanges(changes: NodeChange[], nodes: Node[]): Node[]',
      parameters: [
        { name: 'changes', type: 'NodeChange[]', description: 'Array of changes to apply' },
        { name: 'nodes', type: 'Node[]', description: 'Current nodes array' }
      ],
      returns: 'Node[] - Updated nodes array',
      example: `import { applyNodeChanges, useCallback, useState } from '@xyflow/react';

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  return <ReactFlow nodes={nodes} onNodesChange={onNodesChange} />;
}`
    },

    'applyedgechanges': {
      name: 'applyEdgeChanges()',
      type: 'Edge Utility',
      description: 'Applies an array of edge changes to an existing array of edges. Handles selection and removal.',
      signature: 'applyEdgeChanges(changes: EdgeChange[], edges: Edge[]): Edge[]',
      parameters: [
        { name: 'changes', type: 'EdgeChange[]', description: 'Array of changes to apply' },
        { name: 'edges', type: 'Edge[]', description: 'Current edges array' }
      ],
      returns: 'Edge[] - Updated edges array',
      example: `import { applyEdgeChanges, useCallback, useState } from '@xyflow/react';

function Flow() {
  const [edges, setEdges] = useState(initialEdges);

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  return <ReactFlow edges={edges} onEdgesChange={onEdgesChange} />;
}`
    },

    'reconnectedge': {
      name: 'reconnectEdge()',
      type: 'Edge Utility',
      description: 'Updates an edge with a new connection. Used when implementing edge reconnection.',
      signature: 'reconnectEdge(oldEdge: Edge, newConnection: Connection, edges: Edge[]): Edge[]',
      parameters: [
        { name: 'oldEdge', type: 'Edge', description: 'The edge being reconnected' },
        { name: 'newConnection', type: 'Connection', description: 'The new connection' },
        { name: 'edges', type: 'Edge[]', description: 'Current edges array' }
      ],
      returns: 'Edge[] - Updated edges array',
      example: `import { reconnectEdge } from '@xyflow/react';

const onReconnect = useCallback(
  (oldEdge, newConnection) =>
    setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds)),
  [setEdges]
);

<ReactFlow
  edges={edges}
  onReconnect={onReconnect}
  onReconnectStart={onReconnectStart}
  onReconnectEnd={onReconnectEnd}
/>`
    },

    'getbezierpath': {
      name: 'getBezierPath()',
      type: 'Path Utility',
      description: 'Calculates a bezier curve path between two points. Returns path string and label position.',
      signature: 'getBezierPath(params: BezierPathParams): [path: string, labelX: number, labelY: number, offsetX: number, offsetY: number]',
      parameters: [
        { name: 'sourceX', type: 'number', description: 'X position of source' },
        { name: 'sourceY', type: 'number', description: 'Y position of source' },
        { name: 'sourcePosition', type: 'Position', description: 'Position of source handle' },
        { name: 'targetX', type: 'number', description: 'X position of target' },
        { name: 'targetY', type: 'number', description: 'Y position of target' },
        { name: 'targetPosition', type: 'Position', description: 'Position of target handle' },
        { name: 'curvature', type: 'number', description: 'Curve intensity (optional)', default: '0.25' }
      ],
      returns: '[path, labelX, labelY, offsetX, offsetY]',
      example: `import { getBezierPath, BaseEdge } from '@xyflow/react';

function CustomEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return <BaseEdge path={edgePath} />;
}`
    },

    'getsimplebezierpath': {
      name: 'getSimpleBezierPath()',
      type: 'Path Utility',
      description: 'Calculates a simple bezier path (single control point) between two points.',
      signature: 'getSimpleBezierPath(params): [path: string, labelX: number, labelY: number]',
      parameters: [
        { name: 'sourceX', type: 'number', description: 'X position of source' },
        { name: 'sourceY', type: 'number', description: 'Y position of source' },
        { name: 'targetX', type: 'number', description: 'X position of target' },
        { name: 'targetY', type: 'number', description: 'Y position of target' }
      ],
      returns: '[path, labelX, labelY]',
      example: `import { getSimpleBezierPath } from '@xyflow/react';

const [path, labelX, labelY] = getSimpleBezierPath({
  sourceX: 0,
  sourceY: 0,
  targetX: 100,
  targetY: 100,
});`
    },

    'getsmoothsteppath': {
      name: 'getSmoothStepPath()',
      type: 'Path Utility',
      description: 'Calculates a smooth step path (rounded corners) between two points.',
      signature: 'getSmoothStepPath(params): [path: string, labelX: number, labelY: number, offsetX: number, offsetY: number]',
      parameters: [
        { name: 'sourceX', type: 'number', description: 'X position of source' },
        { name: 'sourceY', type: 'number', description: 'Y position of source' },
        { name: 'sourcePosition', type: 'Position', description: 'Position of source handle' },
        { name: 'targetX', type: 'number', description: 'X position of target' },
        { name: 'targetY', type: 'number', description: 'Y position of target' },
        { name: 'targetPosition', type: 'Position', description: 'Position of target handle' },
        { name: 'borderRadius', type: 'number', description: 'Corner radius', default: '5' },
        { name: 'offset', type: 'number', description: 'Path offset', default: '20' }
      ],
      returns: '[path, labelX, labelY, offsetX, offsetY]',
      example: `import { getSmoothStepPath, BaseEdge } from '@xyflow/react';

function SmoothStepEdge(props) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    ...props,
    borderRadius: 10,
  });

  return <BaseEdge path={edgePath} labelX={labelX} labelY={labelY} {...props} />;
}`
    },

    'getstraightpath': {
      name: 'getStraightPath()',
      type: 'Path Utility',
      description: 'Calculates a straight line path between two points.',
      signature: 'getStraightPath(params): [path: string, labelX: number, labelY: number]',
      parameters: [
        { name: 'sourceX', type: 'number', description: 'X position of source' },
        { name: 'sourceY', type: 'number', description: 'Y position of source' },
        { name: 'targetX', type: 'number', description: 'X position of target' },
        { name: 'targetY', type: 'number', description: 'Y position of target' }
      ],
      returns: '[path, labelX, labelY]',
      example: `import { getStraightPath, BaseEdge } from '@xyflow/react';

function StraightEdge({ sourceX, sourceY, targetX, targetY }) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return <BaseEdge path={edgePath} />;
}`
    },

    'getconnectededges': {
      name: 'getConnectedEdges()',
      type: 'Graph Utility',
      description: 'Returns all edges connected to a set of nodes.',
      signature: 'getConnectedEdges(nodes: Node[], edges: Edge[]): Edge[]',
      parameters: [
        { name: 'nodes', type: 'Node[]', description: 'Nodes to find connected edges for' },
        { name: 'edges', type: 'Edge[]', description: 'All edges in the flow' }
      ],
      returns: 'Edge[] - Edges connected to any of the provided nodes',
      example: `import { getConnectedEdges, useNodes, useEdges } from '@xyflow/react';

function DeleteSelected() {
  const nodes = useNodes();
  const edges = useEdges();
  const { deleteElements } = useReactFlow();

  const onDeleteSelected = () => {
    const selectedNodes = nodes.filter((n) => n.selected);
    const connectedEdges = getConnectedEdges(selectedNodes, edges);
    deleteElements({ nodes: selectedNodes, edges: connectedEdges });
  };
}`
    },

    'getincomers': {
      name: 'getIncomers()',
      type: 'Graph Utility',
      description: 'Returns all nodes that have edges pointing to the target node.',
      signature: 'getIncomers(node: Node, nodes: Node[], edges: Edge[]): Node[]',
      parameters: [
        { name: 'node', type: 'Node', description: 'Target node' },
        { name: 'nodes', type: 'Node[]', description: 'All nodes in the flow' },
        { name: 'edges', type: 'Edge[]', description: 'All edges in the flow' }
      ],
      returns: 'Node[] - Nodes with edges pointing to the target',
      example: `import { getIncomers } from '@xyflow/react';

function NodeInfo({ node, nodes, edges }) {
  const incomers = getIncomers(node, nodes, edges);

  return (
    <div>
      Incoming connections from: {incomers.map(n => n.id).join(', ')}
    </div>
  );
}`
    },

    'getoutgoers': {
      name: 'getOutgoers()',
      type: 'Graph Utility',
      description: 'Returns all nodes that the source node has edges pointing to.',
      signature: 'getOutgoers(node: Node, nodes: Node[], edges: Edge[]): Node[]',
      parameters: [
        { name: 'node', type: 'Node', description: 'Source node' },
        { name: 'nodes', type: 'Node[]', description: 'All nodes in the flow' },
        { name: 'edges', type: 'Edge[]', description: 'All edges in the flow' }
      ],
      returns: 'Node[] - Nodes the source has edges pointing to',
      example: `import { getOutgoers } from '@xyflow/react';

function NodeInfo({ node, nodes, edges }) {
  const outgoers = getOutgoers(node, nodes, edges);

  return (
    <div>
      Outgoing connections to: {outgoers.map(n => n.id).join(', ')}
    </div>
  );
}`
    },

    'getnodesbounds': {
      name: 'getNodesBounds()',
      type: 'Layout Utility',
      description: 'Calculates the bounding box that contains all provided nodes.',
      signature: 'getNodesBounds(nodes: Node[]): Rect',
      parameters: [
        { name: 'nodes', type: 'Node[]', description: 'Nodes to calculate bounds for' }
      ],
      returns: 'Rect - { x, y, width, height }',
      example: `import { getNodesBounds, useNodes } from '@xyflow/react';

function FlowBounds() {
  const nodes = useNodes();
  const bounds = getNodesBounds(nodes);

  return (
    <div>
      Flow bounds: {bounds.width}x{bounds.height}
    </div>
  );
}`
    },

    'getviewportforbounds': {
      name: 'getViewportForBounds()',
      type: 'Layout Utility',
      description: 'Calculates the viewport settings needed to fit given bounds in a container.',
      signature: 'getViewportForBounds(bounds: Rect, width: number, height: number, minZoom: number, maxZoom: number, padding?: number): Viewport',
      parameters: [
        { name: 'bounds', type: 'Rect', description: 'Bounds to fit' },
        { name: 'width', type: 'number', description: 'Container width' },
        { name: 'height', type: 'number', description: 'Container height' },
        { name: 'minZoom', type: 'number', description: 'Minimum zoom level' },
        { name: 'maxZoom', type: 'number', description: 'Maximum zoom level' },
        { name: 'padding', type: 'number', description: 'Padding around bounds', default: '0.1' }
      ],
      returns: 'Viewport - { x, y, zoom }',
      example: `import { getNodesBounds, getViewportForBounds } from '@xyflow/react';

const bounds = getNodesBounds(nodes);
const viewport = getViewportForBounds(bounds, 800, 600, 0.5, 2, 0.2);
// Use viewport with setViewport()`
    },

    'isnode': {
      name: 'isNode()',
      type: 'Validation Utility',
      description: 'Type guard to check if an element is a Node.',
      signature: 'isNode(element: Node | Edge): element is Node',
      parameters: [
        { name: 'element', type: 'Node | Edge', description: 'Element to check' }
      ],
      returns: 'boolean - True if element is a Node',
      example: `import { isNode } from '@xyflow/react';

function processElement(element: Node | Edge) {
  if (isNode(element)) {
    console.log('Node position:', element.position);
  } else {
    console.log('Edge source:', element.source);
  }
}`
    },

    'isedge': {
      name: 'isEdge()',
      type: 'Validation Utility',
      description: 'Type guard to check if an element is an Edge.',
      signature: 'isEdge(element: Node | Edge): element is Edge',
      parameters: [
        { name: 'element', type: 'Node | Edge', description: 'Element to check' }
      ],
      returns: 'boolean - True if element is an Edge',
      example: `import { isEdge } from '@xyflow/react';

function processElement(element: Node | Edge) {
  if (isEdge(element)) {
    console.log('Edge connects:', element.source, '->', element.target);
  }
}`
    }
  };

  const normalizedName = utilityName.toLowerCase().replace(/[()]/g, '');
  const utility = utilities[normalizedName];

  if (!utility) {
    return {
      content: [{
        type: "text",
        text: `Utility "${utilityName}" not found. Available utilities: ${Object.keys(utilities).map(k => utilities[k].name).join(', ')}`
      }]
    };
  }

  let content = `# ${utility.name}\n\n`;
  content += `**Type:** ${utility.type}\n\n`;
  content += `**Description:** ${utility.description}\n\n`;

  if (utility.signature) {
    content += `**Signature:**\n\`\`\`typescript\n${utility.signature}\n\`\`\`\n\n`;
  }

  if (utility.parameters && utility.parameters.length > 0) {
    content += `## Parameters\n\n`;
    utility.parameters.forEach((param: any) => {
      content += `- **${param.name}** (\`${param.type}\`): ${param.description}`;
      if (param.default) content += ` - Default: \`${param.default}\``;
      content += `\n`;
    });
    content += `\n`;
  }

  if (utility.returns) {
    content += `## Returns\n\n${utility.returns}\n\n`;
  }

  if (utility.example) {
    content += `## Example\n\n\`\`\`tsx\n${utility.example}\n\`\`\`\n`;
  }

  return {
    content: [{
      type: "text",
      text: content
    }]
  };
}
