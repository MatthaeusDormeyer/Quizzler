# Quizzler — Educational Drag-and-Drop Quiz Application

## Description

Quizzler is an interactive educational web application for learning Linux commands using drag-and-drop quizzes.  
The app consists of a React frontend and an Express + MongoDB backend, packaged together in a Docker container.

---

## Requirements

- Docker (https://www.docker.com/get-started)
- Internet connection for MongoDB Atlas access (or a local MongoDB if configured)

---

## How to Build and Run

1. Clone the repository and navigate to the project root:
   ```bash
   git clone https://github.com/MatthaeusDormeyer/Quizzler.git
   cd Quizzler
   ```

2. Build the Docker image:

   ```bash
   docker build -t quizzler .
   ```

3. Run the container (replace values with your MongoDB URI and JWT secret):

   ```bash
     docker run -p 8080:3001 \
     -e MONGO_URI="mongodb+srv://md:1234@quizcluster.epxzuwc.mongodb.net/sample_mflix?retryWrites=true&w=majority" \
     quizzler
   ```

4. Open your browser at: http://localhost:8080

## Features

- Frontend and API run on the same port (8080)
- Relative API paths for easy Docker compatibility
- JWT authentication and MongoDB result storage
- Interactive drag-and-drop quizzes with real-time feedback

## Project Structure

```bash
/index.js            # Backend server entrypoint
/Dockerfile          # Docker build instructions
/package.json        # Dependencies and scripts
/src                 # React frontend source code
/models            # Mongoose models
/components        # React components
/pages             # React pages
/dist                # Built frontend (output of npm run build)
```
