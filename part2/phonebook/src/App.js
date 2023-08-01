import React, { useState, useEffect } from "react"
import axios from "axios"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import List from "./components/List"
import Notification from "./components/Notification"
import phonebook from "./services/phonebook"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("a new person")
  const [newNumber, setNewNumber] = useState("a new number")
  const [filter, setFilter] = useState("")
  const [message, setMessage] = useState(null)
  const [messageStatus, setMessageStatus] = useState(null)

  useEffect(() => {
    phonebook.getAll().then((response) => {
      setPersons(response.data)
    })
  }, [])

  return (
    <div>
      <h1>Phonebook</h1>

      <Notification message={message} messageStatus={messageStatus} />

      <Filter filter={filter} setFilter={setFilter} />

      <h2>add a new</h2>

      <PersonForm
        persons={persons}
        setPersons={(persons) => setPersons(persons)}
        newName={newName}
        setNewName={(newName) => setNewName(newName)}
        newNumber={newNumber}
        setNewNumber={(newNumber) => setNewNumber(newNumber)}
        setMessage={(message) => setMessage(message)}
        setMessageStatus={(messageStatus) => setMessageStatus(messageStatus)}
      />

      <h2>Numbers</h2>

      <List persons={persons} filter={filter} setPersons={setPersons} setMessage={setMessage} setMessageStatus={setMessageStatus} />
    </div>
  )
}

export default App
