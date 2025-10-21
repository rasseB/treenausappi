const WeekCalendar = ({ workouts, onDayClick, currentWeekStart, onWeekChange }) => {
  // Laske viikkonumero (ISO 8601)
  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNo;
  };

  // Siirrä viikkoa eteen tai taaksepäin
  const changeWeek = (direction) => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() + (direction * 7));
    onWeekChange(newWeekStart);
  };

  // Laske viikon päivät
  const getWeekDays = (startDate) => {
    if (!startDate) return [];
    
    const days = [];
    const dayNames = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      days.push({
        dayName: dayNames[i],
        date: dateString,
        dayNumber: date.getDate(),
        fullDayName: ['Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai', 'Sunnuntai'][i]
      });
    }
    
    return days;
  };

  // Jos currentWeekStart on null, älä renderöi kalenteria
  if (!currentWeekStart) {
    return <div className="week-calendar"><h2>Ladataan...</h2></div>;
  }

  const weekDays = getWeekDays(currentWeekStart);

  // Tarkista onko kaikki päivän liikkeet tehty
  const isDayCompleted = (dateString) => {
    const dayWorkout = workouts[dateString];
    if (!dayWorkout || !dayWorkout.exercises || dayWorkout.exercises.length === 0) {
      return false;
    }
    return dayWorkout.exercises.every(ex => ex.completed);
  };

  // Hae tämän päivän päivämäärä (ilman kellonaikaa)
  const today = new Date().toISOString().split('T')[0];
  
  // Laske nykyisen viikon numero
  const weekNumber = currentWeekStart ? getWeekNumber(currentWeekStart) : '';

  return (
    <div className="week-calendar">
      <div className="week-header">
        <button className="week-nav-btn" onClick={() => changeWeek(-1)}>←</button>
        <h2>Viikon {weekNumber} treenit</h2>
        <button className="week-nav-btn" onClick={() => changeWeek(1)}>→</button>
      </div>
      <div className="week-grid">
        {weekDays.map(day => {
          const dayWorkout = workouts[day.date];
          const isCompleted = isDayCompleted(day.date);
          const isToday = day.date === today;
          // Näytä "Lepo" oletuksena jos päivää ei ole luotu
          const workoutType = dayWorkout ? dayWorkout.workoutType : 'Lepo';
          
          return (
            <div
              key={day.date}
              className={`day-card ${isToday ? 'today' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => onDayClick(day.date)}
            >
              <div className="day-header">
                <span className="day-name">{day.dayName}</span>
                <span className="day-number">{day.dayNumber}</span>
              </div>
              <div className="day-content">
                <span className="workout-type">{workoutType}</span>
                {isCompleted && <span className="check-mark">✓</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekCalendar;
