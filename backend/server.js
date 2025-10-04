import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Lataa ympäristömuuttujat
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Tiedostopolun määritys ES modules yhteensopivuutta varten
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workoutsFilePath = path.join(__dirname, 'workouts.json');

// Middleware
app.use(helmet()); // Turvallisuus middleware
app.use(cors()); // CORS-tuki frontend-yhteyksiä varten
app.use(morgan('combined')); // Lokitus
app.use(express.json()); // JSON-parseri
app.use(express.urlencoded({ extended: true })); // URL-enkoodattu data

// Funktiot JSON-tiedoston lukemiseen ja tallentamiseen
const readWorkoutsFromFile = () => {
  try {
    if (fs.existsSync(workoutsFilePath)) {
      const data = fs.readFileSync(workoutsFilePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Virhe treenien lukemisessa:', error);
    return [];
  }
};

const saveWorkoutsToFile = (workouts) => {
  try {
    fs.writeFileSync(workoutsFilePath, JSON.stringify(workouts, null, 2));
  } catch (error) {
    console.error('Virhe treenien tallentamisessa:', error);
  }
};

// Lataa treenit tiedostosta
let workouts = readWorkoutsFromFile();

// Etsi suurin ID ja aseta nextId sen mukaan
let nextId = workouts.length > 0 ? Math.max(...workouts.map(w => w.id)) + 1 : 1;

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
    saveWorkoutsToFile(workouts); // Tallenna tiedostoon
    
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
    
    saveWorkoutsToFile(workouts); // Tallenna tiedostoon
    
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
    saveWorkoutsToFile(workouts); // Tallenna tiedostoon
    
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