# Full-Stack Weather App (React + FastAPI)

This project implements the requirements for the PM Accelerator weather app assessments:

- **Tech Assessment 1**: Real-time weather, multi-location input, 5-day forecast, current-location support, beautiful UI.
- **Tech Assessment 2**: Persistent history with CRUD, extra API integrations (YouTube + Google Maps), and data export.

## Structure

```text
weather-app/
  backend/        # FastAPI, SQLAlchemy, SQLite, external APIs
    app/
      __init__.py
      main.py        # API routes (weather search, CRUD, export, extras)
      config.py      # Env-based settings
      database.py    # DB engine + session
      models.py      # WeatherRequest model
      schemas.py     # Pydantic schemas
      weather_client.py
      youtube_client.py
    requirements.txt
    .env.example
    README.md

  frontend/       # React + Vite SPA
    index.html
    vite.config.js
    package.json
    src/
      main.jsx
      App.jsx
      api.js
      styles/
        global.css
      components/
        Layout.jsx
        SearchBar.jsx
        WeatherSummary.jsx
        HistoryTable.jsx
        InfoModal.jsx
        ExtrasPanel.jsx
    README.md
```

## Running the app

1. **Backend**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # then edit and add your keys
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2. **Frontend**

```bash
cd frontend
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

## Notes

- The backend expects a valid `OPENWEATHER_API_KEY` in `.env` to fetch live weather and forecasts.
- The YouTube integration is optional; if you don't set `YOUTUBE_API_KEY`, the app will simply show a helpful message instead of videos.
- Update the footer text in `Layout.jsx` to include your real name as requested in the assessment.

![Full Weather App Flow](https://github.com/user-attachments/assets/e751ef51-291f-4c35-ac1a-9d8789f8c02d)

