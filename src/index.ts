#!/usr/bin/env node
/**
 * React Flow MCP Server
 *
 * A Model Context Protocol server for React Flow library.
 * Provides AI assistants with access to React Flow components, hooks, types,
 * utilities, examples, and documentation.
 *
 * Usage:
 *   npx react-flow-mcp-server
 *   npx react-flow-mcp-server --help
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { setupHandlers } from './handler.js';
import { logError, logInfo, logWarning } from './utils/logger.js';

/**
 * Parse command line arguments
 */
async function parseArgs() {
  const args = process.argv.slice(2);

  // Help flag
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
React Flow MCP Server

Usage:
  npx react-flow-mcp-server [options]

Options:
  --help, -h     Show this help message
  --version, -v  Show version information

Environment Variables:
  LOG_LEVEL      Log level (debug, info, warn, error) - default: info

Tools Available:
  - get_react_flow_component    Get info about a React Flow component
  - list_react_flow_components  List all React Flow components
  - get_react_flow_hook         Get info about a React Flow hook
  - list_react_flow_hooks       List all React Flow hooks
  - get_react_flow_type         Get info about a React Flow type
  - list_react_flow_types       List all React Flow types
  - get_react_flow_utility      Get info about a utility function
  - list_react_flow_utilities   List all utility functions
  - get_react_flow_example      Get a complete code example
  - search_react_flow_examples  Search examples by keyword
  - get_react_flow_docs         Get documentation for a topic

For more information, visit: https://reactflow.dev
`);
    process.exit(0);
  }

  // Version flag
  if (args.includes('--version') || args.includes('-v')) {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const packagePath = path.join(__dirname, '..', 'package.json');

      const packageContent = fs.readFileSync(packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      console.log(`react-flow-mcp-server v${packageJson.version}`);
    } catch (error) {
      console.log('react-flow-mcp-server v1.0.0');
    }
    process.exit(0);
  }
}

/**
 * Main function to start the MCP server
 */
async function main() {
  try {
    logInfo('Starting React Flow MCP Server...');

    await parseArgs();

    // Initialize the MCP server with metadata and capabilities
    const server = new Server(
      {
        name: "react-flow-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          resources: {},
          prompts: {},
          tools: {}
        }
      }
    );

    // Set up request handlers
    setupHandlers(server);

    // Start server using stdio transport
    const transport = new StdioServerTransport();

    logInfo('Transport initialized: stdio');

    await server.connect(transport);

    logInfo('Server started successfully');

  } catch (error) {
    logError('Failed to start server', error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  logError('Unhandled startup error', error);
  process.exit(1);
});
