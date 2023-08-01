import axios from "axios"

const getWeather = (lat, lng) => {
  const request = axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&windspeed_unit=ms`
  )
  const valueMapping = {
    0: '01', //Clear sky
    1: '02', //Mainly clear
    2: '03', //Partly cloudy
    3: '04', //Overcast
    45: '50', //Fog and depositing rime fog
    48: '50', //Fog and depositing rime fog
    51: '09', //Drizzle: Light intensity
    53: '09', //Drizzle: Moderate intensity
    55: '09', //Drizzle: Dense intensity
    56: '09', //Freezing Drizzle: Light intensity
    57: '09', //Freezing Drizzle: Dense intensity
    61: '10', //Rain: Slight intensity
    63: '10', //Rain: Moderate intensity
    65: '10', //Rain: Heavy intensity
    66: '13', //Freezing Rain: Light intensity
    67: '13', //Freezing Rain: Heavy intensity
    71: '13', //Snow fall: Slight intensity
    73: '13', //Snow fall: Moderate intensity
    75: '13', //Snow fall: Heavy intensity
    77: '13', //Snow grains
    80: '09', //Rain showers: Slight intensity
    81: '09', //Rain showers: Moderate intensity
    82: '09', //Rain showers: Violent intensity
    85: '13', //Snow showers: Slight intensity
    86: '13', //Snow showers: Heavy intensity
    95: '11', //Thunderstorm: Slight intensity
    96: '11', //Thunderstorm with hail: Slight intensity
    99: '11', //Thunderstorm with hail: Heavy intensity
  };
  
  return request.then(({ data }) => {
    const { current_weather } = data;
  
    const updatedCurrentWeather = {
      ...current_weather,
      weathercode: valueMapping[current_weather.weathercode],
      is_day: (current_weather.is_day === 1? "d" : "n"),
    };
  
    return updatedCurrentWeather;
  });
}

export default getWeather
