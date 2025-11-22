import { z } from 'zod';
import { cache } from '../../utils/cache.js';
import { logInfo } from '../../utils/logger.js';

export const schema = {
  componentName: z.string().describe('Name of the React Flow component (e.g., "ReactFlow", "Handle", "Background")')
};

export async function handleGetComponent(params: { componentName: string }) {
  const { componentName } = params;

  logInfo(`Getting React Flow component: ${componentName}`);

  // Check cache first
  const cacheKey = `react-flow-component-${componentName.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const componentInfo = getComponentInfo(componentName);

  // Cache for 30 minutes
  cache.set(cacheKey, componentInfo, 30 * 60 * 1000);

  return componentInfo;
}

function getComponentInfo(componentName: string) {
  const components: Record<string, any> = {
    'reactflow': {
      name: '<ReactFlow />',
      type: 'Core Component',
      description: 'The main component for rendering interactive node-based graphs. It handles panning, zooming, selecting, and connecting nodes.',
      props: [
        { name: 'nodes', type: 'Node[]', description: 'Array of nodes to render', required: true },
        { name: 'edges', type: 'Edge[]', description: 'Array of edges connecting nodes', required: true },
        { name: 'onNodesChange', type: 'OnNodesChange', description: 'Callback when nodes change (move, select, remove)' },
        { name: 'onEdgesChange', type: 'OnEdgesChange', description: 'Callback when edges change (select, remove)' },
        { name: 'onConnect', type: 'OnConnect', description: 'Callback when a new connection is made' },
        { name: 'nodeTypes', type: 'NodeTypes', description: 'Custom node type components' },
        { name: 'edgeTypes', type: 'EdgeTypes', description: 'Custom edge type components' },
        { name: 'defaultViewport', type: 'Viewport', description: 'Initial viewport position and zoom' },
        { name: 'minZoom', type: 'number', description: 'Minimum zoom level', default: '0.5' },
        { name: 'maxZoom', type: 'number', description: 'Maximum zoom level', default: '2' },
        { name: 'fitView', type: 'boolean', description: 'Fit all nodes in view on load', default: 'false' },
        { name: 'snapToGrid', type: 'boolean', description: 'Snap nodes to grid when dragging', default: 'false' },
        { name: 'snapGrid', type: '[number, number]', description: 'Grid size for snapping', default: '[15, 15]' },
        { name: 'connectionMode', type: 'ConnectionMode', description: 'How connections can be made (strict or loose)' },
        { name: 'panOnDrag', type: 'boolean | number[]', description: 'Enable panning on drag', default: 'true' },
        { name: 'selectionOnDrag', type: 'boolean', description: 'Enable selection box on drag', default: 'false' },
        { name: 'panOnScroll', type: 'boolean', description: 'Enable panning on scroll', default: 'false' },
        { name: 'zoomOnScroll', type: 'boolean', description: 'Enable zoom on scroll', default: 'true' },
        { name: 'zoomOnPinch', type: 'boolean', description: 'Enable zoom on pinch gesture', default: 'true' },
        { name: 'zoomOnDoubleClick', type: 'boolean', description: 'Enable zoom on double click', default: 'true' },
        { name: 'preventScrolling', type: 'boolean', description: 'Prevent page scrolling when over flow', default: 'true' },
        { name: 'nodesDraggable', type: 'boolean', description: 'Allow nodes to be dragged', default: 'true' },
        { name: 'nodesConnectable', type: 'boolean', description: 'Allow nodes to be connected', default: 'true' },
        { name: 'elementsSelectable', type: 'boolean', description: 'Allow elements to be selected', default: 'true' },
        { name: 'proOptions', type: 'ProOptions', description: 'React Flow Pro options (remove attribution, etc.)' }
      ],
      example: `import { ReactFlow, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: '2', position: { x: 200, y: 100 }, data: { label: 'Node 2' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
];

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
      fitView
    />
  );
}`
    },

    'reactflowprovider': {
      name: '<ReactFlowProvider />',
      type: 'Provider Component',
      description: 'Context provider that enables React Flow hooks to be used outside of the ReactFlow component. Required when using hooks like useReactFlow() in parent components.',
      props: [],
      example: `import { ReactFlow, ReactFlowProvider, useReactFlow } from '@xyflow/react';

function FlowControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div>
      <button onClick={() => zoomIn()}>Zoom In</button>
      <button onClick={() => zoomOut()}>Zoom Out</button>
      <button onClick={() => fitView()}>Fit View</button>
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <FlowControls />
      <ReactFlow nodes={nodes} edges={edges} />
    </ReactFlowProvider>
  );
}`
    },

    'background': {
      name: '<Background />',
      type: 'Helper Component',
      description: 'Renders a customizable background pattern (dots, lines, or cross) behind the flow.',
      props: [
        { name: 'variant', type: '"dots" | "lines" | "cross"', description: 'Background pattern type', default: '"dots"' },
        { name: 'gap', type: 'number | [number, number]', description: 'Gap between pattern elements', default: '20' },
        { name: 'size', type: 'number', description: 'Size of pattern elements', default: '1' },
        { name: 'color', type: 'string', description: 'Color of the background pattern' },
        { name: 'bgColor', type: 'string', description: 'Background color of the canvas' },
        { name: 'lineWidth', type: 'number', description: 'Width of lines (for lines/cross variants)', default: '1' }
      ],
      example: `import { ReactFlow, Background, BackgroundVariant } from '@xyflow/react';

function Flow() {
  return (
    <ReactFlow nodes={nodes} edges={edges}>
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  );
}`
    },

    'controls': {
      name: '<Controls />',
      type: 'Helper Component',
      description: 'Renders zoom and fit-view controls for the flow.',
      props: [
        { name: 'showZoom', type: 'boolean', description: 'Show zoom in/out buttons', default: 'true' },
        { name: 'showFitView', type: 'boolean', description: 'Show fit view button', default: 'true' },
        { name: 'showInteractive', type: 'boolean', description: 'Show interactive toggle button', default: 'true' },
        { name: 'position', type: 'PanelPosition', description: 'Position of controls panel', default: '"bottom-left"' },
        { name: 'fitViewOptions', type: 'FitViewOptions', description: 'Options for fit view behavior' },
        { name: 'onZoomIn', type: '() => void', description: 'Callback when zoom in is clicked' },
        { name: 'onZoomOut', type: '() => void', description: 'Callback when zoom out is clicked' },
        { name: 'onFitView', type: '() => void', description: 'Callback when fit view is clicked' },
        { name: 'onInteractiveChange', type: '(interactive: boolean) => void', description: 'Callback when interactive mode changes' }
      ],
      example: `import { ReactFlow, Controls } from '@xyflow/react';

function Flow() {
  return (
    <ReactFlow nodes={nodes} edges={edges}>
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}`
    },

    'minimap': {
      name: '<MiniMap />',
      type: 'Helper Component',
      description: 'Renders a small overview map of the entire flow for navigation.',
      props: [
        { name: 'nodeColor', type: 'string | (node: Node) => string', description: 'Color of nodes in minimap' },
        { name: 'nodeStrokeColor', type: 'string | (node: Node) => string', description: 'Stroke color of nodes' },
        { name: 'nodeBorderRadius', type: 'number', description: 'Border radius of nodes', default: '5' },
        { name: 'nodeStrokeWidth', type: 'number', description: 'Stroke width of nodes', default: '2' },
        { name: 'maskColor', type: 'string', description: 'Color of the mask overlay' },
        { name: 'maskStrokeColor', type: 'string', description: 'Stroke color of viewport indicator' },
        { name: 'maskStrokeWidth', type: 'number', description: 'Stroke width of viewport indicator' },
        { name: 'position', type: 'PanelPosition', description: 'Position of minimap', default: '"bottom-right"' },
        { name: 'pannable', type: 'boolean', description: 'Allow panning via minimap', default: 'false' },
        { name: 'zoomable', type: 'boolean', description: 'Allow zooming via minimap', default: 'false' },
        { name: 'inversePan', type: 'boolean', description: 'Invert panning direction', default: 'false' }
      ],
      example: `import { ReactFlow, MiniMap } from '@xyflow/react';

function Flow() {
  return (
    <ReactFlow nodes={nodes} edges={edges}>
      <MiniMap
        nodeColor={(node) => node.type === 'input' ? 'blue' : 'gray'}
        pannable
        zoomable
      />
    </ReactFlow>
  );
}`
    },

    'panel': {
      name: '<Panel />',
      type: 'Helper Component',
      description: 'A helper component to render content on top of the flow at specific positions.',
      props: [
        { name: 'position', type: 'PanelPosition', description: 'Position of the panel', required: true },
        { name: 'children', type: 'ReactNode', description: 'Content to render in the panel' },
        { name: 'className', type: 'string', description: 'CSS class name' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles' }
      ],
      example: `import { ReactFlow, Panel } from '@xyflow/react';

function Flow() {
  return (
    <ReactFlow nodes={nodes} edges={edges}>
      <Panel position="top-right">
        <button>Custom Button</button>
      </Panel>
    </ReactFlow>
  );
}`
    },

    'handle': {
      name: '<Handle />',
      type: 'Node Component',
      description: 'Connection point for edges on custom nodes. Handles define where edges can connect.',
      props: [
        { name: 'type', type: '"source" | "target"', description: 'Handle type (outgoing or incoming)', required: true },
        { name: 'position', type: 'Position', description: 'Position on node (Top, Bottom, Left, Right)', required: true },
        { name: 'id', type: 'string', description: 'Unique identifier for multiple handles' },
        { name: 'isConnectable', type: 'boolean', description: 'Whether handle can be connected', default: 'true' },
        { name: 'isConnectableStart', type: 'boolean', description: 'Can start connections from handle' },
        { name: 'isConnectableEnd', type: 'boolean', description: 'Can end connections at handle' },
        { name: 'onConnect', type: '(connection: Connection) => void', description: 'Callback when connection made' },
        { name: 'isValidConnection', type: '(connection: Connection) => boolean', description: 'Validate connection' }
      ],
      example: `import { Handle, Position } from '@xyflow/react';

function CustomNode({ data }) {
  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" style={{ left: 10 }} />
    </div>
  );
}`
    },

    'baseedge': {
      name: '<BaseEdge />',
      type: 'Edge Component',
      description: 'Base component for creating custom edges. Renders the SVG path for an edge.',
      props: [
        { name: 'path', type: 'string', description: 'SVG path string for the edge', required: true },
        { name: 'labelX', type: 'number', description: 'X position of edge label' },
        { name: 'labelY', type: 'number', description: 'Y position of edge label' },
        { name: 'label', type: 'ReactNode', description: 'Edge label content' },
        { name: 'labelStyle', type: 'CSSProperties', description: 'Styles for the label' },
        { name: 'labelShowBg', type: 'boolean', description: 'Show background behind label', default: 'true' },
        { name: 'labelBgStyle', type: 'CSSProperties', description: 'Styles for label background' },
        { name: 'labelBgPadding', type: '[number, number]', description: 'Padding for label background', default: '[2, 4]' },
        { name: 'labelBgBorderRadius', type: 'number', description: 'Border radius of label background', default: '2' },
        { name: 'style', type: 'CSSProperties', description: 'Styles for the edge path' },
        { name: 'markerEnd', type: 'string', description: 'Marker at end of edge' },
        { name: 'markerStart', type: 'string', description: 'Marker at start of edge' },
        { name: 'interactionWidth', type: 'number', description: 'Width of interaction area', default: '20' }
      ],
      example: `import { BaseEdge, getSmoothStepPath } from '@xyflow/react';

function CustomEdge({ sourceX, sourceY, targetX, targetY, ...props }) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <BaseEdge path={edgePath} labelX={labelX} labelY={labelY} {...props} />
  );
}`
    },

    'edgelabelrenderer': {
      name: '<EdgeLabelRenderer />',
      type: 'Edge Component',
      description: 'Renders edge labels outside the SVG context for better styling capabilities and performance.',
      props: [],
      example: `import { BaseEdge, EdgeLabelRenderer, getStraightPath } from '@xyflow/react';

function CustomEdge({ sourceX, sourceY, targetX, targetY, label }) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX, sourceY, targetX, targetY
  });

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
          className="edge-label"
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}`
    },

    'noderesizer': {
      name: '<NodeResizer />',
      type: 'Node Component',
      description: 'Adds resize handles to custom nodes, allowing users to resize nodes interactively.',
      props: [
        { name: 'minWidth', type: 'number', description: 'Minimum width of node', default: '10' },
        { name: 'minHeight', type: 'number', description: 'Minimum height of node', default: '10' },
        { name: 'maxWidth', type: 'number', description: 'Maximum width of node' },
        { name: 'maxHeight', type: 'number', description: 'Maximum height of node' },
        { name: 'keepAspectRatio', type: 'boolean', description: 'Maintain aspect ratio while resizing', default: 'false' },
        { name: 'shouldResize', type: '(event, params) => boolean', description: 'Control whether resize should happen' },
        { name: 'onResizeStart', type: '(event, params) => void', description: 'Callback when resize starts' },
        { name: 'onResize', type: '(event, params) => void', description: 'Callback during resize' },
        { name: 'onResizeEnd', type: '(event, params) => void', description: 'Callback when resize ends' },
        { name: 'isVisible', type: 'boolean', description: 'Show resizer handles', default: 'true' },
        { name: 'lineClassName', type: 'string', description: 'Class for resize lines' },
        { name: 'handleClassName', type: 'string', description: 'Class for resize handles' }
      ],
      example: `import { Handle, Position, NodeResizer } from '@xyflow/react';

function ResizableNode({ data }) {
  return (
    <>
      <NodeResizer minWidth={100} minHeight={50} />
      <Handle type="target" position={Position.Top} />
      <div style={{ padding: 10 }}>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}`
    },

    'nodetoolbar': {
      name: '<NodeToolbar />',
      type: 'Node Component',
      description: 'Renders a toolbar that appears when a node is selected.',
      props: [
        { name: 'nodeId', type: 'string | string[]', description: 'ID(s) of node(s) to attach toolbar to' },
        { name: 'isVisible', type: 'boolean', description: 'Control visibility' },
        { name: 'position', type: 'Position', description: 'Position relative to node', default: 'Position.Top' },
        { name: 'offset', type: 'number', description: 'Offset from node', default: '10' },
        { name: 'align', type: '"center" | "start" | "end"', description: 'Alignment of toolbar', default: '"center"' }
      ],
      example: `import { Handle, Position, NodeToolbar } from '@xyflow/react';

function NodeWithToolbar({ data }) {
  return (
    <>
      <NodeToolbar>
        <button>Edit</button>
        <button>Delete</button>
      </NodeToolbar>
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}`
    },

    'viewportportal': {
      name: '<ViewportPortal />',
      type: 'Helper Component',
      description: 'Renders content in the viewport coordinate system, useful for custom overlays that should transform with the viewport.',
      props: [],
      example: `import { ReactFlow, ViewportPortal } from '@xyflow/react';

function Flow() {
  return (
    <ReactFlow nodes={nodes} edges={edges}>
      <ViewportPortal>
        <div style={{ transform: 'translate(100px, 100px)' }}>
          This content moves with the viewport
        </div>
      </ViewportPortal>
    </ReactFlow>
  );
}`
    },

    'controlbutton': {
      name: '<ControlButton />',
      type: 'Helper Component',
      description: 'A button component for adding custom buttons to the Controls panel.',
      props: [
        { name: 'children', type: 'ReactNode', description: 'Button content' },
        { name: 'onClick', type: '() => void', description: 'Click handler' },
        { name: 'className', type: 'string', description: 'CSS class name' },
        { name: 'title', type: 'string', description: 'Button title/tooltip' }
      ],
      example: `import { ReactFlow, Controls, ControlButton } from '@xyflow/react';
import { FaCamera } from 'react-icons/fa';

function Flow() {
  const onScreenshot = () => {
    // Take screenshot logic
  };

  return (
    <ReactFlow nodes={nodes} edges={edges}>
      <Controls>
        <ControlButton onClick={onScreenshot} title="Take Screenshot">
          <FaCamera />
        </ControlButton>
      </Controls>
    </ReactFlow>
  );
}`
    }
  };

  const normalizedName = componentName.toLowerCase().replace(/[<>\/\s]/g, '');
  const component = components[normalizedName];

  if (!component) {
    return {
      content: [{
        type: "text",
        text: `Component "${componentName}" not found. Available components: ${Object.keys(components).map(k => components[k].name).join(', ')}`
      }]
    };
  }

  let content = `# ${component.name}\n\n`;
  content += `**Type:** ${component.type}\n\n`;
  content += `**Description:** ${component.description}\n\n`;

  if (component.props && component.props.length > 0) {
    content += `## Props\n\n`;
    component.props.forEach((prop: any) => {
      content += `- **${prop.name}** (\`${prop.type}\`)${prop.required ? ' *required*' : ''}: ${prop.description}`;
      if (prop.default) content += ` - Default: \`${prop.default}\``;
      content += `\n`;
    });
    content += `\n`;
  }

  if (component.example) {
    content += `## Example\n\n\`\`\`tsx\n${component.example}\n\`\`\`\n`;
  }

  return {
    content: [{
      type: "text",
      text: content
    }]
  };
}
