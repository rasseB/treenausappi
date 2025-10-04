import { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:3001/api';

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Hae treenit
  const fetchWorkouts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/workouts`);
      const data = await response.json();
      
      if (data.success) {
        setWorkouts(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Virhe treenien haussa: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Lisää uusi treeni
  const addWorkout = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWorkout),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNewWorkout({
          name: '',
          sets: '',
          reps: '',
          weight: '',
          date: new Date().toISOString().split('T')[0]
        });
        fetchWorkouts(); // Päivitä lista
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Virhe treenin lisäämisessä: ' + err.message);
    }
  };

  // Poista treeni
  const deleteWorkout = async (id) => {
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchWorkouts(); // Päivitä lista
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Virhe treenin poistamisessa: ' + err.message);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorkout(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="workout-container">
      <h1>Treenipäiväkirja</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Uuden treenin lisääminen */}
      <div className="add-workout-section">
        <h2>Lisää uusi treeni</h2>
        <form onSubmit={addWorkout}>
          <div className="form-grid">
            <div className="form-field">
              <label>Liike:</label>
              <input
                type="text"
                name="name"
                value={newWorkout.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-field">
              <label>Päivämäärä:</label>
              <input
                type="date"
                name="date"
                value={newWorkout.date}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-field">
              <label>Sarjat:</label>
              <input
                type="number"
                name="sets"
                value={newWorkout.sets}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>
            <div className="form-field">
              <label>Toistot:</label>
              <input
                type="number"
                name="reps"
                value={newWorkout.reps}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>
            <div className="form-field">
              <label>Paino (kg):</label>
              <input
                type="number"
                name="weight"
                value={newWorkout.weight}
                onChange={handleInputChange}
                required
                min="0"
                step="0.5"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Lisää treeni
          </button>
        </form>
      </div>

      {/* Treenien lista */}
      <div>
        <div className="workouts-header">
          <h2>Treenit ({workouts.length})</h2>
          <button 
            onClick={fetchWorkouts} 
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
              <div key={workout.id} className="workout-card">
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
                    onClick={() => deleteWorkout(workout.id)}
                    className="btn btn-danger"
                  >
                    Poista
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App
