# 🤖 Full-Stack AI Web App

A full-stack web application for sentiment analysis, image metadata processing, dashboard analytics, and prediction history management.

## 📌 1. Project Overview

The Full-Stack AI Web App is a web-based application designed to analyze text sentiment, process image information, and present results through a user-friendly dashboard.

The application integrates a React.js frontend, Flask REST API backend, and MongoDB database. Users can submit text for sentiment analysis, upload supported images for metadata extraction, view dashboard statistics, and access previously stored prediction records.

The project demonstrates the integration of frontend development, backend API services, database operations, and AI-based text analysis in a single web application.

## 🎯 2. Objectives

- Analyze user-provided text and identify its sentiment.
- Display analysis results through an interactive web interface.
- Process uploaded images and extract their metadata.
- Store and retrieve prediction records using MongoDB.
- Present available statistics through a dashboard.
- Develop REST API endpoints for communication between the frontend and backend.
- Demonstrate full-stack web application development using React, Flask, and MongoDB.

## ✨ 3. Key Features

### 3.1 Sentiment Analysis

Accepts user-provided text and uses VADER Sentiment Analysis to determine whether the text expresses positive, negative, or neutral sentiment.

### 3.2 Interactive Dashboard

Provides an overview of available application statistics and prediction information through dashboard components.

### 3.3 Image Processing

Supports image uploads and extracts metadata, including image format and dimensions, for supported image files.

### 3.4 Prediction History

Retrieves previously stored prediction records so users can review earlier analysis results.

### 3.5 Dashboard Statistics

Retrieves statistical information from the backend to display an overview of application activity.

### 3.6 MongoDB Integration

Uses MongoDB to store and retrieve prediction records.

### 3.7 REST API Integration

Connects the React frontend to the Flask backend through HTTP requests.

### 3.8 Record Management

Provides an API endpoint for deleting individual prediction records.

## 🛠️ 4. Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Vite | Frontend development and build tooling |
| JavaScript | Frontend application logic |
| Python | Backend programming |
| Flask | REST API development |
| Flask-CORS | Cross-origin request handling |
| MongoDB | Database management |
| PyMongo | Python integration with MongoDB |
| VADER Sentiment | Rule-based sentiment analysis |
| Pillow (PIL) | Image processing and metadata extraction |
| CSS | User interface styling |
| Git | Version control |
| GitHub | Source code hosting |

## 🏗️ 5. System Architecture

The application follows a client-server architecture.

```text
                   User
                     |
                     v
             React Frontend
                  (Vite)
                     |
                     v
              HTTP Requests
                     |
                     v
              Flask REST API
                     |
          +----------+----------+
          |          |          |
          v          v          v
     Sentiment    Image      Prediction
     Analysis    Processing    Records
          |          |          |
          +----------+----------+
                     |
                     v
                  MongoDB
                     |
                     v
              API Responses
                     |
                     v
          Dashboard and Results
```

### Architecture Components

- **Frontend:** Collects user input and displays analysis results.
- **Backend:** Processes API requests and coordinates application functionality.
- **Sentiment Analysis:** Analyzes text using VADER.
- **Image Processing:** Validates supported image files and extracts metadata.
- **Database:** Stores and retrieves prediction records through MongoDB.
- **REST API:** Facilitates communication between the frontend and backend.

## 🔄 6. Application Workflow

1. The user opens the web application dashboard.
2. The frontend communicates with the Flask backend through API requests.
3. The user submits text for sentiment analysis.
4. The backend processes the text using VADER and returns the sentiment result.
5. The user can upload a supported image for metadata processing.
6. The backend stores and retrieves prediction records through MongoDB according to the implemented application logic.
7. The dashboard displays available statistics and results.
8. The user can review previous records through the History page.

## 📂 7. Project Structure

```text
fullstack-ai-web-app/
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   └── StatCard.jsx
│       │
│       ├── pages/
│       │   ├── Overview.jsx
│       │   ├── Sentiment.jsx
│       │   ├── Images.jsx
│       │   └── History.jsx
│       │
│       ├── services/
│       │   └── api.js
│       │
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
│
├── backend/
│   ├── routes/
│   │   ├── __init__.py
│   │   └── api.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── sentiment.py
│   │   └── image_service.py
│   │
│   ├── uploads/
│   │   └── .gitkeep
│   │
│   ├── app.py
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

## 🌐 8. Localhost URLs

The following URLs are used to access the application locally while the corresponding services are running.

| Service | URL |
|---|---|
| Frontend Application | http://localhost:5173 |
| Backend Server | http://127.0.0.1:5000 |
| Backend Root Endpoint | http://127.0.0.1:5000/ |
| Backend Health Check | http://127.0.0.1:5000/api/health |

**Note:** The frontend uses Vite's default development port, `5173`, and the Flask backend uses port `5000` in the current configuration. These addresses refer to services running on your own computer.

## 🔌 9. REST API Endpoints

The backend exposes the following documented API endpoints.

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Checks the backend root endpoint |
| GET | `/api/health` | Checks backend health |
| POST | `/api/sentiment` | Processes text sentiment analysis |
| GET | `/api/predictions` | Retrieves prediction history |
| DELETE | `/api/predictions/<record_id>` | Deletes a prediction record |
| GET | `/api/stats` | Retrieves dashboard statistics |
| POST | `/api/classify` | Handles a classification request |

The frontend uses these endpoints to communicate with the backend. Request formats and responses depend on the corresponding API implementation.

## 📊 10. Dashboard Pages

### Overview

Displays an overview of application statistics and available prediction information.

### Sentiment Analysis

Allows users to submit text and view the sentiment classification generated by the backend.

### Image Processing

Allows users to upload supported images and view extracted image metadata.

### History

Provides access to previously stored prediction records and supports record management through the backend API.

## 🧪 11. Testing

The application can be tested through its web interface and backend API endpoints.

| Test Area | Expected Outcome |
|---|---|
| Backend health check | Backend returns a health response |
| Sentiment analysis | Sentiment result is returned |
| Image processing | Supported image metadata is extracted |
| Prediction history | Stored records are retrieved |
| Dashboard statistics | Available statistics are returned |
| Record deletion | Selected record is deleted when the request succeeds |
| Frontend connectivity | Frontend communicates with the backend |
| Database integration | Prediction records are stored and retrieved as implemented |

Actual test results should be recorded after executing each test successfully.

## 🔒 12. Security Considerations

- Keep database credentials and secret configuration values out of public repositories.
- Use environment variables for sensitive configuration.
- Validate uploaded files before processing.
- Configure CORS for the intended frontend origin.
- Avoid exposing sensitive information in API responses.
- Apply suitable access controls before deploying the application for public use.

## ⚠️ 13. Limitations

- Sentiment classification depends on VADER's rule-based analysis and configured thresholds.
- Sarcasm, ambiguous expressions, and context-dependent language may affect sentiment results.
- Image processing extracts metadata and does not, by itself, establish that image recognition or object classification is implemented.
- Dashboard statistics depend on the records available in the database.
- Application functionality depends on the frontend, backend, and database services being available.

## 🚀 14. Future Enhancements

Potential improvements include:

- Additional sentiment analytics and visualizations.
- Date-based filtering for prediction history.
- Bulk text analysis.
- Expanded image analysis capabilities.
- Improved automated API and frontend testing.
- User authentication and authorization.
- Downloadable reports.
- Cloud deployment and production monitoring.

## 🎓 15. Learning Outcomes

This project demonstrates practical experience with:

- Full-stack web application development.
- React component development.
- REST API development using Flask.
- Frontend-backend integration.
- MongoDB database operations.
- Rule-based sentiment analysis.
- Image processing using Pillow.
- API testing and debugging.
- Version control using Git and GitHub.

## 🏁 16. Conclusion

The Full-Stack AI Web App integrates React.js, Flask, MongoDB, VADER Sentiment Analysis, and image metadata processing into a single web application.

It provides a user-friendly interface for analyzing text sentiment, processing supported images, viewing dashboard statistics, and reviewing prediction history. The project demonstrates how frontend components, backend services, and database operations work together in a full-stack application.

## 👨‍💻 17. Project Information

| Item | Details |
|---|---|
| Project Name | Full-Stack AI Web App |
| Application Type | Full-Stack Web Application |
| Frontend | React.js and Vite |
| Backend | Python and Flask |
| Database | MongoDB |
| Sentiment Analysis | VADER Sentiment |
| Image Processing | Pillow (PIL) |
| API Communication | HTTP REST API |
| Version Control | Git |
| Repository |https://github.com/sreenivasshankarbulagondla3969/fullstack-ai-web-app |

