import { z } from 'zod';
import { cache } from '../../utils/cache.js';
import { logInfo } from '../../utils/logger.js';

export const schema = {
  typeName: z.string().describe('Name of the React Flow type (e.g., "Node", "Edge", "Viewport")')
};

export async function handleGetType(params: { typeName: string }) {
  const { typeName } = params;

  logInfo(`Getting React Flow type: ${typeName}`);

  const cacheKey = `react-flow-type-${typeName.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const typeInfo = getTypeInfo(typeName);

  cache.set(cacheKey, typeInfo, 30 * 60 * 1000);

  return typeInfo;
}

function getTypeInfo(typeName: string) {
  const types: Record<string, any> = {
    'node': {
      name: 'Node<T>',
      type: 'Core Type',
      description: 'Represents a node in the flow. Generic type T defines the data shape.',
      properties: [
        { name: 'id', type: 'string', description: 'Unique identifier for the node', required: true },
        { name: 'position', type: 'XYPosition', description: 'Position of the node { x, y }', required: true },
        { name: 'data', type: 'T', description: 'Custom data object for the node', required: true },
        { name: 'type', type: 'string', description: 'Node type (references nodeTypes)', default: '"default"' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the node wrapper' },
        { name: 'className', type: 'string', description: 'CSS class name' },
        { name: 'sourcePosition', type: 'Position', description: 'Default position for source handles' },
        { name: 'targetPosition', type: 'Position', description: 'Default position for target handles' },
        { name: 'hidden', type: 'boolean', description: 'Hide the node' },
        { name: 'selected', type: 'boolean', description: 'Selection state' },
        { name: 'dragging', type: 'boolean', description: 'Dragging state' },
        { name: 'draggable', type: 'boolean', description: 'Override global draggable setting' },
        { name: 'selectable', type: 'boolean', description: 'Override global selectable setting' },
        { name: 'connectable', type: 'boolean', description: 'Override global connectable setting' },
        { name: 'deletable', type: 'boolean', description: 'Whether node can be deleted' },
        { name: 'dragHandle', type: 'string', description: 'CSS selector for drag handle' },
        { name: 'width', type: 'number', description: 'Node width (for layout)' },
        { name: 'height', type: 'number', description: 'Node height (for layout)' },
        { name: 'parentId', type: 'string', description: 'ID of parent node (for sub-flows)' },
        { name: 'extent', type: 'CoordinateExtent | "parent"', description: 'Bounds for node movement' },
        { name: 'expandParent', type: 'boolean', description: 'Expand parent when node exceeds bounds' },
        { name: 'zIndex', type: 'number', description: 'Z-index for rendering order' },
        { name: 'ariaLabel', type: 'string', description: 'Accessibility label' },
        { name: 'focusable', type: 'boolean', description: 'Whether node can receive focus' },
        { name: 'resizing', type: 'boolean', description: 'Resizing state (when using NodeResizer)' }
      ],
      example: `const node: Node<{ label: string; value: number }> = {
  id: 'node-1',
  type: 'custom',
  position: { x: 100, y: 200 },
  data: { label: 'My Node', value: 42 },
  draggable: true,
  selectable: true,
};`
    },

    'edge': {
      name: 'Edge<T>',
      type: 'Core Type',
      description: 'Represents an edge (connection) between two nodes. Generic type T defines the data shape.',
      properties: [
        { name: 'id', type: 'string', description: 'Unique identifier for the edge', required: true },
        { name: 'source', type: 'string', description: 'ID of the source node', required: true },
        { name: 'target', type: 'string', description: 'ID of the target node', required: true },
        { name: 'sourceHandle', type: 'string | null', description: 'ID of source handle' },
        { name: 'targetHandle', type: 'string | null', description: 'ID of target handle' },
        { name: 'type', type: 'string', description: 'Edge type (references edgeTypes)', default: '"default"' },
        { name: 'data', type: 'T', description: 'Custom data object for the edge' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the edge' },
        { name: 'className', type: 'string', description: 'CSS class name' },
        { name: 'label', type: 'string | ReactNode', description: 'Edge label' },
        { name: 'labelStyle', type: 'CSSProperties', description: 'Styles for the label' },
        { name: 'labelShowBg', type: 'boolean', description: 'Show background behind label' },
        { name: 'labelBgStyle', type: 'CSSProperties', description: 'Styles for label background' },
        { name: 'labelBgPadding', type: '[number, number]', description: 'Padding for label background' },
        { name: 'labelBgBorderRadius', type: 'number', description: 'Border radius of label background' },
        { name: 'hidden', type: 'boolean', description: 'Hide the edge' },
        { name: 'selected', type: 'boolean', description: 'Selection state' },
        { name: 'animated', type: 'boolean', description: 'Animate the edge (dashed line animation)' },
        { name: 'selectable', type: 'boolean', description: 'Override global selectable setting' },
        { name: 'deletable', type: 'boolean', description: 'Whether edge can be deleted' },
        { name: 'focusable', type: 'boolean', description: 'Whether edge can receive focus' },
        { name: 'markerStart', type: 'EdgeMarker', description: 'Marker at start of edge' },
        { name: 'markerEnd', type: 'EdgeMarker', description: 'Marker at end of edge' },
        { name: 'zIndex', type: 'number', description: 'Z-index for rendering order' },
        { name: 'ariaLabel', type: 'string', description: 'Accessibility label' },
        { name: 'interactionWidth', type: 'number', description: 'Width of interaction area' },
        { name: 'reconnectable', type: 'boolean | "source" | "target"', description: 'Allow reconnecting the edge' }
      ],
      example: `const edge: Edge<{ weight: number }> = {
  id: 'edge-1',
  source: 'node-1',
  target: 'node-2',
  sourceHandle: 'output',
  targetHandle: 'input',
  type: 'smoothstep',
  data: { weight: 0.5 },
  animated: true,
  label: 'Connection',
  markerEnd: { type: MarkerType.ArrowClosed },
};`
    },

    'connection': {
      name: 'Connection',
      type: 'Core Type',
      description: 'Represents a connection being made or a completed connection between handles.',
      properties: [
        { name: 'source', type: 'string', description: 'ID of the source node', required: true },
        { name: 'target', type: 'string', description: 'ID of the target node', required: true },
        { name: 'sourceHandle', type: 'string | null', description: 'ID of source handle' },
        { name: 'targetHandle', type: 'string | null', description: 'ID of target handle' }
      ],
      example: `const connection: Connection = {
  source: 'node-1',
  target: 'node-2',
  sourceHandle: 'output-1',
  targetHandle: 'input-1',
};`
    },

    'viewport': {
      name: 'Viewport',
      type: 'Core Type',
      description: 'Represents the current view state of the flow canvas.',
      properties: [
        { name: 'x', type: 'number', description: 'X position of the viewport' },
        { name: 'y', type: 'number', description: 'Y position of the viewport' },
        { name: 'zoom', type: 'number', description: 'Zoom level of the viewport' }
      ],
      example: `const viewport: Viewport = {
  x: 0,
  y: 0,
  zoom: 1,
};`
    },

    'xyposition': {
      name: 'XYPosition',
      type: 'Geometry Type',
      description: 'A simple x/y coordinate pair.',
      properties: [
        { name: 'x', type: 'number', description: 'X coordinate' },
        { name: 'y', type: 'number', description: 'Y coordinate' }
      ],
      example: `const position: XYPosition = { x: 100, y: 200 };`
    },

    'rect': {
      name: 'Rect',
      type: 'Geometry Type',
      description: 'A rectangle with position and dimensions.',
      properties: [
        { name: 'x', type: 'number', description: 'X position' },
        { name: 'y', type: 'number', description: 'Y position' },
        { name: 'width', type: 'number', description: 'Width' },
        { name: 'height', type: 'number', description: 'Height' }
      ],
      example: `const rect: Rect = { x: 0, y: 0, width: 200, height: 100 };`
    },

    'nodechange': {
      name: 'NodeChange',
      type: 'Change Type',
      description: 'Union type representing all possible node changes. Used with onNodesChange callback.',
      variants: [
        { name: 'NodeAddChange', description: 'A node was added', props: '{ type: "add", item: Node }' },
        { name: 'NodeRemoveChange', description: 'A node was removed', props: '{ type: "remove", id: string }' },
        { name: 'NodeResetChange', description: 'All nodes reset', props: '{ type: "reset", item: Node }' },
        { name: 'NodePositionChange', description: 'Node position changed', props: '{ type: "position", id: string, position?: XYPosition, dragging?: boolean }' },
        { name: 'NodeDimensionChange', description: 'Node dimensions changed', props: '{ type: "dimensions", id: string, dimensions?: Dimensions, resizing?: boolean }' },
        { name: 'NodeSelectionChange', description: 'Node selection changed', props: '{ type: "select", id: string, selected: boolean }' }
      ],
      example: `const onNodesChange: OnNodesChange = (changes) => {
  changes.forEach((change) => {
    switch (change.type) {
      case 'position':
        console.log(\`Node \${change.id} moved to\`, change.position);
        break;
      case 'select':
        console.log(\`Node \${change.id} selected: \${change.selected}\`);
        break;
    }
  });
  setNodes((nds) => applyNodeChanges(changes, nds));
};`
    },

    'edgechange': {
      name: 'EdgeChange',
      type: 'Change Type',
      description: 'Union type representing all possible edge changes. Used with onEdgesChange callback.',
      variants: [
        { name: 'EdgeAddChange', description: 'An edge was added', props: '{ type: "add", item: Edge }' },
        { name: 'EdgeRemoveChange', description: 'An edge was removed', props: '{ type: "remove", id: string }' },
        { name: 'EdgeResetChange', description: 'All edges reset', props: '{ type: "reset", item: Edge }' },
        { name: 'EdgeSelectionChange', description: 'Edge selection changed', props: '{ type: "select", id: string, selected: boolean }' }
      ],
      example: `const onEdgesChange: OnEdgesChange = (changes) => {
  setEdges((eds) => applyEdgeChanges(changes, eds));
};`
    },

    'position': {
      name: 'Position',
      type: 'Enum Type',
      description: 'Enum for handle and toolbar positions.',
      values: [
        { name: 'Position.Top', value: '"top"' },
        { name: 'Position.Bottom', value: '"bottom"' },
        { name: 'Position.Left', value: '"left"' },
        { name: 'Position.Right', value: '"right"' }
      ],
      example: `import { Handle, Position } from '@xyflow/react';

<Handle type="source" position={Position.Right} />
<Handle type="target" position={Position.Left} />`
    },

    'markertype': {
      name: 'MarkerType',
      type: 'Enum Type',
      description: 'Enum for edge marker types.',
      values: [
        { name: 'MarkerType.Arrow', value: '"arrow"', description: 'Open arrow marker' },
        { name: 'MarkerType.ArrowClosed', value: '"arrowclosed"', description: 'Filled arrow marker' }
      ],
      example: `import { MarkerType } from '@xyflow/react';

const edge = {
  id: 'e1-2',
  source: '1',
  target: '2',
  markerEnd: { type: MarkerType.ArrowClosed, color: '#333' },
};`
    },

    'connectionmode': {
      name: 'ConnectionMode',
      type: 'Enum Type',
      description: 'Enum for connection mode behavior.',
      values: [
        { name: 'ConnectionMode.Strict', value: '"strict"', description: 'Only allow source-to-target connections' },
        { name: 'ConnectionMode.Loose', value: '"loose"', description: 'Allow connections in any direction' }
      ],
      example: `import { ReactFlow, ConnectionMode } from '@xyflow/react';

<ReactFlow
  nodes={nodes}
  edges={edges}
  connectionMode={ConnectionMode.Loose}
/>`
    },

    'panelposition': {
      name: 'PanelPosition',
      type: 'Enum Type',
      description: 'Positions for Panel, Controls, and MiniMap components.',
      values: [
        { name: 'top-left', value: '"top-left"' },
        { name: 'top-center', value: '"top-center"' },
        { name: 'top-right', value: '"top-right"' },
        { name: 'bottom-left', value: '"bottom-left"' },
        { name: 'bottom-center', value: '"bottom-center"' },
        { name: 'bottom-right', value: '"bottom-right"' }
      ],
      example: `<Panel position="top-right">Content</Panel>
<Controls position="bottom-left" />
<MiniMap position="bottom-right" />`
    },

    'nodetypes': {
      name: 'NodeTypes',
      type: 'Configuration Type',
      description: 'Record type mapping node type names to custom node components.',
      example: `import { NodeTypes } from '@xyflow/react';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
  input: InputNode,
  output: OutputNode,
  group: GroupNode,
};

<ReactFlow nodeTypes={nodeTypes} ... />`
    },

    'edgetypes': {
      name: 'EdgeTypes',
      type: 'Configuration Type',
      description: 'Record type mapping edge type names to custom edge components.',
      example: `import { EdgeTypes } from '@xyflow/react';

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
  bidirectional: BidirectionalEdge,
};

<ReactFlow edgeTypes={edgeTypes} ... />`
    },

    'onconnect': {
      name: 'OnConnect',
      type: 'Callback Type',
      description: 'Callback type for when a new connection is created.',
      signature: '(connection: Connection) => void',
      example: `const onConnect: OnConnect = useCallback(
  (params) => setEdges((eds) => addEdge(params, eds)),
  [setEdges]
);`
    },

    'onnodeschange': {
      name: 'OnNodesChange',
      type: 'Callback Type',
      description: 'Callback type for node change events.',
      signature: '(changes: NodeChange[]) => void',
      example: `const onNodesChange: OnNodesChange = useCallback(
  (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
  [setNodes]
);`
    },

    'onedgeschange': {
      name: 'OnEdgesChange',
      type: 'Callback Type',
      description: 'Callback type for edge change events.',
      signature: '(changes: EdgeChange[]) => void',
      example: `const onEdgesChange: OnEdgesChange = useCallback(
  (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
  [setEdges]
);`
    }
  };

  const normalizedName = typeName.toLowerCase().replace(/[<>]/g, '');
  const typeData = types[normalizedName];

  if (!typeData) {
    return {
      content: [{
        type: "text",
        text: `Type "${typeName}" not found. Available types: ${Object.keys(types).map(k => types[k].name).join(', ')}`
      }]
    };
  }

  let content = `# ${typeData.name}\n\n`;
  content += `**Type:** ${typeData.type}\n\n`;
  content += `**Description:** ${typeData.description}\n\n`;

  if (typeData.signature) {
    content += `**Signature:** \`${typeData.signature}\`\n\n`;
  }

  if (typeData.properties && typeData.properties.length > 0) {
    content += `## Properties\n\n`;
    typeData.properties.forEach((prop: any) => {
      content += `- **${prop.name}** (\`${prop.type}\`)${prop.required ? ' *required*' : ''}: ${prop.description}`;
      if (prop.default) content += ` - Default: \`${prop.default}\``;
      content += `\n`;
    });
    content += `\n`;
  }

  if (typeData.variants && typeData.variants.length > 0) {
    content += `## Variants\n\n`;
    typeData.variants.forEach((variant: any) => {
      content += `- **${variant.name}**: ${variant.description}\n  - \`${variant.props}\`\n`;
    });
    content += `\n`;
  }

  if (typeData.values && typeData.values.length > 0) {
    content += `## Values\n\n`;
    typeData.values.forEach((val: any) => {
      content += `- **${val.name}** = \`${val.value}\``;
      if (val.description) content += `: ${val.description}`;
      content += `\n`;
    });
    content += `\n`;
  }

  if (typeData.example) {
    content += `## Example\n\n\`\`\`tsx\n${typeData.example}\n\`\`\`\n`;
  }

  return {
    content: [{
      type: "text",
      text: content
    }]
  };
}
