import { useState } from 'react';

const ExerciseForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name || !sets || !reps || !weight) {
      alert('Täytä kaikki kentät');
      return;
    }

    onSubmit({
      name,
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: parseFloat(weight)
    });

    // Tyhjennä lomake
    setName('');
    setSets('');
    setReps('');
    setWeight('');
  };

  return (
    <div className="exercise-form-overlay">
      <div className="exercise-form">
        <h3>Lisää uusi liike</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Liikkeen nimi</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="esim. Penkkipunnerrus"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Sarjat</label>
              <input
                type="number"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                placeholder="3"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Toistot</label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="10"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Paino (kg)</label>
              <input
                type="number"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="80"
                min="0"
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-btn">Lisää liike</button>
            <button type="button" onClick={onCancel} className="cancel-btn">Peruuta</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExerciseForm;
