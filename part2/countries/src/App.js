import React, { useState, useEffect } from "react"

import Filter from "./components/Filter"
import Countries from "./components/Countries"
import getCountries from "./services/countries"

const App = () => {
  const [filter, setFilter] = useState("")
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    getCountries().then(countries => setCountries(countries))
  }, [])

  return (
    <div>
      <Filter filter={filter} setFilter={setFilter} setSelectedCountry={setSelectedCountry} />

      <Countries countries={countries} filter={filter} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
    </div>
  )
}

export default App
