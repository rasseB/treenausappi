# Backend README

## Treenausappi Backend

Tämä on treenausappin backend-API, joka tarjoaa REST-rajapinnat treenien hallintaan.

### Asennus

1. Siirry backend-kansioon:
```bash
cd backend
```

2. Asenna riippuvuudet:
```bash
npm install
```

3. Käynnistä kehityspalvelin:
```bash
npm run dev
```


### API Endpoints

**Base URL:** `http://localhost:3001`

#### Health Check
- **GET** `/health` - Tarkista palvelimen tila

#### Workouts (päivämääräkohtaiset)
- **GET** `/api/workouts` - Hae kaikki päivät ja niiden treenit
- **GET** `/api/workouts/:date` - Hae tietyn päivän treeni (esim. `2025-10-20`)
- **POST** `/api/workouts/:date/exercises` - Lisää liike tietylle päivälle
- **PUT** `/api/workouts/:date/type` - Vaihda päivän treenityyppi
- **PUT** `/api/workouts/:date/exercises/:exerciseId` - Merkkaa liike tehdyksi/ei-tehdyksi
- **DELETE** `/api/workouts/:date/exercises/:exerciseId` - Poista liike

### Päivän tietorakenne

```json
{
  "2025-10-20": {
    "date": "2025-10-20",
    "dayName": "Maanantai",
    "workoutType": "Työntö",
    "exercises": [
      {
        "id": 1,
        "name": "Penkkipunnerrus",
        "sets": 3,
        "reps": 10,
        "weight": 80,
        "completed": false
      }
    ]
  }
}
```

### POST liike - Request body

```json
{
  "name": "Penkkipunnerrus",
  "sets": 3,
  "reps": 10,
  "weight": 80
}
```

### PUT treenityyppi - Request body

```json
{
  "workoutType": "Työntö"
}
```

### PUT liikkeen tila - Request body

```json
{
  "completed": true
}
```

### Vastauksen muoto

Kaikki API-vastaukset ovat JSON-muodossa:

**Onnistunut vastaus:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Kuvaus"
}
```

**Virhe:**
```json
{
  "success": false,
  "message": "Virheen kuvaus",
  "error": "Tekninen virheviesti (vain kehityksessä)"
}
```

### Käytetyt teknologiat

- Node.js
- Express.js 4
- CORS (Cross-Origin Resource Sharing)
- Helmet (turvallisuus)
- Morgan (lokitus)

### Kehitys

Backend käyttää `node --watch` komentoa automaattista uudelleenkäynnistystä varten:
```bash
npm run dev
```

### Testaus

Käytä `requests.rest` tiedostoa API-testaukseen VS Coden REST Client -laajennuksella.