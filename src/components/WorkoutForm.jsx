import { useState } from 'react'

const WorkoutForm = ({ onSubmit }) => {
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    date: new Date().toISOString().split('T')[0],
    workoutType: ''
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setNewWorkout(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(newWorkout)
    setNewWorkout({
      name: '',
      sets: '',
      reps: '',
      weight: '',
      date: new Date().toISOString().split('T')[0],
      workoutType: ''
    })
  }

  return (
    <div className="add-workout-section">
      <h2>Suunnitele uusi treenipäivä</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label>Liike:</label>
            <input
              type="text"
              name="name"
              value={newWorkout.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Päivämäärä:</label>
            <input
              type="date"
              name="date"
              value={newWorkout.date}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-field">
            <label>Treenipäivän tyyppi:</label>
            <select
              name="workoutType"
              value={newWorkout.workoutType}
              onChange={handleInputChange}
              required
            >
              <option value="">Valitse tyyppi</option>
              <option value="push">Push</option>
              <option value="pull">Pull</option>
              <option value="legs">Legs</option>
              <option value="arms">Arms</option>
            </select>
          </div>
          <div className="form-field">
            <label>Sarjat:</label>
            <input
              type="number"
              name="sets"
              value={newWorkout.sets}
              onChange={handleInputChange}
              required
              min="1"
            />
          </div>
          <div className="form-field">
            <label>Toistot:</label>
            <input
              type="number"
              name="reps"
              value={newWorkout.reps}
              onChange={handleInputChange}
              required
              min="1"
            />
          </div>
          <div className="form-field">
            <label>Paino (kg):</label>
            <input
              type="number"
              name="weight"
              value={newWorkout.weight}
              onChange={handleInputChange}
              required
              min="0"
              step="0.5"
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Lisää treeni
        </button>
      </form>
    </div>
  )
}

export default WorkoutForm