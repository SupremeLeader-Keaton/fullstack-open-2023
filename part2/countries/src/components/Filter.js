import { useRef, useEffect } from "react"

const Filter = ({ filter, setFilter, setSelectedCountry }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()
  }, [filter])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelectedCountry(null)
  }

  return (
    <form>
      <div>
        find countries{" "}
        <input ref={inputRef} value={filter} onChange={handleFilterChange} />
      </div>
    </form>
  )
}

export default Filter
