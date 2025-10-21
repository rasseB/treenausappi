const baseUrl = 'http://localhost:3001/api/workouts'

const getAll = async () => {
  const response = await fetch(baseUrl)
  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.message)
  }
  
  return data.data
}

const getDay = async (date) => {
  const response = await fetch(`${baseUrl}/${date}`)
  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.message)
  }
  
  return data.data
}

const addExercise = async (date, exercise) => {
  const response = await fetch(`${baseUrl}/${date}/exercises`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(exercise),
  })
  
  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.message)
  }
  
  return data.data
}

const toggleExercise = async (date, exerciseId, completed) => {
  const response = await fetch(`${baseUrl}/${date}/exercises/${exerciseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ completed }),
  })
  
  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.message)
  }
  
  return data.data
}

const removeExercise = async (date, exerciseId) => {
  const response = await fetch(`${baseUrl}/${date}/exercises/${exerciseId}`, {
    method: 'DELETE',
  })
  
  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.message)
  }
  
  return data.data
}

const updateWorkoutType = async (date, workoutType) => {
  const response = await fetch(`${baseUrl}/${date}/type`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ workoutType }),
  })
  
  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.message)
  }
  
  return data.data
}

export default { getAll, getDay, addExercise, toggleExercise, removeExercise, updateWorkoutType }