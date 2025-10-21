# Treenausappi Frontend

React + Vite frontend sovellus treenipäiväkirjalle.

## 🚀 Käynnistäminen

### Ensimmäinen kerta:

```bash
cd frontend
npm install
npm run dev
```

Frontend käynnistyy osoitteessa: http://localhost:5173

## 📝 Komennot

- `npm run dev` - Käynnistä development server
- `npm run build` - Buildaa tuotantoversioon
- `npm run preview` - Esikatsele tuotantoversiota
- `npm run lint` - Aja ESLint

## 🔗 Backend

Muista käynnistää backend erikseen portissa 3001:

```bash
cd ../backend
npm run dev
```

## 📁 Rakenne

```
frontend/
├── src/              # React komponentit ja koodi
├── public/           # Staattiset tiedostot
├── index.html        # HTML entry point
├── package.json      # Riippuvuudet
└── vite.config.js    # Vite-konfiguraatio
```
