import { z } from 'zod';
import { cache } from '../../utils/cache.js';
import { logInfo } from '../../utils/logger.js';

export const schema = {
  category: z.string().optional().describe('Filter by category (core, helper, node, edge)')
};

export async function handleListComponents(params: { category?: string }) {
  const { category } = params;

  logInfo(`Listing React Flow components${category ? ` in category: ${category}` : ''}`);

  // Check cache first
  const cacheKey = `react-flow-components-list-${category || 'all'}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const result = getComponentsList(category);

  // Cache for 1 hour
  cache.set(cacheKey, result, 60 * 60 * 1000);

  return result;
}

function getComponentsList(category?: string) {
  const components = {
    core: [
      { name: '<ReactFlow />', description: 'Main component for rendering interactive node-based graphs' },
      { name: '<ReactFlowProvider />', description: 'Context provider for using React Flow hooks outside the main component' }
    ],
    helper: [
      { name: '<Background />', description: 'Renders a customizable background pattern (dots, lines, cross)' },
      { name: '<Controls />', description: 'Renders zoom and fit-view controls' },
      { name: '<MiniMap />', description: 'Renders a small overview map for navigation' },
      { name: '<Panel />', description: 'Helper component to render content at specific positions' },
      { name: '<ViewportPortal />', description: 'Renders content in the viewport coordinate system' },
      { name: '<ControlButton />', description: 'Custom button component for the Controls panel' }
    ],
    node: [
      { name: '<Handle />', description: 'Connection point for edges on custom nodes' },
      { name: '<NodeResizer />', description: 'Adds resize handles to custom nodes' },
      { name: '<NodeResizeControl />', description: 'Individual resize control for custom positioning' },
      { name: '<NodeToolbar />', description: 'Toolbar that appears when a node is selected' }
    ],
    edge: [
      { name: '<BaseEdge />', description: 'Base component for creating custom edges' },
      { name: '<EdgeLabelRenderer />', description: 'Renders edge labels outside SVG for better styling' },
      { name: '<EdgeToolbar />', description: 'Toolbar that appears when an edge is selected' }
    ]
  };

  let filteredComponents: { category: string; components: typeof components.core }[] = [];

  if (category) {
    const normalizedCategory = category.toLowerCase();
    if (components[normalizedCategory as keyof typeof components]) {
      filteredComponents = [{
        category: normalizedCategory,
        components: components[normalizedCategory as keyof typeof components]
      }];
    } else {
      return {
        content: [{
          type: "text",
          text: `Category "${category}" not found. Available categories: core, helper, node, edge`
        }]
      };
    }
  } else {
    filteredComponents = Object.entries(components).map(([cat, comps]) => ({
      category: cat,
      components: comps
    }));
  }

  let content = `# React Flow Components\n\n`;

  filteredComponents.forEach(({ category: cat, components: comps }) => {
    content += `## ${cat.charAt(0).toUpperCase() + cat.slice(1)} Components\n\n`;
    comps.forEach((comp) => {
      content += `- **${comp.name}**: ${comp.description}\n`;
    });
    content += `\n`;
  });

  content += `\n---\n\n`;
  content += `Use \`get_react_flow_component\` to get detailed information about a specific component.\n`;

  return {
    content: [{
      type: "text",
      text: content
    }]
  };
}
