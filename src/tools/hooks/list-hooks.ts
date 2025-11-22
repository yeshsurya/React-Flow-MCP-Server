import { z } from 'zod';
import { cache } from '../../utils/cache.js';
import { logInfo } from '../../utils/logger.js';

export const schema = {
  category: z.string().optional().describe('Filter by category (state, viewport, connection, selection, store, utility)')
};

export async function handleListHooks(params: { category?: string }) {
  const { category } = params;

  logInfo(`Listing React Flow hooks${category ? ` in category: ${category}` : ''}`);

  const cacheKey = `react-flow-hooks-list-${category || 'all'}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const result = getHooksList(category);

  cache.set(cacheKey, result, 60 * 60 * 1000);

  return result;
}

function getHooksList(category?: string) {
  const hooks = {
    state: [
      { name: 'useNodes()', description: 'Returns the current nodes array' },
      { name: 'useEdges()', description: 'Returns the current edges array' },
      { name: 'useNodesState()', description: 'Convenience hook for nodes state management' },
      { name: 'useEdgesState()', description: 'Convenience hook for edges state management' },
      { name: 'useNodesData()', description: 'Returns data of specified nodes' }
    ],
    viewport: [
      { name: 'useViewport()', description: 'Returns current viewport (x, y, zoom)' },
      { name: 'useOnViewportChange()', description: 'Register viewport change callbacks' }
    ],
    connection: [
      { name: 'useConnection()', description: 'Returns info about current connection being made' },
      { name: 'useHandleConnections()', description: 'Returns connections for a specific handle' },
      { name: 'useNodeConnections()', description: 'Returns all connections for the current node' }
    ],
    selection: [
      { name: 'useOnSelectionChange()', description: 'Register selection change callback' }
    ],
    store: [
      { name: 'useStore()', description: 'Access internal zustand store with selector' },
      { name: 'useStoreApi()', description: 'Returns store API for reading without subscribing' }
    ],
    utility: [
      { name: 'useReactFlow()', description: 'Returns React Flow instance with control methods' },
      { name: 'useNodeId()', description: 'Returns ID of current node (inside custom nodes)' },
      { name: 'useUpdateNodeInternals()', description: 'Function to update node handle positions' },
      { name: 'useNodesInitialized()', description: 'Returns true when all nodes are measured' },
      { name: 'useInternalNode()', description: 'Returns internal node data with dimensions' },
      { name: 'useKeyPress()', description: 'Returns whether a key is pressed' }
    ]
  };

  let filteredHooks: { category: string; hooks: typeof hooks.state }[] = [];

  if (category) {
    const normalizedCategory = category.toLowerCase();
    if (hooks[normalizedCategory as keyof typeof hooks]) {
      filteredHooks = [{
        category: normalizedCategory,
        hooks: hooks[normalizedCategory as keyof typeof hooks]
      }];
    } else {
      return {
        content: [{
          type: "text",
          text: `Category "${category}" not found. Available categories: state, viewport, connection, selection, store, utility`
        }]
      };
    }
  } else {
    filteredHooks = Object.entries(hooks).map(([cat, hks]) => ({
      category: cat,
      hooks: hks
    }));
  }

  let content = `# React Flow Hooks\n\n`;

  filteredHooks.forEach(({ category: cat, hooks: hks }) => {
    content += `## ${cat.charAt(0).toUpperCase() + cat.slice(1)} Hooks\n\n`;
    hks.forEach((hook) => {
      content += `- **${hook.name}**: ${hook.description}\n`;
    });
    content += `\n`;
  });

  content += `\n---\n\n`;
  content += `Use \`get_react_flow_hook\` to get detailed information about a specific hook.\n`;

  return {
    content: [{
      type: "text",
      text: content
    }]
  };
}
