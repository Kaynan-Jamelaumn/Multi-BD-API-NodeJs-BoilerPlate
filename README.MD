# Node.js Application

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB or MySQL database setup

## Installation

1. Clone this repository:
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2. Install dependencies:
    ```bash
    npm install
    ```
3. run application

    ```bash
    npm start 
     ```
## Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
# Application environment
NODE_ENV=development # or production

# Server configuration
PORT=3000
UPLOAD_DIR=public/uploads #To where the image files will be uploaded

#MODELS_PATH='./src/models' #models required by the DB

# Database configuration
DB_TYPE=mongo # or mysql
MONGO_DB_CONNECTION_STRING=mongodb://localhost:27017/test # For MongoDB
DB_NAME=your_db_name # For MySQL
DB_USER=your_db_user # For MySQL
DB_PASSWORD=your_db_password # For MySQL
DB_HOST=localhost
DB_PORT=3306

#TYPEAUTH=JWS #or session

# Session secret
SESSION_SECRET=your_session_secret

# Frontend URL for CORS
FRONTEND_URL=http://localhost:8080

