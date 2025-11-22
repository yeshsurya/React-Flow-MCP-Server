import { z } from 'zod';
import { cache } from '../../utils/cache.js';
import { logInfo } from '../../utils/logger.js';

export const schema = {
  category: z.string().optional().describe('Filter by category (core, geometry, change, enum, configuration, callback)')
};

export async function handleListTypes(params: { category?: string }) {
  const { category } = params;

  logInfo(`Listing React Flow types${category ? ` in category: ${category}` : ''}`);

  const cacheKey = `react-flow-types-list-${category || 'all'}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const result = getTypesList(category);

  cache.set(cacheKey, result, 60 * 60 * 1000);

  return result;
}

function getTypesList(category?: string) {
  const types = {
    core: [
      { name: 'Node<T>', description: 'Represents a node in the flow with custom data type T' },
      { name: 'Edge<T>', description: 'Represents an edge connecting two nodes' },
      { name: 'Connection', description: 'Represents a connection between handles' },
      { name: 'Viewport', description: 'Current view state (x, y, zoom) of the canvas' }
    ],
    geometry: [
      { name: 'XYPosition', description: 'Simple x/y coordinate pair' },
      { name: 'Rect', description: 'Rectangle with position and dimensions' },
      { name: 'Dimensions', description: 'Width and height dimensions' },
      { name: 'CoordinateExtent', description: 'Bounding box for node movement' }
    ],
    change: [
      { name: 'NodeChange', description: 'Union type for all node changes' },
      { name: 'EdgeChange', description: 'Union type for all edge changes' },
      { name: 'NodeAddChange', description: 'Node was added' },
      { name: 'NodeRemoveChange', description: 'Node was removed' },
      { name: 'NodePositionChange', description: 'Node position changed' },
      { name: 'NodeDimensionChange', description: 'Node dimensions changed' },
      { name: 'NodeSelectionChange', description: 'Node selection changed' }
    ],
    enum: [
      { name: 'Position', description: 'Handle and toolbar positions (Top, Bottom, Left, Right)' },
      { name: 'MarkerType', description: 'Edge marker types (Arrow, ArrowClosed)' },
      { name: 'ConnectionMode', description: 'Connection mode (Strict, Loose)' },
      { name: 'PanelPosition', description: 'Panel positions (top-left, bottom-right, etc.)' },
      { name: 'BackgroundVariant', description: 'Background patterns (Dots, Lines, Cross)' },
      { name: 'SelectionMode', description: 'Selection behavior (Partial, Full)' }
    ],
    configuration: [
      { name: 'NodeTypes', description: 'Record mapping node type names to components' },
      { name: 'EdgeTypes', description: 'Record mapping edge type names to components' },
      { name: 'FitViewOptions', description: 'Options for fitView behavior' },
      { name: 'DefaultEdgeOptions', description: 'Default options for all edges' },
      { name: 'ProOptions', description: 'React Flow Pro options' }
    ],
    callback: [
      { name: 'OnConnect', description: 'Callback when a connection is created' },
      { name: 'OnNodesChange', description: 'Callback when nodes change' },
      { name: 'OnEdgesChange', description: 'Callback when edges change' },
      { name: 'OnNodeDrag', description: 'Callback during node drag' },
      { name: 'OnSelectionChange', description: 'Callback when selection changes' },
      { name: 'OnMove', description: 'Callback when viewport moves' },
      { name: 'OnInit', description: 'Callback when React Flow initializes' },
      { name: 'IsValidConnection', description: 'Function to validate connections' }
    ]
  };

  let filteredTypes: { category: string; types: typeof types.core }[] = [];

  if (category) {
    const normalizedCategory = category.toLowerCase();
    if (types[normalizedCategory as keyof typeof types]) {
      filteredTypes = [{
        category: normalizedCategory,
        types: types[normalizedCategory as keyof typeof types]
      }];
    } else {
      return {
        content: [{
          type: "text",
          text: `Category "${category}" not found. Available categories: core, geometry, change, enum, configuration, callback`
        }]
      };
    }
  } else {
    filteredTypes = Object.entries(types).map(([cat, tps]) => ({
      category: cat,
      types: tps
    }));
  }

  let content = `# React Flow Types\n\n`;

  filteredTypes.forEach(({ category: cat, types: tps }) => {
    content += `## ${cat.charAt(0).toUpperCase() + cat.slice(1)} Types\n\n`;
    tps.forEach((type) => {
      content += `- **${type.name}**: ${type.description}\n`;
    });
    content += `\n`;
  });

  content += `\n---\n\n`;
  content += `Use \`get_react_flow_type\` to get detailed information about a specific type.\n`;

  return {
    content: [{
      type: "text",
      text: content
    }]
  };
}
