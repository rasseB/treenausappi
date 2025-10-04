const Notification = ({ message, type = 'error' }) => {
  if (!message) {
    return null
  }

  const className = type === 'error' ? 'error-message' : 'success-message'

  return (
    <div className={className}>
      {message}
    </div>
  )
}

export default Notification