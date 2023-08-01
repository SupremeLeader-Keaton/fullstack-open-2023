import { useRef, useEffect } from 'react'

const Filter = ({ filter, setFilter }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()
  }, [filter])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <form>
      <div>filter shown with <input ref={inputRef} value={filter} onChange={handleFilterChange} /></div>
    </form>
  )
}

export default Filter