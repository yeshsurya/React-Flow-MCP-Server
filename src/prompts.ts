/**
 * Prompts for the React Flow MCP server
 *
 * Prompts provide guided interactions for common React Flow tasks.
 */

export const prompts = {
  component_usage: {
    name: "component_usage",
    description: "Get usage examples for a specific React Flow component or hook",
    arguments: [
      {
        name: "name",
        description: "Name of the component or hook (e.g., 'ReactFlow', 'useReactFlow', 'Handle')",
        required: true
      }
    ]
  },
  flow_tutorial: {
    name: "flow_tutorial",
    description: "Get a step-by-step tutorial for common React Flow tasks",
    arguments: [
      {
        name: "task",
        description: "Task type (e.g., 'custom-node', 'drag-drop', 'layout', 'save-restore')",
        required: true
      }
    ]
  },
  best_practices: {
    name: "best_practices",
    description: "Get best practices and tips for React Flow development",
    arguments: [
      {
        name: "topic",
        description: "Topic (e.g., 'performance', 'state-management', 'typescript', 'accessibility')",
        required: true
      }
    ]
  }
};

export const promptHandlers = {
  component_usage: (args: { name?: string }) => {
    const name = args?.name || 'ReactFlow';

    return {
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `Show me how to use the ${name} component/hook in React Flow. Include:
1. Import statement
2. Basic usage example
3. Common props/parameters
4. A practical example with code`
          }
        }
      ]
    };
  },

  flow_tutorial: (args: { task?: string }) => {
    const task = args?.task || 'basic-setup';

    const tutorials: Record<string, string> = {
      'basic-setup': `Create a step-by-step tutorial for setting up a basic React Flow application:
1. Installing dependencies
2. Creating the component structure
3. Defining nodes and edges
4. Adding interactivity (drag, connect, select)
5. Styling the flow

Include complete code examples.`,

      'custom-node': `Create a step-by-step tutorial for creating custom nodes in React Flow:
1. Creating the custom node component
2. Using Handle components for connections
3. Registering custom node types
4. Styling custom nodes
5. Adding interactivity to custom nodes

Include complete code examples with TypeScript types.`,

      'drag-drop': `Create a step-by-step tutorial for implementing drag-and-drop to add nodes:
1. Setting up the sidebar with draggable items
2. Handling drag events
3. Converting screen coordinates to flow coordinates
4. Creating nodes on drop
5. Best practices for drag-and-drop UX

Include complete code examples.`,

      'layout': `Create a step-by-step tutorial for implementing automatic layout in React Flow:
1. Understanding layout requirements
2. Using elkjs or dagre for layout
3. Calculating node positions
4. Applying layout on demand
5. Animating layout changes

Include complete code examples.`,

      'save-restore': `Create a step-by-step tutorial for saving and restoring flow state:
1. Understanding the flow state structure
2. Converting to/from JSON
3. Saving to localStorage
4. Saving to a backend API
5. Restoring state including viewport

Include complete code examples.`,

      'validation': `Create a step-by-step tutorial for implementing connection validation:
1. Understanding connection flow
2. Using isValidConnection prop
3. Validating by node types
4. Preventing cycles
5. Custom validation logic

Include complete code examples.`
    };

    const tutorialPrompt = tutorials[task] || tutorials['basic-setup'];

    return {
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: tutorialPrompt
          }
        }
      ]
    };
  },

  best_practices: (args: { topic?: string }) => {
    const topic = args?.topic || 'general';

    const practices: Record<string, string> = {
      'performance': `Explain React Flow performance best practices:
1. Memoizing components and nodeTypes/edgeTypes
2. Using selectors efficiently with useStore
3. Handling large graphs (1000+ nodes)
4. Optimizing custom nodes
5. Profiling and debugging performance issues

Include code examples for each practice.`,

      'state-management': `Explain state management best practices for React Flow:
1. Controlled vs uncontrolled mode
2. Using useNodesState and useEdgesState
3. Integrating with Zustand
4. Integrating with Redux
5. Managing complex state updates

Include code examples for each approach.`,

      'typescript': `Explain TypeScript best practices for React Flow:
1. Typing node and edge data
2. Creating typed custom nodes
3. Using generic types effectively
4. Typing callbacks and handlers
5. Common TypeScript patterns

Include code examples with proper types.`,

      'accessibility': `Explain accessibility best practices for React Flow:
1. Keyboard navigation
2. ARIA labels and roles
3. Focus management
4. Screen reader support
5. Reduced motion support

Include code examples for accessible implementations.`,

      'general': `Explain general best practices for React Flow development:
1. Project structure and organization
2. Error handling
3. Testing strategies
4. Code organization for custom nodes/edges
5. Common pitfalls to avoid

Include practical tips and examples.`
    };

    const practicePrompt = practices[topic] || practices['general'];

    return {
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: practicePrompt
          }
        }
      ]
    };
  }
};
