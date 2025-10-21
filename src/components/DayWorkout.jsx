const DayWorkout = ({ date, workout, onBack, onToggleExercise, onAddExercise, onDeleteExercise, onWorkoutTypeChange }) => {
  const workoutTypes = ['Lepo', 'Työntö', 'Veto', 'Jalat', 'Cardio', 'Koko keho'];
  
  // Luo oletuspäivä jos ei ole olemassa
  const dayNames = ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'];
  const dateObj = new Date(date);
  const dayName = dayNames[dateObj.getDay()];
  
  const currentWorkout = workout || {
    dayName: dayName,
    workoutType: 'Lepo',
    exercises: []
  };

  const allCompleted = currentWorkout.exercises.length > 0 && 
                       currentWorkout.exercises.every(ex => ex.completed);

  return (
    <div className="day-workout">
      <button onClick={onBack} className="back-button">← Takaisin</button>
      
      <div className="day-header-info">
        <h2>{currentWorkout.dayName}</h2>
        <p className="date-info">{date}</p>
        
        <div className="workout-type-selector">
          <label htmlFor="workout-type">Treenityyppi:</label>
          <select 
            id="workout-type"
            value={currentWorkout.workoutType}
            onChange={(e) => onWorkoutTypeChange(date, e.target.value)}
          >
            {workoutTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        {allCompleted && <span className="completed-badge">✓ Suoritettu</span>}
      </div>

      <div className="exercises-list">
        <h3>Liikkeet</h3>
        {currentWorkout.exercises.length === 0 ? (
          <p className="no-exercises">Ei liikkeitä. Lisää liikkeitä alla olevasta napista.</p>
        ) : (
          currentWorkout.exercises.map(exercise => (
            <div 
              key={exercise.id} 
              className={`exercise-item ${exercise.completed ? 'completed' : ''}`}
            >
              <div className="exercise-checkbox">
                <input
                  type="checkbox"
                  checked={exercise.completed}
                  onChange={() => onToggleExercise(date, exercise.id, !exercise.completed)}
                />
              </div>
              <div className="exercise-details">
                <h4>{exercise.name}</h4>
                <p className="exercise-stats">
                  {exercise.sets} sarjaa × {exercise.reps} toistoa @ {exercise.weight} kg
                </p>
              </div>
              <button 
                onClick={() => onDeleteExercise(date, exercise.id)}
                className="delete-btn"
                title="Poista liike"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      <button onClick={() => onAddExercise(date)} className="add-exercise-btn">
        + Lisää liike
      </button>
    </div>
  );
};

export default DayWorkout;
