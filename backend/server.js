import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Tiedostopolun määritys ES modules -ympäristössä
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workoutsFilePath = path.join(__dirname, 'workouts.json');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());


// Funktiot JSON-tiedoston lukemiseen ja tallentamiseen
const readWorkoutsFromFile = () => {
  try {
    if (fs.existsSync(workoutsFilePath)) {
      const data = fs.readFileSync(workoutsFilePath, 'utf8');
      return JSON.parse(data);
    }
    return {};
  } catch (error) {
    console.error('Virhe treenien lukemisessa:', error);
    return {};
  }
};

const saveWorkoutsToFile = (workouts) => {
  try {
    fs.writeFileSync(workoutsFilePath, JSON.stringify(workouts, null, 2));
  } catch (error) {
    console.error('Virhe treenien tallentamisessa:', error);
  }
};

// Lataa treenit tiedostosta (objekti, jossa päivämäärät avaimina)
let workouts = readWorkoutsFromFile();

// Apufunktio seuraavan liike-ID:n löytämiseksi
const getNextExerciseId = () => {
  let maxId = 0;
  Object.values(workouts).forEach(day => {
    if (day.exercises) {
      day.exercises.forEach(ex => {
        if (ex.id > maxId) maxId = ex.id;
      });
    }
  });
  return maxId + 1;
};

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Backend toimii!',
    timestamp: new Date().toISOString()
  });
});

// GET - Hae kaikki päivät ja niiden treenit
app.get('/api/workouts', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: workouts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Virhe treenien haussa',
      error: error.message
    });
  }
});

// GET - Hae tietyn päivän treeni
app.get('/api/workouts/:date', (req, res) => {
  try {
    const { date } = req.params;
    const dayWorkout = workouts[date];
    
    if (!dayWorkout) {
      return res.status(404).json({
        success: false,
        message: 'Kyseiselle päivälle ei löytynyt treeniä'
      });
    }
    
    res.status(200).json({
      success: true,
      data: dayWorkout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Virhe treenin haussa',
      error: error.message
    });
  }
});

// POST - Lisää uusi päivä tai liike päivään
app.post('/api/workouts/:date/exercises', (req, res) => {
  try {
    const { date } = req.params;
    const { name, sets, reps, weight } = req.body;
    
    if (!name || !sets || !reps || !weight) {
      return res.status(400).json({
        success: false,
        message: 'Kaikki kentät (name, sets, reps, weight) ovat pakollisia'
      });
    }
    
    // Jos päivää ei ole, luo se
    if (!workouts[date]) {
      const dayNames = ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'];
      const dateObj = new Date(date);
      const dayName = dayNames[dateObj.getDay()];
      
      workouts[date] = {
        date: date,
        dayName: dayName,
        workoutType: 'Lepo',
        exercises: []
      };
    }
    
    const newExercise = {
      id: getNextExerciseId(),
      name: name.trim(),
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: parseFloat(weight),
      completed: false
    };
    
    workouts[date].exercises.push(newExercise);
    saveWorkoutsToFile(workouts);
    
    res.status(201).json({
      success: true,
      message: 'Liike lisätty onnistuneesti',
      data: newExercise
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Virhe liikkeen lisäämisessä',
      error: error.message
    });
  }
});

// PUT - Päivitä päivän treenityyppi
app.put('/api/workouts/:date/type', (req, res) => {
  try {
    const { date } = req.params;
    const { workoutType } = req.body;
    
    // Jos päivää ei ole, luo se
    if (!workouts[date]) {
      const dayNames = ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'];
      const dateObj = new Date(date);
      const dayName = dayNames[dateObj.getDay()];
      
      workouts[date] = {
        date: date,
        dayName: dayName,
        workoutType: workoutType,
        exercises: []
      };
    } else {
      workouts[date].workoutType = workoutType;
    }
    
    saveWorkoutsToFile(workouts);
    
    res.status(200).json({
      success: true,
      message: 'Treenityyppi päivitetty',
      data: workouts[date]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Virhe päivityksessä',
      error: error.message
    });
  }
});

// PUT - Merkkaa liike tehdyksi/ei-tehdyksi
app.put('/api/workouts/:date/exercises/:exerciseId', (req, res) => {
  try {
    const { date, exerciseId } = req.params;
    const { completed } = req.body;
    
    if (!workouts[date]) {
      return res.status(404).json({
        success: false,
        message: 'Päivää ei löytynyt'
      });
    }
    
    const exercise = workouts[date].exercises.find(ex => ex.id === parseInt(exerciseId));
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Liikettä ei löytynyt'
      });
    }
    
    exercise.completed = completed;
    saveWorkoutsToFile(workouts);
    
    res.status(200).json({
      success: true,
      message: 'Liikkeen tila päivitetty',
      data: exercise
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Virhe päivityksessä',
      error: error.message
    });
  }
});

// DELETE - Poista liike
app.delete('/api/workouts/:date/exercises/:exerciseId', (req, res) => {
  try {
    const { date, exerciseId } = req.params;
    
    if (!workouts[date]) {
      return res.status(404).json({
        success: false,
        message: 'Päivää ei löytynyt'
      });
    }
    
    const exerciseIndex = workouts[date].exercises.findIndex(ex => ex.id === parseInt(exerciseId));
    if (exerciseIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Liikettä ei löytynyt'
      });
    }
    
    const deletedExercise = workouts[date].exercises.splice(exerciseIndex, 1)[0];
    saveWorkoutsToFile(workouts);
    
    res.status(200).json({
      success: true,
      message: 'Liike poistettu onnistuneesti',
      data: deletedExercise
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Virhe poistamisessa',
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