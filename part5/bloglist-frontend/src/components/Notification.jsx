const Notification = ({ message }) => {
  if (message === null) return null
  else return <div className={message[0]}>{message[1]}</div>
}

export default Notification