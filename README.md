# Full-Stack AI Web Application

A beginner-friendly full-stack project built with **React + Vite**, **Flask**, and **MongoDB**. It brings together a dashboard, sentiment analysis, browser speech-to-text, image upload/analysis, prediction history, and statistics APIs.

> **Implementation status:** Sentiment analysis is implemented with VADER. Image upload validation and image metadata analysis work out of the box. A pretrained image-classification model is optional and can be enabled separately. Browser speech recognition depends on browser support and permissions.

## Features

- Responsive React dashboard with summary metrics and charts
- Sentiment analysis API using VADER
- MongoDB persistence for text predictions and image-analysis records
- History list and delete operation
- Statistics endpoint for dashboard charts
- Image upload with file type/size validation and image dimensions
- Optional pretrained image classifier using Hugging Face Transformers
- Browser speech-to-text input where supported
- Flask REST API, CORS configuration, environment variables, and health endpoint

## Technology stack

- Frontend: React, Vite, JavaScript, Chart.js, react-chartjs-2, Axios
- Backend: Python, Flask, Flask-CORS, PyMongo, python-dotenv, VADER Sentiment
- Database: MongoDB Community or MongoDB Atlas
- Optional image model: Transformers + PyTorch
- Version control: Git and GitHub

## Architecture

```text
Browser
  |
  v
React + Vite (port 5173)
  |
  | HTTP / JSON or multipart upload
  v
Flask REST API (port 5000)
  |                 |
  v                 v
VADER sentiment   Pillow / optional image model
  |
  v
MongoDB (predictions and image analyses)
```

## Project structure

```text
fullstack-ai-web-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── backend/
│   ├── routes/api.py
│   ├── services/sentiment.py
│   ├── services/image_service.py
│   ├── app.py
│   ├── requirements.txt
│   ├── .env.example
│   └── uploads/.gitkeep
├── .gitignore
└── README.md
```

## Requirements on macOS

Install these first:
- Python 3.10 or newer
- Node.js 20.19+ or 22.12+ for current Vite releases
- Git
- MongoDB Community locally, or a MongoDB Atlas cluster
- VS Code (recommended)

Check your setup in Terminal:

```bash
python3 --version
node -v
npm -v
git --version
```

## 1. Configure MongoDB and the backend

Open Terminal and move into the project folder:

```bash
cd fullstack-ai-web-app
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env` and set `MONGO_URI`. For local MongoDB, the default is:

```env
MONGO_URI=mongodb://127.0.0.1:27017
DB_NAME=fullstack_ai_app
FRONTEND_ORIGIN=http://localhost:5173
MAX_CONTENT_LENGTH_MB=5
ENABLE_IMAGE_MODEL=false
```

If using MongoDB Atlas, replace the local URI with your Atlas connection string. Keep credentials private and never commit `.env`.

Start Flask from the `backend` directory:

```bash
python app.py
```

Check the API at <http://127.0.0.1:5000/api/health>. It should return JSON indicating the service is healthy and whether MongoDB is connected.

## 2. Start the React frontend

Open a **second Terminal window**:

```bash
cd fullstack-ai-web-app/frontend
npm install
npm run dev
```

Open the local URL Vite prints, usually <http://localhost:5173>.

The frontend uses `VITE_API_URL` when supplied; otherwise it calls `http://127.0.0.1:5000/api`.

## 3. Optional image-classification model

Image upload and metadata analysis work without a model. To enable actual pretrained image classification, install the optional packages in the active backend virtual environment:

```bash
pip install transformers torch
```

Set this in `backend/.env`:

```env
ENABLE_IMAGE_MODEL=true
```

Restart Flask. The first model run may download model files and take time; hardware, memory, and network access affect performance. The pretrained model predicts general image labels and is not a medical or safety system.

If model loading fails, set `ENABLE_IMAGE_MODEL=false` to use image metadata analysis.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API and database health |
| POST | `/api/sentiment` | Analyze text sentiment and save result |
| GET | `/api/predictions` | List saved records |
| DELETE | `/api/predictions/<id>` | Delete a saved record |
| GET | `/api/stats` | Dashboard counts and chart data |
| POST | `/api/classify` | Validate image, analyze dimensions, and optionally classify |

### Test the sentiment API

With Flask running, open a third Terminal:

```bash
curl -X POST http://127.0.0.1:5000/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text":"This application is wonderful and easy to use!"}'
```

## Troubleshooting

- **MongoDB connection error:** Check that the local MongoDB service is running or verify your Atlas URI, database user, and network access.
- **Network Error in React:** Confirm Flask is running on port 5000 and check `VITE_API_URL`.
- **CORS error:** Ensure `FRONTEND_ORIGIN` matches the exact frontend origin, including port.
- **Module not found:** Activate `backend/.venv` and install `requirements.txt`, or run `npm install` in `frontend`.
- **Speech recognition unavailable:** Try a browser that supports the Web Speech API, allow microphone access, or type text manually.
- **Image model slow to start:** Keep `ENABLE_IMAGE_MODEL=false` until the optional dependencies and model download are ready.

## Push to GitHub

Create an empty repository on GitHub named `fullstack-ai-web-app`. In Terminal, from the project root:

```bash
git init
git branch -M main
git add .
git status
git commit -m "Build full-stack AI web application"
git remote add origin https://github.com/YOUR-USERNAME/fullstack-ai-web-app.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. If GitHub asks you to authenticate, follow its current sign-in instructions. Never commit `.env`, API keys, database passwords, virtual environments, or `node_modules`.

## Good next steps

1. Add screenshots of the running dashboard to `screenshots/`.
2. Add automated backend tests.
3. Deploy the frontend and backend separately and use Atlas for cloud database hosting.
4. Set production CORS and environment variables on the hosting platform.
5. Update this README as features are completed.

## Learning goals

This project demonstrates the core full-stack request cycle:

`User action → React state → HTTP request → Flask route → model/database → JSON response → React UI`
