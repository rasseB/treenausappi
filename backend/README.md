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

Tai tuotantokäyttöön:
```bash
npm start
```

### API Endpoints

**Base URL:** `http://localhost:3001`

#### Health Check
- **GET** `/health` - Tarkista palvelimen tila

#### Workouts
- **GET** `/api/workouts` - Hae kaikki treenit
- **GET** `/api/workouts/:id` - Hae yksittäinen treeni
- **POST** `/api/workouts` - Lisää uusi treeni
- **PUT** `/api/workouts/:id` - Päivitä treeni
- **DELETE** `/api/workouts/:id` - Poista treeni

### Treenin tietorakenne

```json
{
  "id": 1,
  "name": "Penkkipunnerrus",
  "sets": 3,
  "reps": 10,
  "weight": 80,
  "date": "2024-01-15"
}
```

### POST/PUT pyynnön body

```json
{
  "name": "Treenin nimi",
  "sets": 3,
  "reps": 10,
  "weight": 80,
  "date": "2024-01-15" // valinnainen, käyttää tämän päivän päivämäärää jos ei anneta
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
- Express.js
- CORS (Cross-Origin Resource Sharing)
- Helmet (turvallisuus)
- Morgan (lokitus)
- dotenv (ympäristömuuttujat)

### Kehitys

Käytä `nodemon`ia kehityksessä automaattista uudelleenkäynnistystä varten:
```bash
npm run dev
```