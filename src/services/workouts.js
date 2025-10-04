const baseUrl = 'http://localhost:3001/api/workouts'

const getAll = async () => {
  const response = await fetch(baseUrl)
  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.message)
  }
  
  return data.data
}

const create = async (newWorkout) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newWorkout),
  })
  
  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.message)
  }
  
  return data.data
}

const remove = async (id) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE',
  })
  
  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.message)
  }
  
  return data.data
}

const update = async (id, updatedWorkout) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedWorkout),
  })
  
  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.message)
  }
  
  return data.data
}

export default { getAll, create, remove, update }