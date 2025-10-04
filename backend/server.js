import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Lataa ympäristömuuttujat
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Turvallisuus middleware
app.use(cors()); // CORS-tuki frontend-yhteyksiä varten
app.use(morgan('combined')); // Lokitus
app.use(express.json()); // JSON-parseri
app.use(express.urlencoded({ extended: true })); // URL-enkoodattu data

// Dummy data (oikeassa sovelluksessa tämä olisi tietokannassa)
let workouts = [
  {
    id: 1,
    name: "Penkkipunnerrus",
    sets: 3,
    reps: 10,
    weight: 80,
    date: "2024-01-15"
  },
  {
    id: 2,
    name: "Kyykky",
    sets: 4,
    reps: 8,
    weight: 100,
    date: "2024-01-15"
  },
  {
    id: 3,
    name: "Maastaveto",
    sets: 3,
    reps: 5,
    weight: 120,
    date: "2024-01-16"
  }
];

let nextId = 4;

// Terveystarkistus
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Backend toimii!',
    timestamp: new Date().toISOString()
  });
});

// GET - Hae kaikki treenit
app.get('/api/workouts', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: workouts,
      count: workouts.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Virhe treenien haussa',
      error: error.message
    });
  }
});

// GET - Hae yksittäinen treeni ID:n perusteella
app.get('/api/workouts/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const workout = workouts.find(w => w.id === id);
    
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Treeniä ei löytynyt'
      });
    }
    
    res.status(200).json({
      success: true,
      data: workout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Virhe treenin haussa',
      error: error.message
    });
  }
});

// POST - Lisää uusi treeni
app.post('/api/workouts', (req, res) => {
  try {
    const { name, sets, reps, weight, date } = req.body;
    
    // Validointi
    if (!name || !sets || !reps || !weight) {
      return res.status(400).json({
        success: false,
        message: 'Kaikki kentät (name, sets, reps, weight) ovat pakollisia'
      });
    }
    
    const newWorkout = {
      id: nextId++,
      name: name.trim(),
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: parseFloat(weight),
      date: date || new Date().toISOString().split('T')[0]
    };
    
    workouts.push(newWorkout);
    
    res.status(201).json({
      success: true,
      message: 'Treeni lisätty onnistuneesti',
      data: newWorkout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Virhe treenin lisäämisessä',
      error: error.message
    });
  }
});

// PUT - Päivitä treeni
app.put('/api/workouts/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const workoutIndex = workouts.findIndex(w => w.id === id);
    
    if (workoutIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Treeniä ei löytynyt'
      });
    }
    
    const { name, sets, reps, weight, date } = req.body;
    
    // Päivitä vain annetut kentät
    if (name !== undefined) workouts[workoutIndex].name = name.trim();
    if (sets !== undefined) workouts[workoutIndex].sets = parseInt(sets);
    if (reps !== undefined) workouts[workoutIndex].reps = parseInt(reps);
    if (weight !== undefined) workouts[workoutIndex].weight = parseFloat(weight);
    if (date !== undefined) workouts[workoutIndex].date = date;
    
    res.status(200).json({
      success: true,
      message: 'Treeni päivitetty onnistuneesti',
      data: workouts[workoutIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Virhe treenin päivittämisessä',
      error: error.message
    });
  }
});

// DELETE - Poista treeni
app.delete('/api/workouts/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const workoutIndex = workouts.findIndex(w => w.id === id);
    
    if (workoutIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Treeniä ei löytynyt'
      });
    }
    
    const deletedWorkout = workouts.splice(workoutIndex, 1)[0];
    
    res.status(200).json({
      success: true,
      message: 'Treeni poistettu onnistuneesti',
      data: deletedWorkout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Virhe treenin poistamisessa',
      error: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Reittiä ei löytynyt'
  });
});

// Virheenkäsittelijä
app.use((error, req, res, next) => {
  console.error('Virhe:', error);
  res.status(500).json({
    success: false,
    message: 'Sisäinen palvelinvirhe',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Käynnistä palvelin
app.listen(PORT, () => {
  console.log(`🚀 Backend käynnissä portissa ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/workouts`);
});

export default app;