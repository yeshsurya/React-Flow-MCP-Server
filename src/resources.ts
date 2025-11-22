/**
 * Resources for the React Flow MCP server
 *
 * Resources are static or dynamically generated content that can be retrieved by MCP clients.
 * These provide information about available React Flow components, hooks, and utilities.
 */

export const resources = [
  {
    uri: "resource:get_react_flow_api",
    name: "React Flow API Reference",
    description: "Overview of all React Flow components, hooks, types, and utilities",
    mimeType: "text/plain"
  }
];

export const resourceHandlers = {
  "resource:get_react_flow_api": () => ({
    contentType: "text/plain",
    content: `# React Flow API Reference

## Components

### Core Components
- <ReactFlow /> - Main component for rendering interactive node-based graphs
- <ReactFlowProvider /> - Context provider for using hooks outside the main component

### Helper Components
- <Background /> - Renders customizable background patterns (dots, lines, cross)
- <Controls /> - Renders zoom and fit-view controls
- <MiniMap /> - Renders a small overview map for navigation
- <Panel /> - Helper component to render content at specific positions
- <ViewportPortal /> - Renders content in the viewport coordinate system
- <ControlButton /> - Custom button for the Controls panel

### Node Components
- <Handle /> - Connection point for edges on custom nodes
- <NodeResizer /> - Adds resize handles to custom nodes
- <NodeResizeControl /> - Individual resize control
- <NodeToolbar /> - Toolbar that appears when a node is selected

### Edge Components
- <BaseEdge /> - Base component for creating custom edges
- <EdgeLabelRenderer /> - Renders edge labels outside SVG for better styling

## Hooks

### State Hooks
- useNodes() - Returns the current nodes array
- useEdges() - Returns the current edges array
- useNodesState() - Convenience hook for nodes state management
- useEdgesState() - Convenience hook for edges state management
- useNodesData() - Returns data of specified nodes

### Viewport Hooks
- useViewport() - Returns current viewport (x, y, zoom)
- useOnViewportChange() - Register viewport change callbacks

### Connection Hooks
- useConnection() - Returns info about current connection being made
- useHandleConnections() - Returns connections for a specific handle
- useNodeConnections() - Returns all connections for the current node

### Selection Hooks
- useOnSelectionChange() - Register selection change callback

### Store Hooks
- useStore() - Access internal zustand store with selector
- useStoreApi() - Returns store API for reading without subscribing

### Utility Hooks
- useReactFlow() - Returns React Flow instance with control methods
- useNodeId() - Returns ID of current node (inside custom nodes)
- useUpdateNodeInternals() - Function to update node handle positions
- useNodesInitialized() - Returns true when all nodes are measured
- useInternalNode() - Returns internal node data with dimensions
- useKeyPress() - Returns whether a key is pressed

## Types

### Core Types
- Node<T> - Represents a node in the flow
- Edge<T> - Represents an edge connecting nodes
- Connection - Represents a connection between handles
- Viewport - Current view state (x, y, zoom)

### Geometry Types
- XYPosition - Simple x/y coordinate pair
- Rect - Rectangle with position and dimensions
- Dimensions - Width and height
- CoordinateExtent - Bounding box

### Change Types
- NodeChange - Union type for all node changes
- EdgeChange - Union type for all edge changes

### Enum Types
- Position - Handle positions (Top, Bottom, Left, Right)
- MarkerType - Edge markers (Arrow, ArrowClosed)
- ConnectionMode - Connection behavior (Strict, Loose)
- PanelPosition - Panel positions

### Callback Types
- OnConnect - Connection created callback
- OnNodesChange - Nodes changed callback
- OnEdgesChange - Edges changed callback

## Utility Functions

### Edge Utilities
- addEdge() - Add a new edge to an array
- reconnectEdge() - Update an edge with new connection

### Node/Edge Change Utilities
- applyNodeChanges() - Apply changes to nodes array
- applyEdgeChanges() - Apply changes to edges array

### Path Utilities
- getBezierPath() - Calculate bezier curve path
- getSimpleBezierPath() - Calculate simple bezier path
- getSmoothStepPath() - Calculate smooth step path
- getStraightPath() - Calculate straight line path

### Graph Utilities
- getConnectedEdges() - Get edges connected to nodes
- getIncomers() - Get nodes with edges to target
- getOutgoers() - Get nodes target points to

### Layout Utilities
- getNodesBounds() - Calculate bounding box for nodes
- getViewportForBounds() - Calculate viewport to fit bounds

### Validation Utilities
- isNode() - Type guard for Node
- isEdge() - Type guard for Edge

---

For detailed information about any item, use the corresponding tool:
- get_react_flow_component - Component details
- get_react_flow_hook - Hook details
- get_react_flow_type - Type details
- get_react_flow_utility - Utility details

For code examples:
- get_react_flow_example - Get complete examples
- search_react_flow_examples - Search examples

For documentation:
- get_react_flow_docs - Get guides and tutorials
`
  })
};
