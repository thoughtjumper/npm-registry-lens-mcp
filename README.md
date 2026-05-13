# npm-registry-lens-mcp

A High-Fidelity Model Context Protocol (MCP) Server for Real-Time npm Discovery and Documentation Ingestion.

## Features

- **npm_search**: Searches the npm registry for packages matching a keyword.
- **npm_inspect**: Returns full JSON metadata (dependencies, versions, maintainers) for a package.
- **npm_readme**: Returns the full raw text of a package's README.md.

## Installation

```bash
git clone https://github.com/your-repo/npm-registry-lens-mcp
cd npm-registry-lens-mcp
npm install
npm run build
```

## Usage with Claude Desktop

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "npm-registry-lens": {
      "command": "node",
      "args": ["/absolute/path/to/npm-registry-lens-mcp/build/index.js"]
    }
  }
}
```

## License

MIT
