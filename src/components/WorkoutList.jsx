import { useState } from 'react'
import WorkoutItem from './WorkoutItem'

const WorkoutList = ({ workouts, onDelete, onRefresh, loading }) => {
  const [filterExercise, setFilterExercise] = useState('')
  const [sortBy, setSortBy] = useState('date')

  // Laske tilastoja .map() metodilla
  const stats = {
    totalWorkouts: workouts.length,
    uniqueExercises: [...new Set(workouts.map(w => w.name))].length,
    totalSets: workouts.map(w => parseInt(w.sets) || 0).reduce((sum, sets) => sum + sets, 0),
    totalReps: workouts.map(w => parseInt(w.reps) || 0).reduce((sum, reps) => sum + reps, 0),
    totalWeight: workouts.map(w => parseInt(w.weight) || 0).reduce((sum, weight) => sum + weight, 0)
  }

  // Suodata ja järjestä treenit .map() ja .filter() metodilla
  const filteredAndSortedWorkouts = workouts
    .filter(workout => filterExercise === '' || workout.name.toLowerCase().includes(filterExercise.toLowerCase()))
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

  // Hae uniikit liikkeet suodatinta varten
  const uniqueExercises = [...new Set(workouts.map(w => w.name))].sort()

  return (
    <div>
      <div className="workouts-header">
        <h2>Treenit ({workouts.length})</h2>
        <button 
          onClick={onRefresh} 
          disabled={loading}
          className="btn btn-success"
        >
          {loading ? 'Ladataan...' : 'Päivitä'}
        </button>
      </div>

      {workouts.length > 0 && (
        <div className="workout-stats">
          <h3>Tilastot</h3>
          <div className="stats-grid">
            {[
              { label: 'Treenejä yhteensä', value: stats.totalWorkouts },
              { label: 'Eri liikkeitä', value: stats.uniqueExercises },
              { label: 'Sarjoja yhteensä', value: stats.totalSets },
              { label: 'Toistoja yhteensä', value: stats.totalReps },
              { label: 'Painoa yhteensä', value: `${stats.totalWeight} kg` }
            ].map(stat => (
              <div key={stat.label} className="stat-item">
                <span className="stat-label">{stat.label}:</span>
                <span className="stat-value">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {workouts.length > 0 && (
        <div className="workout-filters">
          <div className="filter-section">
            <label>Suodata liikkeittain:</label>
            <select 
              value={filterExercise} 
              onChange={(e) => setFilterExercise(e.target.value)}
              className="filter-select"
            >
              <option value="">Kaikki liikkeet</option>
              {uniqueExercises.map(exercise => (
                <option key={exercise} value={exercise}>{exercise}</option>
              ))}
            </select>
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
          .map(([date, dayWorkouts]) => (
            <div key={date} className="workout-day">
              <h3 className="date-header">{new Date(date).toLocaleDateString('fi-FI')}</h3>
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
          ))}
        </div>
      )}
    </div>
  )
}

export default WorkoutList