# Treenausappi

Yksinkertainen treenipäiväkirjasovellus React frontend:lla ja Node.js/Express backend:lla.

## Projektin rakenne

```
treenausappi/
├── src/                    # React frontend
│   ├── components/
│   │   └── WorkoutManager.jsx
│   ├── App.jsx
│   └── main.jsx
├── backend/               # Node.js/Express API
│   ├── server.js
│   ├── package.json
│   ├── api-tests.http    # REST Client testit
│   └── README.md
└── package.json          # Frontend package.json
```

## Käynnistys

### 1. Frontend (React + Vite)
```bash
npm install
npm run dev
```
Frontend käynnistyy oletuksena portissa 5173.

### 2. Backend (Node.js + Express)
```bash
cd backend
npm install
npm run dev
```
Backend käynnistyy portissa 3001.

## Ominaisuudet

- ✅ Treenien lisääminen (POST)
- ✅ Treenien listaaminen (GET)
- ✅ Treenien poistaminen (DELETE) 
- ✅ Responsiivinen käyttöliittymä
- ✅ Virheidenkäsittely
- ✅ REST API dokumentaatio

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
