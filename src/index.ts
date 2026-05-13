import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const server = new McpServer({
  name: "npm-registry-lens-mcp",
  version: "1.0.0",
});

// Tool: npm_search
server.tool(
  "npm_search",
  "Searches the npm registry for packages matching the keyword.",
  {
    query: z.string().describe("The search query (e.g., 'mcp-server')"),
  },
  async ({ query }: { query: string }) => {
    try {
      const { stdout } = await execAsync(`npm search "${query}" --json`);
      const results = JSON.parse(stdout);
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error searching npm: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// Tool: npm_inspect
server.tool(
  "npm_inspect",
  "Returns full JSON metadata (dependencies, versions, maintainers) for a package.",
  {
    packageName: z.string().describe("The name of the npm package (e.g., 'lodash')"),
  },
  async ({ packageName }: { packageName: string }) => {
    try {
      const { stdout } = await execAsync(`npm view "${packageName}" --json`);
      // npm view returns an empty string if package not found
      if (!stdout.trim()) {
        throw new Error(`Package '${packageName}' not found.`);
      }
      return {
        content: [{ type: "text", text: stdout }],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error inspecting package: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// Tool: npm_readme
server.tool(
  "npm_readme",
  "Returns the full raw text of the package's README.md.",
  {
    packageName: z.string().describe("The name of the npm package (e.g., 'express')"),
  },
  async ({ packageName }: { packageName: string }) => {
    try {
      const { stdout } = await execAsync(`npm view "${packageName}" readme`);
      if (!stdout.trim()) {
        return {
          content: [{ type: "text", text: "No README found for this package." }],
        };
      }
      return {
        content: [{ type: "text", text: stdout }],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error fetching README: ${error.message}` }],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("npm-registry-lens-mcp server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
