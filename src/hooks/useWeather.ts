import { useEffect, useState } from 'react';
import { fetchWeather, type WeatherData } from '../services/weatherService';

type WeatherState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: WeatherData }
  | { status: 'error' };

export function useWeather(): WeatherState {
  const [state, setState] = useState<WeatherState>({ status: 'idle' });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ status: 'error' });
      return;
    }

    setState({ status: 'loading' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        fetchWeather(latitude, longitude)
          .then((data) => {
            setState({ status: 'success', data });
          })
          .catch(() => {
            setState({ status: 'error' });
          });
      },
      () => {
        setState({ status: 'error' });
      },
    );
  }, []);

  return state;
}
