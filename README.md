# React Flow MCP Server

A Model Context Protocol (MCP) server for the [React Flow](https://reactflow.dev) library. This server provides AI assistants with comprehensive access to React Flow components, hooks, types, utilities, examples, and documentation.

## Features

- **Component Information**: Get detailed documentation for all React Flow components (`<ReactFlow />`, `<Handle />`, `<Background />`, etc.)
- **Hooks Reference**: Access information about all React Flow hooks (`useReactFlow`, `useNodes`, `useEdges`, etc.)
- **Type Definitions**: Explore React Flow types (`Node`, `Edge`, `Viewport`, etc.)
- **Utility Functions**: Learn about helper functions (`addEdge`, `applyNodeChanges`, `getBezierPath`, etc.)
- **Code Examples**: Get complete, working code examples for common use cases
- **Documentation**: Access guides on topics like getting started, performance, state management, and TypeScript

## Installation

```bash
npm install @yeshsurya/react-flow-mcp-server
```

Or run directly with npx:

```bash
npx @yeshsurya/react-flow-mcp-server
```

## Usage

### Claude Desktop / Claude Code

Add the MCP server using the Claude CLI:

```bash
claude mcp add react-flow -- npx -y @yeshsurya/react-flow-mcp-server
```

Or manually add to your MCP client configuration file:

```json
{
  "mcpServers": {
    "react-flow": {
      "command": "npx",
      "args": ["-y", "@yeshsurya/react-flow-mcp-server"]
    }
  }
}
```

### Microsoft Copilot Studio

MCP is now [generally available in Microsoft Copilot Studio](https://www.microsoft.com/en-us/microsoft-copilot/blog/copilot-studio/model-context-protocol-mcp-is-now-generally-available-in-microsoft-copilot-studio/). To add this server:

1. Navigate to your agent's **Tools** page in Copilot Studio
2. Select **Add a tool** → **New tool** → **Model Context Protocol**
3. Configure the server:
   - **Server name**: `react-flow-mcp-server`
   - **Server description**: `Provides React Flow components, hooks, types, utilities, examples, and documentation`
   - **Server URL**: Deploy the server to a hosting service (Azure, AWS, etc.) with HTTP transport
4. Choose authentication type (None, API key, or OAuth 2.0)
5. Create connection and add to your agent

> **Note**: Copilot Studio requires **Streamable HTTP transport**. For local development, consider using a tunneling service or deploying to a cloud endpoint. See [Microsoft's MCP documentation](https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-add-existing-server-to-agent) for detailed setup instructions.

### VS Code / GitHub Copilot

MCP is supported in VS Code and GitHub Copilot. Add to your VS Code settings:

```json
{
  "mcp.servers": {
    "react-flow": {
      "command": "npx",
      "args": ["-y", "@yeshsurya/react-flow-mcp-server"]
    }
  }
}
```

### Command Line Options

```bash
npx @yeshsurya/react-flow-mcp-server --help     # Show help
npx @yeshsurya/react-flow-mcp-server --version  # Show version
```

### Environment Variables

- `LOG_LEVEL`: Set logging level (`debug`, `info`, `warn`, `error`). Default: `info`

## Available Tools

### Component Tools

| Tool | Description |
|------|-------------|
| `get_react_flow_component` | Get detailed information about a specific component |
| `list_react_flow_components` | List all available components (filterable by category) |

### Hook Tools

| Tool | Description |
|------|-------------|
| `get_react_flow_hook` | Get detailed information about a specific hook |
| `list_react_flow_hooks` | List all available hooks (filterable by category) |

### Type Tools

| Tool | Description |
|------|-------------|
| `get_react_flow_type` | Get detailed information about a specific type |
| `list_react_flow_types` | List all available types (filterable by category) |

### Utility Tools

| Tool | Description |
|------|-------------|
| `get_react_flow_utility` | Get detailed information about a utility function |
| `list_react_flow_utilities` | List all available utility functions |

### Example Tools

| Tool | Description |
|------|-------------|
| `get_react_flow_example` | Get complete code for a specific example |
| `search_react_flow_examples` | Search examples by keyword |

### Documentation Tools

| Tool | Description |
|------|-------------|
| `get_react_flow_docs` | Get documentation for a specific topic |

## Example Interactions

### Getting Component Information

```
Tool: get_react_flow_component
Arguments: { "componentName": "Handle" }
```

### Listing Hooks by Category

```
Tool: list_react_flow_hooks
Arguments: { "category": "state" }
```

### Searching for Examples

```
Tool: search_react_flow_examples
Arguments: { "query": "drag drop" }
```

### Getting Documentation

```
Tool: get_react_flow_docs
Arguments: { "topic": "getting-started" }
```

## Available Examples

- `basic-flow` - Simple React Flow setup
- `custom-node` - Creating custom node components
- `custom-edge` - Creating custom edge components
- `drag-and-drop` - Adding nodes via drag and drop
- `sub-flows` - Nested nodes with parent-child relationships
- `validation` - Connection validation
- `save-restore` - Persisting and loading flow state
- `resizable-node` - Nodes with resize handles
- `toolbar-node` - Nodes with selection toolbars
- `layout-elk` - Automatic layout with ELK.js

## Documentation Topics

- `getting-started` - Installation and basic setup
- `concepts` - Core concepts (nodes, edges, handles, viewport)
- `custom-nodes` - Creating custom node components
- `custom-edges` - Creating custom edge components
- `performance` - Performance optimization tips
- `state-management` - State management patterns
- `typescript` - TypeScript usage guide
- `accessibility` - Accessibility best practices

## Development

### Building from Source

```bash
git clone https://github.com/your-repo/react-flow-mcp-server.git
cd react-flow-mcp-server
npm install
npm run build
```

### Running in Development

```bash
npm run dev
```

### Project Structure

```
react-flow-mcp-server/
├── src/
│   ├── index.ts              # Entry point
│   ├── handler.ts            # MCP request handlers
│   ├── resources.ts          # Static resources
│   ├── prompts.ts            # Prompt definitions
│   ├── resource-templates.ts # Dynamic resource templates
│   ├── tools/
│   │   ├── index.ts          # Tool registry
│   │   ├── components/       # Component tools
│   │   ├── hooks/            # Hook tools
│   │   ├── types/            # Type tools
│   │   ├── utilities/        # Utility tools
│   │   ├── examples/         # Example tools
│   │   └── docs/             # Documentation tools
│   └── utils/
│       ├── logger.ts         # Winston logging
│       ├── cache.ts          # In-memory cache
│       ├── validation.ts     # Zod validation
│       └── circuit-breaker.ts # Resilience pattern
├── build/                    # Compiled JavaScript
├── package.json
└── tsconfig.json
```

## License

MIT

## Related Links

- [React Flow Documentation](https://reactflow.dev)
- [React Flow GitHub](https://github.com/xyflow/xyflow)
- [Model Context Protocol](https://modelcontextprotocol.io)
