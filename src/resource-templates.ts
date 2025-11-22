/**
 * Resource templates for the React Flow MCP server
 *
 * Resource templates generate dynamic content based on URI patterns.
 */

export const resourceTemplates = [
  {
    uriTemplate: "reactflow://component/{componentName}",
    name: "React Flow Component",
    description: "Get detailed information about a specific React Flow component",
    mimeType: "text/plain"
  },
  {
    uriTemplate: "reactflow://hook/{hookName}",
    name: "React Flow Hook",
    description: "Get detailed information about a specific React Flow hook",
    mimeType: "text/plain"
  },
  {
    uriTemplate: "reactflow://example/{exampleType}",
    name: "React Flow Example",
    description: "Get a complete code example for a specific use case",
    mimeType: "text/plain"
  }
];

/**
 * Parse a URI and return the appropriate resource template handler
 */
export function getResourceTemplate(uri: string): (() => { contentType: string; content: string }) | null {
  // Component template: reactflow://component/{componentName}
  const componentMatch = uri.match(/^reactflow:\/\/component\/(.+)$/);
  if (componentMatch) {
    const componentName = componentMatch[1];
    return () => ({
      contentType: "text/plain",
      content: `# React Flow Component: ${componentName}

Use the 'get_react_flow_component' tool with componentName="${componentName}" to get detailed information about this component.

Quick reference for ${componentName}:
- Import: import { ${componentName} } from '@xyflow/react';
- Usage: <${componentName} ... />

For full documentation including props, examples, and best practices, use the tool mentioned above.`
    });
  }

  // Hook template: reactflow://hook/{hookName}
  const hookMatch = uri.match(/^reactflow:\/\/hook\/(.+)$/);
  if (hookMatch) {
    const hookName = hookMatch[1];
    return () => ({
      contentType: "text/plain",
      content: `# React Flow Hook: ${hookName}

Use the 'get_react_flow_hook' tool with hookName="${hookName}" to get detailed information about this hook.

Quick reference for ${hookName}:
- Import: import { ${hookName} } from '@xyflow/react';
- Usage: const result = ${hookName}();

For full documentation including parameters, return values, and examples, use the tool mentioned above.`
    });
  }

  // Example template: reactflow://example/{exampleType}
  const exampleMatch = uri.match(/^reactflow:\/\/example\/(.+)$/);
  if (exampleMatch) {
    const exampleType = exampleMatch[1];
    return () => ({
      contentType: "text/plain",
      content: `# React Flow Example: ${exampleType}

Use the 'get_react_flow_example' tool with exampleType="${exampleType}" to get the complete code for this example.

This example demonstrates: ${exampleType.replace(/-/g, ' ')}

For the full implementation with code, styling, and explanations, use the tool mentioned above.`
    });
  }

  return null;
}
