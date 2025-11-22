import { cache } from '../../utils/cache.js';
import { logInfo } from '../../utils/logger.js';

export async function handleListUtilities() {
  logInfo('Listing React Flow utilities');

  const cacheKey = 'react-flow-utilities-list';
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const result = getUtilitiesList();

  cache.set(cacheKey, result, 60 * 60 * 1000);

  return result;
}

function getUtilitiesList() {
  const utilities = {
    edge: [
      { name: 'addEdge()', description: 'Add a new edge to an existing array' },
      { name: 'reconnectEdge()', description: 'Update an edge with a new connection' }
    ],
    node: [
      { name: 'applyNodeChanges()', description: 'Apply node changes to nodes array' }
    ],
    edgeChanges: [
      { name: 'applyEdgeChanges()', description: 'Apply edge changes to edges array' }
    ],
    path: [
      { name: 'getBezierPath()', description: 'Calculate bezier curve path' },
      { name: 'getSimpleBezierPath()', description: 'Calculate simple bezier path' },
      { name: 'getSmoothStepPath()', description: 'Calculate smooth step path with rounded corners' },
      { name: 'getStraightPath()', description: 'Calculate straight line path' }
    ],
    graph: [
      { name: 'getConnectedEdges()', description: 'Get all edges connected to nodes' },
      { name: 'getIncomers()', description: 'Get nodes with edges pointing to target' },
      { name: 'getOutgoers()', description: 'Get nodes that source points to' }
    ],
    layout: [
      { name: 'getNodesBounds()', description: 'Calculate bounding box for nodes' },
      { name: 'getViewportForBounds()', description: 'Calculate viewport to fit bounds' }
    ],
    validation: [
      { name: 'isNode()', description: 'Type guard for Node' },
      { name: 'isEdge()', description: 'Type guard for Edge' }
    ]
  };

  let content = `# React Flow Utilities\n\n`;

  Object.entries(utilities).forEach(([category, utils]) => {
    content += `## ${category.charAt(0).toUpperCase() + category.slice(1)} Utilities\n\n`;
    utils.forEach((util) => {
      content += `- **${util.name}**: ${util.description}\n`;
    });
    content += `\n`;
  });

  content += `\n---\n\n`;
  content += `Use \`get_react_flow_utility\` to get detailed information about a specific utility.\n`;

  return {
    content: [{
      type: "text",
      text: content
    }]
  };
}
