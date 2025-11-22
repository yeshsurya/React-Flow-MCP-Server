/**
 * Tool registry for the React Flow MCP server.
 *
 * Exports all tool handlers and their schemas for registration with the MCP server.
 */

// Component tools
import { handleGetComponent } from './components/get-component.js';
import { handleListComponents } from './components/list-components.js';

// Hook tools
import { handleGetHook } from './hooks/get-hook.js';
import { handleListHooks } from './hooks/list-hooks.js';

// Type tools
import { handleGetType } from './types/get-type.js';
import { handleListTypes } from './types/list-types.js';

// Utility tools
import { handleGetUtility } from './utilities/get-utility.js';
import { handleListUtilities } from './utilities/list-utilities.js';

// Example tools
import { handleGetExample } from './examples/get-example.js';
import { handleSearchExamples } from './examples/search-examples.js';

// Documentation tools
import { handleGetDocs } from './docs/get-docs.js';

/**
 * Tool handlers mapped by name
 */
export const toolHandlers = {
  get_react_flow_component: handleGetComponent,
  list_react_flow_components: handleListComponents,
  get_react_flow_hook: handleGetHook,
  list_react_flow_hooks: handleListHooks,
  get_react_flow_type: handleGetType,
  list_react_flow_types: handleListTypes,
  get_react_flow_utility: handleGetUtility,
  list_react_flow_utilities: handleListUtilities,
  get_react_flow_example: handleGetExample,
  search_react_flow_examples: handleSearchExamples,
  get_react_flow_docs: handleGetDocs,
};

/**
 * Tool definitions for MCP registration
 */
export const tools = [
  {
    name: 'get_react_flow_component',
    description: 'Get detailed information about a specific React Flow component',
    inputSchema: {
      type: 'object',
      properties: {
        componentName: {
          type: 'string',
          description: 'Name of the React Flow component (e.g., "ReactFlow", "Handle", "Background")',
        },
      },
      required: ['componentName'],
    },
  },
  {
    name: 'list_react_flow_components',
    description: 'List all available React Flow components',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by category (core, helper, node, edge)',
        },
      },
    },
  },
  {
    name: 'get_react_flow_hook',
    description: 'Get detailed information about a specific React Flow hook',
    inputSchema: {
      type: 'object',
      properties: {
        hookName: {
          type: 'string',
          description: 'Name of the React Flow hook (e.g., "useReactFlow", "useNodes", "useEdges")',
        },
      },
      required: ['hookName'],
    },
  },
  {
    name: 'list_react_flow_hooks',
    description: 'List all available React Flow hooks',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by category (state, viewport, connection, selection, store, utility)',
        },
      },
    },
  },
  {
    name: 'get_react_flow_type',
    description: 'Get detailed information about a specific React Flow type',
    inputSchema: {
      type: 'object',
      properties: {
        typeName: {
          type: 'string',
          description: 'Name of the React Flow type (e.g., "Node", "Edge", "Viewport")',
        },
      },
      required: ['typeName'],
    },
  },
  {
    name: 'list_react_flow_types',
    description: 'List all available React Flow types',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by category (core, geometry, change, enum, configuration, callback)',
        },
      },
    },
  },
  {
    name: 'get_react_flow_utility',
    description: 'Get detailed information about a specific React Flow utility function',
    inputSchema: {
      type: 'object',
      properties: {
        utilityName: {
          type: 'string',
          description: 'Name of the utility function (e.g., "addEdge", "applyNodeChanges", "getBezierPath")',
        },
      },
      required: ['utilityName'],
    },
  },
  {
    name: 'list_react_flow_utilities',
    description: 'List all available React Flow utility functions',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_react_flow_example',
    description: 'Get a complete code example for a specific React Flow use case',
    inputSchema: {
      type: 'object',
      properties: {
        exampleType: {
          type: 'string',
          description: 'Type of example (e.g., "basic-flow", "custom-node", "drag-and-drop")',
        },
      },
      required: ['exampleType'],
    },
  },
  {
    name: 'search_react_flow_examples',
    description: 'Search React Flow examples by keyword',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (e.g., "drag", "custom", "layout")',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_react_flow_docs',
    description: 'Get documentation for React Flow concepts and features',
    inputSchema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'Documentation topic (e.g., "getting-started", "concepts", "performance")',
        },
      },
      required: ['topic'],
    },
  },
];

export type ToolName = keyof typeof toolHandlers;
