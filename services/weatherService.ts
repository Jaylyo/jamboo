import { WeatherData } from '../types';

export const getWeatherForecast = (): WeatherData[] => {
  const data: WeatherData[] = [];
  const now = new Date();
  
  // Deterministic "random" choices based on date to simulate a consistent forecast for a specific day
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Stormy'];

  for(let i=0; i<7; i++) {
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + i);
    
    // Generate a pseudo-random seed based on the date string (e.g. "2023-10-27")
    const dateStr = nextDate.toDateString();
    let seed = 0;
    for (let j = 0; j < dateStr.length; j++) {
      seed += dateStr.charCodeAt(j);
    }
    
    // Use seed to pick condition and temp
    const condIndex = seed % conditions.length;
    // Base temp around 27-32 degrees C
    const temp = 27 + (seed % 6);

    let risk: 'Low' | 'Moderate' | 'High' = 'Low';
    if (conditions[condIndex] === 'Stormy') risk = 'High';
    if (conditions[condIndex] === 'Rainy') risk = 'Moderate';

    data.push({
      day: i === 0 ? 'Today' : nextDate.toLocaleDateString('en-US', { weekday: 'short' }),
      date: nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      temp: temp,
      condition: conditions[condIndex],
      riskLevel: risk
    });
  }
  return data;
};