import { z } from 'zod';
import { cache } from '../../utils/cache.js';
import { logInfo } from '../../utils/logger.js';

export const schema = {
  query: z.string().describe('Search query for examples')
};

export async function handleSearchExamples(params: { query: string }) {
  const { query } = params;

  logInfo(`Searching React Flow examples for: ${query}`);

  const cacheKey = `react-flow-example-search-${query.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const result = searchExamples(query);

  cache.set(cacheKey, result, 15 * 60 * 1000);

  return result;
}

function searchExamples(query: string) {
  const examples = [
    {
      id: 'basic-flow',
      name: 'Basic Flow',
      description: 'A simple React Flow setup with nodes, edges, and basic interactivity.',
      tags: ['beginner', 'setup', 'nodes', 'edges', 'getting-started']
    },
    {
      id: 'custom-node',
      name: 'Custom Node',
      description: 'Creating a custom node component with handles and custom styling.',
      tags: ['intermediate', 'custom', 'nodes', 'handles', 'styling']
    },
    {
      id: 'custom-edge',
      name: 'Custom Edge',
      description: 'Creating a custom edge with a button to delete the connection.',
      tags: ['intermediate', 'custom', 'edges', 'delete', 'interactive']
    },
    {
      id: 'drag-and-drop',
      name: 'Drag and Drop',
      description: 'Adding nodes via drag and drop from a sidebar.',
      tags: ['intermediate', 'drag-drop', 'add-nodes', 'sidebar', 'dnd']
    },
    {
      id: 'sub-flows',
      name: 'Sub Flows (Nested Nodes)',
      description: 'Creating nodes that contain other nodes using parent-child relationships.',
      tags: ['advanced', 'nested', 'groups', 'layout', 'parent', 'child']
    },
    {
      id: 'validation',
      name: 'Connection Validation',
      description: 'Validating connections before they are created.',
      tags: ['intermediate', 'validation', 'connections', 'isValidConnection']
    },
    {
      id: 'save-restore',
      name: 'Save and Restore',
      description: 'Saving flow state to JSON and restoring it.',
      tags: ['intermediate', 'persistence', 'json', 'localStorage', 'save', 'load']
    },
    {
      id: 'resizable-node',
      name: 'Resizable Node',
      description: 'Creating nodes that can be resized by users.',
      tags: ['intermediate', 'resize', 'custom-node', 'NodeResizer']
    },
    {
      id: 'toolbar-node',
      name: 'Node with Toolbar',
      description: 'Adding a toolbar that appears when a node is selected.',
      tags: ['intermediate', 'toolbar', 'custom-node', 'NodeToolbar', 'selection']
    },
    {
      id: 'layout-elk',
      name: 'Auto Layout with ELK',
      description: 'Using ELK.js for automatic graph layout.',
      tags: ['advanced', 'layout', 'elk', 'auto-layout', 'algorithm']
    },
    {
      id: 'interactive-minimap',
      name: 'Interactive MiniMap',
      description: 'Configuring MiniMap with panning and zooming capabilities.',
      tags: ['beginner', 'minimap', 'navigation', 'overview']
    },
    {
      id: 'edge-types',
      name: 'Built-in Edge Types',
      description: 'Using different built-in edge types: default, straight, step, smoothstep, simplebezier.',
      tags: ['beginner', 'edges', 'types', 'bezier', 'step']
    },
    {
      id: 'context-menu',
      name: 'Context Menu',
      description: 'Adding right-click context menus to nodes and the canvas.',
      tags: ['intermediate', 'context-menu', 'right-click', 'menu']
    },
    {
      id: 'touch-device',
      name: 'Touch Device Support',
      description: 'Optimizing React Flow for touch devices and mobile.',
      tags: ['intermediate', 'touch', 'mobile', 'gestures']
    },
    {
      id: 'undo-redo',
      name: 'Undo/Redo',
      description: 'Implementing undo and redo functionality for flow changes.',
      tags: ['advanced', 'undo', 'redo', 'history', 'state-management']
    }
  ];

  const queryLower = query.toLowerCase();
  const queryTerms = queryLower.split(/\s+/);

  const matches = examples.filter((example) => {
    const searchableText = [
      example.name.toLowerCase(),
      example.description.toLowerCase(),
      ...example.tags.map(t => t.toLowerCase())
    ].join(' ');

    return queryTerms.every(term => searchableText.includes(term));
  });

  if (matches.length === 0) {
    return {
      content: [{
        type: "text",
        text: `No examples found for "${query}". Try searching for:\n\n` +
          `- **Concepts**: nodes, edges, custom, layout, drag-drop\n` +
          `- **Features**: validation, resize, toolbar, minimap\n` +
          `- **Levels**: beginner, intermediate, advanced\n\n` +
          `Or use \`get_react_flow_example\` with a specific example type.`
      }]
    };
  }

  let content = `# Search Results for "${query}"\n\n`;
  content += `Found ${matches.length} example(s):\n\n`;

  matches.forEach((example) => {
    content += `## ${example.name}\n`;
    content += `**ID:** \`${example.id}\`\n`;
    content += `**Description:** ${example.description}\n`;
    content += `**Tags:** ${example.tags.join(', ')}\n\n`;
  });

  content += `---\n\n`;
  content += `Use \`get_react_flow_example\` with the example ID to get the full code.\n`;

  return {
    content: [{
      type: "text",
      text: content
    }]
  };
}
