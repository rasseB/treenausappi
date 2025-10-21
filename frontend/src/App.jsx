import { useState, useEffect } from 'react'
import WeekCalendar from './components/WeekCalendar'
import DayWorkout from './components/DayWorkout'
import ExerciseForm from './components/ExerciseForm'
import workoutService from './services/workouts'
import './App.css'

// Notifikaatio-komponentti
const Notification = ({ message, type = 'error' }) => {
  if (!message) return null
  const className = type === 'error' ? 'error-message' : 'success-message'
  return <div className={className}>{message}</div>
}

function App() {
  const [workouts, setWorkouts] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)
  const [showExerciseForm, setShowExerciseForm] = useState(false)
  const [currentWeekStart, setCurrentWeekStart] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Laske viikon alkupäivä (maanantai)
  const getMonday = (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  // Hae treenit
  const fetchWorkouts = async () => {
    setErrorMessage('')
    try {
      const workoutsData = await workoutService.getAll()
      setWorkouts(workoutsData)
    } catch (error) {
      setErrorMessage('Virhe treenien haussa: ' + error.message)
    }
  }

  // Lisää liike
  const addExercise = async (exerciseData) => {
    setErrorMessage('')
    setSuccessMessage('')
    
    try {
      await workoutService.addExercise(selectedDate, exerciseData)
      await fetchWorkouts()
      setSuccessMessage(`Liike "${exerciseData.name}" lisätty`)
      setTimeout(() => setSuccessMessage(''), 3000)
      setShowExerciseForm(false)
    } catch (error) {
      setErrorMessage('Virhe liikkeen lisäämisessä: ' + error.message)
    }
  }

  // Merkkaa liike tehdyksi/ei-tehdyksi
  const toggleExercise = async (date, exerciseId, completed) => {
    try {
      await workoutService.toggleExercise(date, exerciseId, completed)
      await fetchWorkouts()
    } catch (error) {
      setErrorMessage('Virhe päivityksessä: ' + error.message)
    }
  }

  // Poista liike
  const deleteExercise = async (date, exerciseId) => {
    if (window.confirm('Haluatko varmasti poistaa tämän liikkeen?')) {
      try {
        await workoutService.removeExercise(date, exerciseId)
        await fetchWorkouts()
        setSuccessMessage('Liike poistettu')
        setTimeout(() => setSuccessMessage(''), 3000)
      } catch (error) {
        setErrorMessage('Virhe poistamisessa: ' + error.message)
      }
    }
  }

  // Vaihda päivän treenityyppi
  const changeWorkoutType = async (date, workoutType) => {
    setErrorMessage('')
    setSuccessMessage('')
    
    try {
      await workoutService.updateWorkoutType(date, workoutType)
      await fetchWorkouts()
      setSuccessMessage(`Treenityyppi vaihdettu: ${workoutType}`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setErrorMessage('Virhe treenityypin vaihdossa: ' + error.message)
    }
  }

  // Päivän valinta
  const handleDayClick = (date) => {
    setSelectedDate(date)
  }

  // Takaisin kalenteriin
  const handleBack = () => {
    setSelectedDate(null)
    setShowExerciseForm(false)
  }

  // Avaa liikkeen lisäyslomake
  const handleAddExercise = (date) => {
    setSelectedDate(date)
    setShowExerciseForm(true)
  }

  // Vaihda viikkoa
  const handleWeekChange = (newWeekStart) => {
    setCurrentWeekStart(newWeekStart)
  }

  useEffect(() => {
    fetchWorkouts()
    setCurrentWeekStart(getMonday(new Date()))
  }, [])

  return (
    <div className="workout-container">
      <h1>Treenipäiväkirja</h1>
      
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />

      {!selectedDate ? (
        <WeekCalendar 
          workouts={workouts}
          onDayClick={handleDayClick}
          currentWeekStart={currentWeekStart}
          onWeekChange={handleWeekChange}
        />
      ) : (
        <DayWorkout 
          date={selectedDate}
          workout={workouts[selectedDate]}
          onBack={handleBack}
          onToggleExercise={toggleExercise}
          onAddExercise={handleAddExercise}
          onDeleteExercise={deleteExercise}
          onWorkoutTypeChange={changeWorkoutType}
        />
      )}

      {showExerciseForm && (
        <ExerciseForm 
          onSubmit={addExercise}
          onCancel={() => setShowExerciseForm(false)}
        />
      )}
    </div>
  )
}

export default App
