# @pipeworx/mcp-marine

MCP server for marine wave forecasts and conditions via the [Open-Meteo Marine API](https://marine-api.open-meteo.com/). Free, no authentication required.

## Tools

| Tool | Description |
|------|-------------|
| `get_wave_forecast` | Get a multi-day daily wave forecast for a coastal location (height, period, direction) |
| `get_current_waves` | Get current wave conditions for a coastal location |

## Quickstart via Pipeworx Gateway

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "marine__get_wave_forecast",
      "arguments": { "latitude": 36.95, "longitude": -121.97, "days": 3 }
    },
    "id": 1
  }'
```

## License

MIT
