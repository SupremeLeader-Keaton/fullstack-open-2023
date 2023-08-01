import phonebook from "../services/phonebook"

const List = ({ persons, setPersons, filter, setMessage, setMessageStatus }) => {
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <>
      {filteredPersons.map((person) => (
        <Person
          key={person.id}
          person={person}
          persons={persons}
          setPersons={setPersons}
          setMessage={setMessage}
          setMessageStatus={setMessageStatus}
        />
      ))}
    </>
  )
}

const Person = ({ person, persons, setPersons, setMessage, setMessageStatus }) => {
  const handleRemove = () => {
    if (window.confirm(`Delete ${person.name}?`)) {
      phonebook.remove(person.id)
      setPersons(persons.filter((persons) => persons.id !== person.id))
      setMessage(`Deleted ${person.name}`)
      setMessageStatus("success")
      setTimeout(() => {
        setMessage(null)
        setMessageStatus(null)
      }, 5000)
    }
  }
  return (
    <div>
      {person.name} {person.number} <button onClick={handleRemove}>delete</button>
    </div>
  )
}

export default List
