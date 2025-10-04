import { useState, useEffect } from 'react'
import WorkoutForm from './components/WorkoutForm'
import WorkoutList from './components/WorkoutList'
import Notification from './components/Notification'
import workoutService from './services/workouts'
import './App.css'

function App() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Hae treenit
  const fetchWorkouts = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const workoutsData = await workoutService.getAll()
      setWorkouts(workoutsData)
    } catch (error) {
      setErrorMessage('Virhe treenien haussa: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Lisää uusi treeni
  const addWorkout = async (workoutObject) => {
    setErrorMessage('')
    setSuccessMessage('')
    
    try {
      const newWorkout = await workoutService.create(workoutObject)
      setWorkouts(workouts.concat(newWorkout))
      setSuccessMessage(`Treeni "${newWorkout.name}" lisätty onnistuneesti`)
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error) {
      setErrorMessage('Virhe treenin lisäämisessä: ' + error.message)
    }
  }

  // Poista treeni
  const deleteWorkout = async (id) => {
    const workoutToDelete = workouts.find(w => w.id === id)
    
    if (window.confirm(`Haluatko varmasti poistaa treenin "${workoutToDelete.name}"?`)) {
      setErrorMessage('')
      
      try {
        await workoutService.remove(id)
        setWorkouts(workouts.filter(w => w.id !== id))
        setSuccessMessage(`Treeni "${workoutToDelete.name}" poistettu`)
        setTimeout(() => setSuccessMessage(''), 5000)
      } catch (error) {
        setErrorMessage('Virhe treenin poistamisessa: ' + error.message)
      }
    }
  }

  useEffect(() => {
    fetchWorkouts()
  }, [])

  return (
    <div className="workout-container">
      <h1>Treenipäiväkirja</h1>
      
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />

      <WorkoutForm onSubmit={addWorkout} />

      <WorkoutList 
        workouts={workouts}
        onDelete={deleteWorkout}
        onRefresh={fetchWorkouts}
        loading={loading}
      />
    </div>
  )
}

export default App
