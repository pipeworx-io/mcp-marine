/**
 * Marine MCP — wraps marine-api.open-meteo.com (free, no auth)
 *
 * Tools:
 * - get_wave_forecast: Multi-day daily wave forecast for a coastal location
 * - get_current_waves: Current wave conditions for a coastal location
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://marine-api.open-meteo.com/v1';

type RawForecastResponse = {
  latitude: number;
  longitude: number;
  daily: {
    time: string[];
    wave_height_max: number[];
    wave_period_max: number[];
    wave_direction_dominant: number[];
  };
};

type RawCurrentResponse = {
  latitude: number;
  longitude: number;
  current: {
    wave_height: number;
    wave_period: number;
    wave_direction: number;
  };
};

const tools: McpToolExport['tools'] = [
  {
    name: 'get_wave_forecast',
    description:
      'Get a multi-day daily wave forecast for a coastal location. Returns maximum wave height, wave period, and dominant wave direction per day.',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: { type: 'number', description: 'Latitude of the location.' },
        longitude: { type: 'number', description: 'Longitude of the location.' },
        days: {
          type: 'number',
          description: 'Number of forecast days (1-7, default 7).',
        },
      },
      required: ['latitude', 'longitude'],
    },
  },
  {
    name: 'get_current_waves',
    description:
      'Get current wave conditions for a coastal location. Returns wave height, period, and direction right now.',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: { type: 'number', description: 'Latitude of the location.' },
        longitude: { type: 'number', description: 'Longitude of the location.' },
      },
      required: ['latitude', 'longitude'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const lat = args.latitude as number;
  const lon = args.longitude as number;
  switch (name) {
    case 'get_wave_forecast':
      return getWaveForecast(lat, lon, (args.days as number | undefined) ?? 7);
    case 'get_current_waves':
      return getCurrentWaves(lat, lon);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function getWaveForecast(lat: number, lon: number, days: number) {
  const safeDays = Math.min(7, Math.max(1, days));
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    daily: 'wave_height_max,wave_period_max,wave_direction_dominant',
    forecast_days: String(safeDays),
  });
  const res = await fetch(`${BASE_URL}/marine?${params}`);
  if (!res.ok) throw new Error(`Marine API error: ${res.status}`);
  const data = (await res.json()) as RawForecastResponse;
  const d = data.daily;
  return {
    latitude: data.latitude,
    longitude: data.longitude,
    days: d.time.map((date, i) => ({
      date,
      wave_height_max_m: d.wave_height_max[i],
      wave_period_max_s: d.wave_period_max[i],
      wave_direction_dominant_deg: d.wave_direction_dominant[i],
    })),
  };
}

async function getCurrentWaves(lat: number, lon: number) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'wave_height,wave_period,wave_direction',
  });
  const res = await fetch(`${BASE_URL}/marine?${params}`);
  if (!res.ok) throw new Error(`Marine API error: ${res.status}`);
  const data = (await res.json()) as RawCurrentResponse;
  const c = data.current;
  return {
    latitude: data.latitude,
    longitude: data.longitude,
    wave_height_m: c.wave_height,
    wave_period_s: c.wave_period,
    wave_direction_deg: c.wave_direction,
  };
}

export default { tools, callTool } satisfies McpToolExport;
