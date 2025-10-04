const WorkoutItem = ({ workout, onDelete }) => {
  return (
    <div className="workout-card">
      <div className="workout-card-header">
        <div>
          <h3>{workout.name}</h3>
          <div className="workout-details">
            <span><strong>Sarjat:</strong> {workout.sets}</span>
            <span><strong>Toistot:</strong> {workout.reps}</span>
            <span><strong>Paino:</strong> {workout.weight} kg</span>
            <span><strong>Päivä:</strong> {workout.date}</span>
          </div>
        </div>
        <button 
          onClick={() => onDelete(workout.id)}
          className="btn btn-danger"
        >
          Poista
        </button>
      </div>
    </div>
  )
}

export default WorkoutItem