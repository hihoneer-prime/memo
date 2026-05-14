export interface WeatherData {
  temp: number;
  emoji: string;
  label: string;
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
}

function mapWeatherCode(code: number): { emoji: string; label: string } {
  if (code === 0) return { emoji: '☀️', label: '맑음' };
  if (code === 1) return { emoji: '🌤️', label: '대체로 맑음' };
  if (code === 2) return { emoji: '⛅', label: '구름 조금' };
  if (code === 3) return { emoji: '☁️', label: '흐림' };
  if (code === 45 || code === 48) return { emoji: '🌫️', label: '안개' };
  if ([51, 53, 55, 56, 57].includes(code)) return { emoji: '🌦️', label: '이슬비' };
  if ([61, 63, 65, 66, 67].includes(code)) return { emoji: '🌧️', label: '비' };
  if ([71, 73, 75, 77].includes(code)) return { emoji: '🌨️', label: '눈' };
  if ([80, 81, 82].includes(code)) return { emoji: '🌦️', label: '소나기' };
  if (code === 85 || code === 86) return { emoji: '🌨️', label: '눈소나기' };
  if ([95, 96, 99].includes(code)) return { emoji: '⛈️', label: '뇌우' };
  return { emoji: '🌡️', label: '' };
}

export async function fetchWeather(
  lat: number,
  lon: number,
): Promise<WeatherData> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,wind_speed_10m` +
    `&timezone=auto`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status}`);
  }

  const json: OpenMeteoResponse = await res.json();
  const { temperature_2m, weather_code } = json.current;
  const { emoji, label } = mapWeatherCode(weather_code);

  return {
    temp: Math.round(temperature_2m),
    emoji,
    label,
  };
}
