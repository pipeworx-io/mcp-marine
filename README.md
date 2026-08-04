# mcp-marine

Marine MCP — wraps marine-api.open-meteo.com (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_wave_forecast` | Get multi-day wave forecasts for coastal locations (e.g., "Hawaii", "California Coast"). Returns max wave height, period, and dominant direction per day. Use when planning water activities or monitoring upcoming swell. |
| `get_current_waves` | Check real-time wave conditions at a coastal location. Returns current wave height, period, and direction. Use for immediate surfing, boating, or maritime planning decisions. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "marine": {
      "url": "https://gateway.pipeworx.io/marine/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Marine data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
