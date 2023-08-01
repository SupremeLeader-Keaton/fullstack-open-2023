import { useState, useEffect } from "react"
import getWeather from "../services/weather"

const Countries = ({
  countries,
  filter,
  selectedCountry,
  setSelectedCountry,
}) => {
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  const handleSelect = (country) => {
    setSelectedCountry(country)
  }

  if (filter.length === 0) {
    return <div></div>
  } else if (filteredCountries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else if (filteredCountries.length === 1 || selectedCountry) {
    const country = selectedCountry || filteredCountries[0]
    return <Country key={country} country={country} />
  } else {
    return (
      <>
        {filteredCountries.map((country) => (
          <div key={country.name.common}>
            {country.name.common}
            <button onClick={() => handleSelect(country)}>Show</button>
          </div>
        ))}
      </>
    )
  }
}

const Country = ({ country }) => {
  return (
    <>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>

      <h3>languages:</h3>
      {country.languages && Object.keys(country.languages).length > 0 ? ( //To resolve 'Antarctica'
        <ul>
          {Object.keys(country.languages).map((language) => (
            <li key={country.languages[language]}>
              {country.languages[language]}
            </li>
          ))}
        </ul>
      ) : (
        <p>No official language</p>
      )}

      <img src={country.flags.svg} alt={country.flags.alt} width="150" />

      <h2>Weather in {country.capital}</h2>
      <Weather lat={country.latlng[0]} lng={country.latlng[1]} />
    </>
  )
}

const Weather = ({ lat, lng }) => {
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    getWeather(lat, lng).then((data) => setWeatherData(data))
  }, [lat, lng])

  if (weatherData === null) {
    return null
  } else {
    return (
      <>
        <div>temperature {weatherData.temperature} Celcius</div>
        <img
          src={`https://openweathermap.org/img/wn/${weatherData.weathercode}${weatherData.is_day}@2x.png`}
          alt=""
        />
        <div>wind {weatherData.windspeed} m/s</div>
      </>
    )
  }
}

export default Countries
