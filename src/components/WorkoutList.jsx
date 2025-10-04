import WorkoutItem from './WorkoutItem'

const WorkoutList = ({ workouts, onDelete, onRefresh, loading }) => {
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

      {loading ? (
        <p>Ladataan treeneja...</p>
      ) : workouts.length === 0 ? (
        <p>Ei treeneja tallennettuna.</p>
      ) : (
        <div className="workouts-grid">
          {workouts.map(workout => (
            <WorkoutItem 
              key={workout.id} 
              workout={workout} 
              onDelete={onDelete} 
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default WorkoutList