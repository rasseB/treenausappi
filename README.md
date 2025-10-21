# Treenausappi

Yksinkertainen treenipäiväkirjasovellus React frontend:lla ja Node.js/Express backend:lla.

## Projektin rakenne

```
treenausappi/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── WeekCalendar.jsx
│   │   │   ├── DayWorkout.jsx
│   │   │   └── ExerciseForm.jsx
│   │   ├── services/
│   │   │   └── workouts.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── backend/               # Node.js/Express API
    ├── server.js
    ├── workouts.json
    ├── requests.rest
    ├── package.json
    └── README.md
```

## 🚀 Käynnistys

### 1. Backend (Node.js + Express)
```bash
cd backend
npm install
npm run dev
```
Backend käynnistyy portissa **3001**.

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend käynnistyy portissa **5173**.

Avaa selaimessa: http://localhost:5173

## ✨ Ominaisuudet

### Frontend
- ✅ Viikkokalenteri-näkymä
- ✅ Päivän treenikohtainen näkymä
- ✅ Liikkeiden lisääminen päivään
- ✅ Liikkeiden merkkaaminen tehdyiksi
- ✅ Treenityypin valinta (Työntö/Veto/Jalat/Lepo/Cardio/Koko keho)
- ✅ Liikkeiden poisto
- ✅ Responsiivinen käyttöliittymä
- ✅ Viikkojen selaus (edellinen/seuraava)
- ✅ Tämän päivän korostus

### Backend
- ✅ RESTful API
- ✅ Päivämääräkohtainen treenien hallinta
- ✅ JSON-tiedostoon tallennus
- ✅ CORS-tuki
- ✅ Virheidenkäsittely
- ✅ API-testit (requests.rest)

## 🛠️ Teknologiat

### Frontend
- React 19
- Vite 7
- CSS3

### Backend
- Node.js
- Express 4
- CORS
- Helmet (turvallisuus)
- Morgan (lokitus)
