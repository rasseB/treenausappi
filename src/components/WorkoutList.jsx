import { useState } from 'react'
import WorkoutItem from './WorkoutItem'

const WorkoutList = ({ workouts, onDelete, onRefresh, loading }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date')

  // Suodata ja järjestä treenit hakusanan perusteella
  const filteredAndSortedWorkouts = workouts
    .filter(workout => searchTerm === '' || workout.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'weight':
          return (parseInt(b.weight) || 0) - (parseInt(a.weight) || 0)
        case 'date':
        default:
          return new Date(b.date) - new Date(a.date)
      }
    })

  return (
    <div>
      {workouts.length > 0 && (
        <div className="workout-filters">
          <div className="filter-section">
            <label>Hae liikkeittain:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Kirjoita liikkeen nimi..."
              className="search-input"
            />
          </div>
          <div className="filter-section">
            <label>Järjestä:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="date">Päivämäärän mukaan</option>
              <option value="name">Liikkeen mukaan</option>
              <option value="weight">Painon mukaan</option>
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <p>Ladataan treeneja...</p>
      ) : filteredAndSortedWorkouts.length === 0 ? (
        <p>{workouts.length === 0 ? 'Ei treeneja tallennettuna.' : 'Ei löytynyt treeneja valituilla suodattimilla.'}</p>
      ) : (
        <div className="workouts-by-date">
          {Object.entries(
            filteredAndSortedWorkouts.reduce((acc, workout) => {
              const date = workout.date
              if (!acc[date]) acc[date] = []
              acc[date].push(workout)
              return acc
            }, {})
          )
          .sort(([a], [b]) => new Date(b) - new Date(a))
          .map(([date, dayWorkouts]) => {
            // Hae ensimmäisen treenin workoutType (oletetaan että samana päivänä on sama tyyppi)
            const workoutType = dayWorkouts[0]?.workoutType
            const workoutTypeText = workoutType ? ` - ${workoutType.charAt(0).toUpperCase() + workoutType.slice(1)}` : ''
            
            return (
              <div key={date} className="workout-day">
                <h3 className="date-header">
                  {new Date(date).toLocaleDateString('fi-FI')}{workoutTypeText}
                </h3>
                <div className="workouts-grid">
                  {dayWorkouts.map(workout => (
                    <WorkoutItem 
                      key={workout.id} 
                      workout={workout} 
                      onDelete={onDelete} 
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default WorkoutList