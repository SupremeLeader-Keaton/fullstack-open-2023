import phonebook from "../services/phonebook"

const PersonForm = ({
  persons,
  setPersons,
  newName,
  setNewName,
  newNumber,
  setNewNumber,
  setMessage,
  setMessageStatus,
}) => {
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleSubmit = (event) => {
    event.preventDefault()
    addPerson({ name: newName, number: newNumber })
    setNewName("")
    setNewNumber("")
  }

  const addPerson = (person) => {
    if (persons.find((persons) => persons.name === person.name)) {
      if (
        window.confirm(
          `${person.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const toUpdate = persons.find((persons) => persons.name === person.name)
        phonebook
          .update(toUpdate.id, person)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id !== toUpdate.id ? person : response.data
              )
            )
            setMessage(`Updated ${person.name}`)
            setMessageStatus("success")
            setTimeout(() => {
              setMessage(null)
              setMessageStatus(null)
            }, 5000)
          })
          .catch(() => {
            setMessage(
              `Information of '${person.name}' has already been removed from server`
            )
            setMessageStatus("error")
            setTimeout(() => {
              setMessage(null)
              setMessageStatus(null)
            }, 5000)
          })
      }
    } else {
      phonebook.create(person).then((response) => {
        setPersons([...persons, response.data])
        setMessage(`Added ${person.name}`)
        setMessageStatus("success")
        setTimeout(() => {
          setMessage(null)
          setMessageStatus(null)
        }, 5000)
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm
