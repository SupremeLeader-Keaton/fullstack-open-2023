import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  const ancLen = anecdotes.length
  const [selected, setSelected] = useState(Math.floor(Math.random() * ancLen))
  const [votes, setVotes] = useState(Array(ancLen).fill(0))
  const [topVote, setTopVote] = useState(0)

  const SelectRandom = () => {
    setSelected(Math.floor(Math.random() * ancLen))
  }

  const FindTop = ({votesCopy}) => {
    let topVote = 0
    for (let i = 1; i < ancLen; i++) {
      if (votesCopy[topVote] < votesCopy[i]) {
        topVote = i
      }
    }
    return topVote
  }

  const SetVotes = () => {
    const votesCopy = [...votes]
    votesCopy[selected] += 1
    setVotes(votesCopy)
    setTopVote(FindTop({votesCopy}))
  }

  return (
    <div>
      <h1><b>Anecdote of the day</b></h1>
      {anecdotes[selected]}
      <div>has {votes[selected]} votes</div>
      <button onClick={SetVotes}>vote</button>
      <button onClick={SelectRandom}>next anecdote</button>

      <h1><b>Anecdote with most votes</b></h1>
      <div>{anecdotes[topVote]}</div>
      <div>has {votes[topVote]} votes</div>
    </div>
  )
}

export default App