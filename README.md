# Full-Stack Web Development: React + Flask + MongoDB

## Intelligent Web Dashboard — Experiments 5–12

**Technologies:** React 18, Vite, Python Flask, MongoDB, PyMongo, Chart.js, Axios, VADER Sentiment and Pillow.

---

# 1. Project Overview

The Intelligent Web Dashboard is a full-stack web application that integrates a React frontend, Flask REST API backend and MongoDB database. The application provides text sentiment analysis, image analysis, prediction history and dashboard statistics through a web interface.

The frontend is developed using React and Vite. The backend uses Flask to expose REST API endpoints, while MongoDB stores prediction records. VADER is used for text sentiment analysis, and Pillow validates uploaded images and extracts image metadata. An optional Vision Transformer model can be enabled for image classification.

## 2. System Architecture

```text
                USER / BROWSER
                      |
                      v
              REACT + VITE
              Port: 5173
                      |
                 Axios / HTTP
                      |
                      v
                FLASK REST API
                 Port: 5000
                      |
              +-------+--------+
              |                |
              v                v
       SENTIMENT ANALYSIS   IMAGE ANALYSIS
          VADER + scores    Pillow + optional ViT
              |                |
              +-------+--------+
                      |
                      v
                MONGODB
               Port: 27017
                      |
                      v
             PREDICTION RECORDS
             AND DASHBOARD STATS
```

## 3. Software and Hardware Requirements

### Software Requirements

- Operating System: macOS, Windows or Linux
- Frontend: React 18 and Vite
- Backend: Python and Flask
- Database: MongoDB and PyMongo
- Visualization: Chart.js and react-chartjs-2
- HTTP Client: Axios
- Sentiment Analysis: VADER Sentiment
- Image Processing: Pillow
- Optional Image Classification: Transformers and PyTorch
- Code Editor: Visual Studio Code
- Browser: Chrome, Safari or Firefox
- Version Control: Git and GitHub

### Hardware Requirements

- Laptop or desktop computer
- Minimum 4 GB RAM recommended
- Internet connection for downloading dependencies and, if enabled, the image model
- Additional memory may be required when running the optional image classification model

---

# EXPERIMENT 05 — Flask Backend and MongoDB CRUD

## Aim

To develop a Flask REST API and integrate MongoDB for storing, retrieving and deleting prediction records.

## Requirements

- Python
- Flask
- Flask-CORS
- PyMongo
- MongoDB
- python-dotenv

## Procedure

1. Create the Flask application in `backend/app.py`.
2. Configure the MongoDB connection using PyMongo.
3. Register the API blueprint with the `/api` URL prefix.
4. Implement a health endpoint to check API and database availability.
5. Implement endpoints for retrieving and deleting prediction records.
6. Add JSON input validation and error handling.
7. Test the API using a browser or API testing tool.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Return application status |
| GET | `/api/health` | Check backend and MongoDB status |
| GET | `/api/predictions` | Retrieve the latest prediction records |
| DELETE | `/api/predictions/<record_id>` | Delete a prediction by its ID |
| GET | `/api/stats` | Retrieve prediction and sentiment statistics |

**Implementation note:** The current backend has no general `POST /api/predictions` endpoint. Prediction records are created through the sentiment and image analysis endpoints.

## Expected Output

The Flask server returns JSON responses. When MongoDB is running and reachable, the health endpoint reports that the database is connected. Prediction retrieval and deletion operate on records in the MongoDB `predictions` collection.

## Result

The Flask backend and MongoDB integration are implemented in the project. Verify the endpoints against a running MongoDB instance before recording the experiment as successfully tested.

**Screenshot:** `docs/screenshots/exp05-backend-crud.png`

---

# EXPERIMENT 06 — React Integration with Flask Sentiment API

## Aim

To connect the React frontend with a Flask sentiment analysis API using Axios and display the sentiment analysis results.

## Requirements

- React
- Vite
- Axios
- Flask
- VADER Sentiment
- MongoDB

## Procedure

1. Create the sentiment analysis page in React.
2. Provide a text input interface for entering text.
3. Configure Axios in `frontend/src/services/api.js`.
4. Send the text to the `/api/sentiment` endpoint.
5. Process the input with VADER in `backend/services/sentiment.py`.
6. Assign a positive, neutral or negative label based on the compound sentiment score.
7. Store the result in MongoDB and return the result to the frontend.
8. Display the returned result and handle API errors.

## API Details

**Endpoint:** `POST /api/sentiment`

**Example request:**

```json
{
  "text": "The application is fast and intuitive!"
}
```

The backend requires non-empty text of no more than 10,000 characters.

## Expected Output

The API returns a sentiment label, score, component scores, timestamp and record ID when the prediction is saved successfully. The React page can present the result to the user.

## Result

The Flask sentiment analysis service and API endpoint are implemented. Confirm the complete frontend request-and-response flow in the browser before marking the integration as fully tested.

**Screenshot:** `docs/screenshots/exp06-sentiment-analysis.png`

---

# EXPERIMENT 07 — Dashboard Statistics and Data Visualization

## Aim

To develop a dashboard that presents prediction statistics and visual summaries using React and Chart.js.

## Requirements

- React
- Chart.js
- react-chartjs-2
- Flask
- MongoDB
- Axios

## Procedure

1. Create the Overview page in `frontend/src/pages/Overview.jsx`.
2. Use reusable dashboard components such as `StatCard.jsx`.
3. Retrieve statistical information from the `/api/stats` endpoint.
4. Count the total prediction records, sentiment predictions and image predictions.
5. Group sentiment predictions by positive, neutral and negative labels.
6. Present the available statistics through dashboard cards and charts.
7. Verify the displayed values against the data stored in MongoDB.

## API Details

**Endpoint:** `GET /api/stats`

The response includes:

- Total prediction count
- Sentiment prediction count
- Image prediction count
- Sentiment labels
- Count for each sentiment label

## Expected Output

The dashboard displays statistics calculated from the prediction records available in MongoDB. Chart.js and react-chartjs-2 are included in the frontend dependencies for data visualization.

## Result

The backend statistics endpoint and dashboard-related frontend files are present in the project. Verify the live dashboard and its chart output before claiming that all visualizations have been tested.

**Screenshot:** `docs/screenshots/exp07-performance-dashboard.png`

---

# EXPERIMENT 08 — Image Analysis and Optional Classification

## Aim

To create an image analysis workflow that accepts uploaded images, validates them using Pillow and optionally classifies them using a Vision Transformer model.

## Requirements

- React
- Flask
- Pillow
- Multipart form data
- MongoDB
- Optional: Transformers and PyTorch

## Procedure

1. Create the image analysis page in `frontend/src/pages/Images.jsx`.
2. Allow the user to select an image file.
3. Send the image to the backend using multipart form data.
4. Receive the uploaded file through the `image` field in the `/api/classify` endpoint.
5. Validate the image and extract its dimensions and format using Pillow.
6. Reject unsupported formats and invalid or excessively large dimensions.
7. When the optional model is enabled, load `google/vit-base-patch16-224` and obtain the top image classification result.
8. Save the analysis result in MongoDB and return the result to the frontend.

## API Details

**Endpoint:** `POST /api/classify`

**Request:** Multipart form data with the field name `image`.

**Supported image formats:** JPEG, PNG, WEBP and GIF.

**Important:** Image classification is disabled by default. With `ENABLE_IMAGE_MODEL=false`, the service validates the image and returns metadata-only analysis. Actual model classification requires the optional model dependencies and configuration.

## Expected Output

The backend returns image dimensions, format, label, model information and a timestamp when the result is saved successfully. With the classifier disabled, the label indicates that the image was analyzed with the classifier disabled.

## Result

The backend image analysis service and classification endpoint are implemented. The optional Vision Transformer classification must be enabled and tested separately before reporting it as completed.

**Screenshot:** `docs/screenshots/exp08-image-classification.png`

---

# EXPERIMENT 09 — Web Speech API Integration

## Aim

To investigate browser-based speech recognition and its possible integration with the sentiment analysis interface.

## Requirements

- React
- Browser Web Speech API support
- Microphone permission
- Flask sentiment API

## Procedure

1. Check whether the current frontend contains a speech recognition control.
2. If implemented, request microphone permission from the browser.
3. Initialize speech recognition in a supported browser.
4. Convert spoken input into text.
5. Display the recognized text in the sentiment input field.
6. Submit the text to the `/api/sentiment` endpoint.
7. Handle browser compatibility and microphone permission errors.

## Expected Output

If speech recognition is implemented and supported by the browser, spoken words are transcribed into text and can be submitted for sentiment analysis.

## Result

**Pending verification:** The supplied project file listing does not confirm a Web Speech API implementation. Treat this experiment as planned until speech recognition code is added and tested.

**Screenshot:** `docs/screenshots/exp09-voice-input.png` *(capture after implementation and testing)*

---

# EXPERIMENT 10 — Integrated Intelligent Web Application

## Aim

To integrate the available React pages, Flask API endpoints, sentiment analysis, image analysis and MongoDB prediction records into one web application.

## Requirements

- React
- Vite
- Flask
- MongoDB
- Axios
- Chart.js
- React components and pages

## Procedure

1. Create the main application in `frontend/src/App.jsx`.
2. Use the sidebar component for application navigation.
3. Organize the Overview, Sentiment, Images and History pages.
4. Configure Axios to communicate with the Flask backend.
5. Connect the sentiment page to the sentiment analysis endpoint.
6. Connect the image page to the image analysis endpoint.
7. Retrieve prediction history and dashboard statistics from the backend.
8. Test the application pages and verify API communication.

## Expected Output

The application provides a unified interface for navigating the available dashboard, sentiment analysis, image analysis and history pages.

## Result

The React page and component files and the Flask endpoints for the main workflows are present. Verify navigation, page rendering, database connectivity and API responses before marking the integrated application as fully tested.

**Screenshot:** `docs/screenshots/exp10-integrated-application.png`

---

# EXPERIMENT 11 — Docker Containerization

## Aim

To containerize the frontend and backend services and configure the application to run using Docker.

## Requirements

- Docker
- Docker Compose
- Frontend Dockerfile
- Backend Dockerfile
- Docker Compose configuration
- MongoDB service or accessible MongoDB instance

## Procedure

1. Create a Dockerfile for the frontend.
2. Create a Dockerfile for the Flask backend.
3. Configure the required environment variables.
4. Define the frontend, backend and database services in Docker Compose.
5. Configure service communication and API URLs.
6. Build and start the containers.
7. Verify that the services can communicate and that the application works.

## Commands

Start the application after Docker configuration has been created:

```bash
docker compose up --build
```

Stop the services:

```bash
docker compose down
```

## Expected Output

The configured application services run in Docker containers and can communicate with each other.

## Result

**Pending verification:** Dockerfiles and a Docker Compose configuration were not present in the supplied project file listing. This experiment is planned until the configuration is created and tested.

**Screenshot:** `docs/screenshots/exp11-docker-containers.png` *(capture after implementation and testing)*

---

# EXPERIMENT 12 — Cloud Deployment Readiness

## Aim

To prepare the full-stack application for deployment by configuring environment variables, production builds, database connectivity and frontend-backend communication.

## Requirements

- Node.js and npm
- Python and Flask
- Production frontend build
- Hosted backend service
- Hosted MongoDB database
- Environment variables
- CORS configuration
- Cloud hosting account

## Procedure

1. Configure the frontend API URL.
2. Configure the backend MongoDB URI and database name.
3. Set the production frontend origin in the backend CORS configuration.
4. Build the React frontend.
5. Configure a suitable production start command for Flask.
6. Configure secure database credentials using environment variables.
7. Deploy the frontend and backend to selected hosting services.
8. Test the deployed API and application.

## Frontend Build Command

Run inside the `frontend` directory:

```bash
npm run build
```

## Example Environment Variables

Frontend `.env`:

```text
VITE_API_URL=https://your-backend-host.example/api
```

Backend `.env`:

```text
MONGO_URI=your_mongodb_connection_string
DB_NAME=fullstack_ai_app
FRONTEND_ORIGIN=https://your-frontend-host.example
MAX_CONTENT_LENGTH_MB=5
ENABLE_IMAGE_MODEL=false
```

Replace the example URLs and database connection string with actual values from the chosen hosting providers. Never commit real credentials or secrets to GitHub.

## Expected Output

The frontend build completes successfully, and the application can communicate with the configured backend and database after deployment.

## Result

**Pending verification:** The frontend build script and backend environment configuration support preparation for deployment. A live deployment has not been confirmed by the supplied files.

**Screenshot:** `docs/screenshots/exp12-deployment-readiness.png` *(capture after implementation and testing)*

---

# 4. Project Directory Structure

The following structure reflects the files confirmed in the project listing. Additional configuration files may exist outside the displayed listing.

```text
fullstack-ai-web-app/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── uploads/
│   │   └── .gitkeep
│   ├── routes/
│   │   ├── __init__.py
│   │   └── api.py
│   └── services/
│       ├── __init__.py
│       ├── sentiment.py
│       └── image_service.py
│
├── frontend/
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   └── StatCard.jsx
│       ├── pages/
│       │   ├── Overview.jsx
│       │   ├── Sentiment.jsx
│       │   ├── Images.jsx
│       │   └── History.jsx
│       └── services/
│           └── api.js
│
└── README.md
```

---

# 5. How to Run the Project on macOS

## Terminal 1 — Start MongoDB

Ensure MongoDB is installed and running. The application defaults to the local MongoDB URI:

```text
mongodb://127.0.0.1:27017
```

If MongoDB is hosted elsewhere, configure `MONGO_URI` in the backend `.env` file.

## Terminal 2 — Start the Backend

Open Terminal and navigate to the backend directory:

```bash
cd ~/Downloads/fullstack-ai-web-app/backend
```

Create and activate a virtual environment if you do not already have one:

```bash
python3 -m venv venv
source venv/bin/activate
```

Install the dependencies:

```bash
python3 -m pip install -r requirements.txt
```

Create `backend/.env` using `backend/.env.example` as a reference, then configure the required values.

Start Flask:

```bash
python app.py
```

The backend runs at:

`http://127.0.0.1:5000`

Test the health endpoint at:

`http://127.0.0.1:5000/api/health`

The health endpoint requires a working MongoDB connection to report a healthy status.

## Terminal 3 — Start the Frontend

Open a separate terminal:

```bash
cd ~/Downloads/fullstack-ai-web-app/frontend
npm install
npm run dev
```

Open the URL displayed by Vite, usually:

`http://localhost:5173/`

If Vite chooses a different port, use the URL shown in the terminal and ensure the backend CORS configuration permits that frontend origin.

---

# 6. Testing Checklist

Use this checklist during verification:

- [ ] MongoDB is running and accessible.
- [ ] Flask starts without errors.
- [ ] The backend health endpoint returns a healthy response.
- [ ] The React frontend starts without errors.
- [ ] The frontend page renders correctly.
- [ ] Text sentiment analysis returns the expected response structure.
- [ ] Sentiment records are saved in MongoDB.
- [ ] Image uploads are validated correctly.
- [ ] Optional image classification works when enabled, if required.
- [ ] Prediction history loads.
- [ ] Prediction deletion works.
- [ ] Dashboard statistics match the database records.
- [ ] Navigation between application pages works.
- [ ] Web Speech API works, if implemented.
- [ ] Docker configuration works, if implemented.
- [ ] Production build and deployment work, if configured.

---

# 7. Screenshots for Practical Submission

Save genuine screenshots of the running application in `docs/screenshots/`. Create the folders if needed.

1. `exp05-backend-crud.png`
2. `exp06-sentiment-analysis.png`
3. `exp07-performance-dashboard.png`
4. `exp08-image-classification.png`
5. `exp09-voice-input.png`
6. `exp10-integrated-application.png`
7. `exp11-docker-containers.png`
8. `exp12-deployment-readiness.png`

Only add screenshots that show actual results. For experiments that are not yet implemented, capture screenshots after completing and testing the relevant functionality.

---

# 8. Overall Conclusion

The Intelligent Web Dashboard combines React, Flask and MongoDB to demonstrate full-stack web development. The implemented backend includes VADER-based sentiment analysis, image validation and metadata processing, optional image classification, prediction history, record deletion and dashboard statistics.

The modular project structure separates frontend pages and reusable components from backend API routes and processing services. Further work can extend the application with browser speech recognition, Docker containerization, automated testing and cloud deployment.

**Practical submission note:** Mark each experiment as completed only after verifying the relevant functionality. Experiments involving speech recognition, Docker and cloud deployment remain pending until they have been implemented and tested.
