# Multi DB(Mongo/Mysql) User API creation with multi ID type Validator


This Project Is a Functional NodeJs API BoilerPlate which you can choose to use either MongoDB or Mysql in your project. Where the User(Model) can have any necessary UniqueID such as Passport, CPF(Brazilian ID) SSN (US ID), etc. And you just have to pick the specific id you want, modify the User Model and call the Validator class to properly validate the ID Field 
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
HOST=localhost
HTTPS_ENABLED=false
HTTPS_KEY_PATH=/path/to/your/private.key #if https enabled
HTTPS_CERT_PATH=/path/to/your/certificate.crt


UPLOAD_DIR=public/uploads #To where the image files will be uploaded
STATIC_FILE_DIR=public # Directory for serving static files (defaults to 'public' if not set)

MODELS_PATH=./src/models #models required by the DB

# Database configuration
DB_TYPE=mongo # or mysql
MONGO_DB_CONNECTION_STRING=mongodb://localhost:27017/test # For MongoDB
DB_NAME=your_db_name # For MySQL
DB_USER=your_db_user # For MySQL
DB_PASSWORD=your_db_password # For MySQL
DB_HOST=localhost
DB_PORT=3306


# Security Configuration
CSRF_COOKIE_NAME=csrf-token
CSRF_COOKIE_SAMESITE=strict

TYPEAUTH=JWS #or session

# Session Configuration
SESSION_SECRET=your-secret-key
SESSION_COOKIE_MAX_AGE=2678400000
SESSION_COOKIE_SECURE=true

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100


# Swagger Configuration
SWAGGER_ENABLED=true
SWAGGER_ROUTE=/api-docs


# Frontend URL allowed for CORS
FRONTEND_URL=http://localhost:8080
``` 



# API Endpoints Documentation

This document provides an overview of the API endpoints and their functionalities.


This API is documented with swagger which you could access trough the endpoint /api-docs example: http://localhost:8765/api-docs/
nevertheless the API endpoints will also have a less detailed documentation in the readme which you can access below:

## Validator Endpoints

In case you wish to use the multi ID Validator as an API you can just use it in the following endpoints below, or import the Validator class from /src/utils/IDValidator.js 

### 1. Validate User Fields
- **Endpoint**: `GET /validator/validate-fields`
- **Description**: Validates user fields such as `username`, `name`, `surname`, `email`, `password`, and `role`.
- **Request Body**:
  - `username`: (string) The username of the user.
  - `name`: (string) The name of the user.
  - `surname`: (string) The surname of the user.
  - `email`: (string) The email of the user.
  - `password`: (string) The password of the user.
  - `role`: (string) The role of the user.
- **Response**:
  - `200`: `{ message: "All fields are valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 2. Validate Passport
- **Endpoint**: `GET /validator/validate-passport/:passportNumber?/:countryCode?`
- **Description**: Validates a passport number and country code.
- **Request Params**:
  - `passportNumber`: (string) The passport number.
  - `countryCode`: (string) The country code.
- **Response**:
  - `200`: `{ message: "Passport is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 3. Validate CPF
- **Endpoint**: `GET /validator/validate-cpf/:cpfNumber?`
- **Description**: Validates a CPF (Brazilian individual taxpayer registry) number.
- **Request Params**:
  - `cpfNumber`: (string) The CPF number.
- **Response**:
  - `200`: `{ message: "CPF is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 4. Validate RG
- **Endpoint**: `GET /validator/validate-rg/:rgNumber?`
- **Description**: Validates an RG (Brazilian identity card) number.
- **Request Params**:
  - `rgNumber`: (string) The RG number.
- **Response**:
  - `200`: `{ message: "RG is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 5. Validate SUS
- **Endpoint**: `GET /validator/validate-sus/:susNumber?`
- **Description**: Validates a SUS (Brazilian public health system) number.
- **Request Params**:
  - `susNumber`: (string) The SUS number.
- **Response**:
  - `200`: `{ message: "SUS number is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 6. Validate CNH
- **Endpoint**: `GET /validator/validate-cnh/:cnhNumber?`
- **Description**: Validates a CNH (Brazilian driver's license) number.
- **Request Params**:
  - `cnhNumber`: (string) The CNH number.
- **Response**:
  - `200`: `{ message: "CNH is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 7. Validate CTPS
- **Endpoint**: `GET /validator/validate-ctps/:ctpsNumber?`
- **Description**: Validates a CTPS (Brazilian work card) number.
- **Request Params**:
  - `ctpsNumber`: (string) The CTPS number.
- **Response**:
  - `200`: `{ message: "CTPS is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 8. Validate CRM
- **Endpoint**: `GET /validator/validate-crm/:crmNumber?`
- **Description**: Validates a CRM (Brazilian medical council registration) number.
- **Request Params**:
  - `crmNumber`: (string) The CRM number.
- **Response**:
  - `200`: `{ message: "CRM is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 9. Validate OAB
- **Endpoint**: `GET /validator/validate-oab/:oabNumber?`
- **Description**: Validates an OAB (Brazilian bar association) number.
- **Request Params**:
  - `oabNumber`: (string) The OAB number.
- **Response**:
  - `200`: `{ message: "OAB is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 10. Validate CREA
- **Endpoint**: `GET /validator/validate-crea/:creaNumber?`
- **Description**: Validates a CREA (Brazilian engineering council registration) number.
- **Request Params**:
  - `creaNumber`: (string) The CREA number.
- **Response**:
  - `200`: `{ message: "CREA is valid." }`
  - `400`: `{ error: "<error message>" }`


### 11. Validate US Driver's License
- **Endpoint**: `GET /validator/validate-us-license/:licenseNumber?`
- **Description**: Validates a US Driver's License number (General Format - state-specific checks recommended).
- **Request Params**:
  - `licenseNumber`: (string) The US Driver's License number.
- **Response**:
  - `200`: `{ message: "US Driver's License is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 12. Validate US Social Security Number (SSN)
- **Endpoint**: `GET /validator/validate-us-ssn/:ssn?`
- **Description**: Validates a US Social Security Number (SSN).
- **Request Params**:
  - `ssn`: (string) The SSN in the format XXX-XX-XXXX.
- **Response**:
  - `200`: `{ message: "SSN is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 13. Validate US Military ID (CAC)
- **Endpoint**: `GET /validator/validate-us-military-id/:militaryID?`
- **Description**: Validates a US Military ID (CAC).
- **Request Params**:
  - `militaryID`: (string) The US Military ID.
- **Response**:
  - `200`: `{ message: "US Military ID is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 14. Validate US Green Card
- **Endpoint**: `GET /validator/validate-us-green-card/:greenCardNumber?`
- **Description**: Validates a US Permanent Resident Card (Green Card) number.
- **Request Params**:
  - `greenCardNumber`: (string) The Green Card number.
- **Response**:
  - `200`: `{ message: "US Green Card is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 15. Validate US Employment Authorization Document (EAD)
- **Endpoint**: `GET /validator/validate-us-ead/:eadNumber?`
- **Description**: Validates a US Employment Authorization Document (EAD).
- **Request Params**:
  - `eadNumber`: (string) The EAD number.
- **Response**:
  - `200`: `{ message: "US Employment Authorization Document is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 16. Validate US Birth Certificate
- **Endpoint**: `GET /validator/validate-us-birth-certificate/:birthCertNumber?`
- **Description**: Validates a US Birth Certificate number.
- **Request Params**:
  - `birthCertNumber`: (string) The US Birth Certificate number.
- **Response**:
  - `200`: `{ message: "US Birth Certificate is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 17. Validate US Medicare/Medicaid Card
- **Endpoint**: `GET /validator/validate-us-medicare-medicaid/:medicareNumber?`
- **Description**: Validates a US Medicare/Medicaid card number using the MBI format.
- **Request Params**:
  - `medicareNumber`: (string) The Medicare/Medicaid card number.
- **Response**:
  - `200`: `{ message: "US Medicare/Medicaid Card is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 18. Validate US Veteran ID Card (VIC)
- **Endpoint**: `GET /validator/validate-us-veteran-id/:vicNumber?`
- **Description**: Validates a US Veteran ID Card (VIC) number.
- **Request Params**:
  - `vicNumber`: (string) The Veteran ID number.
- **Response**:
  - `200`: `{ message: "US Veteran ID is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 19. Validate UK Driving Licence
- **Endpoint**: `GET /validator/validate-uk-driving-licence/:licenceNumber?`
- **Description**: Validates a UK Driving Licence number using the DVLA format.
- **Request Params**:
  - `licenceNumber`: (string) The UK Driving Licence number.
- **Response**:
  - `200`: `{ message: "UK Driving Licence is valid." }`
  - `400`: `{ error: "<error message>" }`

---


### 20. Validate UK Birth Certificate
- **Endpoint**: `GET /validator/validate-uk-birth-certificate/:birthCertNumber?`
- **Description**: Validates a UK Birth Certificate number.
- **Request Params**:
  - `birthCertNumber`: (string) The UK Birth Certificate number.
- **Response**:
  - `200`: `{ message: "UK Birth Certificate is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 21. Validate UK Armed Forces ID
- **Endpoint**: `GET /validator/validate-uk-armed-forces-id/:armedForcesID?`
- **Description**: Validates a UK Armed Forces ID number.
- **Request Params**:
  - `armedForcesID`: (string) The Armed Forces ID.
- **Response**:
  - `200`: `{ message: "UK Armed Forces ID is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 23. Validate UK National Insurance Number
- **Endpoint**: `GET /validator/validate-uk-ni/:niNumber?`
- **Description**: Validates a UK National Insurance Number (NI Number).
- **Request Params**:
  - `niNumber`: (string) The National Insurance number.
- **Response**:
  - `200`: `{ message: "UK NI Number is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 24. Validate UK Residence Card
- **Endpoint**: `GET /validator/validate-uk-residence-card/:residenceCardNumber?`
- **Description**: Validates a UK Biometric Residence Permit (BRP) number.
- **Request Params**:
  - `residenceCardNumber`: (string) The residence card number.
- **Response**:
  - `200`: `{ message: "UK Residence Card is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 25. Validate PIS/PASEP
- **Endpoint**: `GET /validate-pis-pasep/:pis?`
- **Description**: Validates a PIS/PASEP number.
- **Request Params**:
  - `pis`: (string) The PIS/PASEP number.
- **Response**:
  - `200`: `{ message: "PIS-PASEP is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 26. Validate CNPJ
- **Endpoint**: `GET /validate-cnpj/:cnpj?`
- **Description**: Validates a CNPJ number.
- **Request Params**:
  - `cnpj`: (string) The CNPJ number.
- **Response**:
  - `200`: `{ message: "CNPJ is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 26. Validate CA SIN
- **Endpoint**: `GET /validate-ca-sin/:sinNumber?`
- **Description**: Validates a Canadian Social Insurance Numbers (SIN).
- **Request Params**:
  - `cnpj`: (string) The CA SIN number.
- **Response**:
  - `200`: `{ message: "Canadian SIN is valid." }`
  - `400`: `{ error: "<error message>" }`

---

### 27. Validate South Korean RRN
- **Endpoint**: `GET /validate-kr-rrn/:rrnNumber?`
- **Description**: Validates a South Korean Resident Registration Number (RRN).
- **Request Params**:
  - `rrnNumber`: (string) The South Korean RRN number.
- **Response**:
  - `200`: `{ message: "South Korean RRN is valid." }`
  - `400`: `{ error: "<error message>" }`

---


### 28. Validate German Personalausweis
- **Endpoint**: `GET /validate-de-personalausweis/:idNumber?`
- **Description**: Validates a German Personalausweis (ID) number.
- **Request Params**:
  - `idNumber`: (string) The German Personalausweis number (must be exactly 10 digits).
- **Response**:
  - `200`: `{ message: "German Personalausweis is valid." }`
  - `400`: `{ error: "<error message>" }`

---

## Main Router Endpoints

---

### 1. Health Check
- **Endpoint**: `GET /health`
- **Description**: Checks the health of the API.
- **Response**:
  - `200`: API is healthy.

---

### 2. Serve Static Files
- **Endpoint**: `GET /uploads/*`
- **Description**: Serves static files from the `public/uploads` directory.
- **Response**:
  - `200`: File content.

---

### 3. Error Handling
- **Description**: Handles file upload errors.
- **Response**:
  - `400`: Multer-specific errors.



## User Endpoints

## 1. Create User
- **Endpoint**: `POST /user/create/`
- **Description**: Creates a new user with optional profile picture upload.
- **Request Body**:
  - `username`: (string) The username of the user.
  - `name`: (string) The name of the user.
  - `surname`: (string) The surname of the user.
  - `email`: (string) The email of the user.
  - `password`: (string) The password of the user.
  - `bio`: (string, optional) A short bio of the user.
  - `birthDate`: (string, optional) The birth date of the user.
  - `role`: (string, optional) The role of the user (default: `User`).
  - `profilePicture`: (file, optional) The user's profile picture.
- **Response**:
  - `201`: User created successfully. Returns the user object with the profile picture URL.
  - `400`: Invalid data or validation error.
  - `409`: Email or username already exists.

---

## 2. Get All Users
- **Endpoint**: `GET /user/get/`
- **Description**: Retrieves a list of all users. Passwords are excluded from the response. Requires admin privileges
- **Response**:
  - `200`: Returns a list of users with profile picture URLs.
  - `404`: No users found.
  - `500`: Internal server error.

---

## 3. Login
- **Endpoint**: `POST /user/login/`
- **Description**: Authenticates a user and returns a token (JWT) or sets a session (session-based authentication).
- **Request Body**:
  - `email`: (string) The email of the user.
  - `password`: (string) The password of the user.
- **Response**:
  - `200`: Login successful. Returns a token (JWT) or a success message (session-based).
  - `401`: Invalid email or password.
  - `403`: Account is deactivated.
  - `500`: Internal server error.

---

## 4. Logout
- **Endpoint**: `GET /user/logout/`
- **Description**: Logs out the user. For session-based authentication, it destroys the session. For JWT, it simply returns a success message.
- **Response**:
  - `200`: Logout successful.
  - `500`: Internal server error.

---


## 5. Get Active Users
- **Endpoint**: `GET /user/getActive/`
- **Description**: Retrieves a list of all active users. Requires admin privileges.
- **Response**:
  - `200`: Returns a list of active users with profile picture URLs.
  - `404`: No active users found.
  - `500`: Internal server error.

---

## 6. Get Inactive Users
- **Endpoint**: `GET /user/getInactive/`
- **Description**: Retrieves a list of all inactive users. Requires admin privileges.
- **Response**:
  - `200`: Returns a list of inactive users with profile picture URLs.
  - `404`: No inactive users found.
  - `500`: Internal server error.

---

## 7. Get User by ID (Self)
- **Endpoint**: `GET /user/self/:id?`
- **Description**: Retrieves the details of the currently logged-in user or a user by ID.
- **Request Params**:
  - `id`: (string, optional) The user ID. If not provided, the logged-in user's details are returned.
- **Response**:
  - `200`: Returns the user details with the profile picture URL.
  - `404`: User not found.
  - `500`: Internal server error.

---

## 8. Update User
- **Endpoint**: `PUT /user/update/:id?`
- **Description**: Updates user details, including an optional profile picture. Admins can update any user, while regular users can only update their own details.
- **Request Params**:
  - `id`: (string, optional) The user ID. If not provided, the logged-in user's details are updated.
- **Request Body**:
  - `username`: (string, optional) The updated username.
  - `name`: (string, optional) The updated name.
  - `surname`: (string, optional) The updated surname.
  - `email`: (string, optional) The updated email.
  - `password`: (string, optional) The updated password.
  - `bio`: (string, optional) The updated bio.
  - `birthDate`: (string, optional) The updated birth date.
  - `role`: (string, optional) The updated role.
  - `profilePicture`: (file, optional) The updated profile picture.
- **Response**:
  - `200`: User updated successfully. Returns the updated user object with the profile picture URL.
  - `400`: Invalid data or validation error.
  - `404`: User not found.
  - `409`: Email or username already exists.
  - `500`: Internal server error.

---

## 9. Delete User (Soft Delete)
- **Endpoint**: `DELETE /user/delete/:id?`
- **Description**: Deactivates a user by setting `isActive` to `false`. Admins can deactivate any user, while regular users can only deactivate themselves.
- **Request Params**:
  - `id`: (string, optional) The user ID. If not provided, the logged-in user is deactivated.
- **Response**:
  - `200`: User deactivated successfully.
  - `400`: User is already deactivated.
  - `404`: User not found.
  - `500`: Internal server error.

---

## 10. Reactivate User
- **Endpoint**: `PUT /user/reactivate/:id?`
- **Description**: Reactivates a deactivated user by setting `isActive` to `true`.
- **Request Params**:
  - `id`: (string, optional) The user ID. If not provided, the logged-in user is reactivated.
- **Response**:
  - `200`: User reactivated successfully.
  - `400`: User is already active.
  - `404`: User not found.
  - `500`: Internal server error.

---

## 11. Search Users
- **Endpoint**: `GET /user/search/`
- **Description**: Searches for users based on query parameters. Supports pagination, sorting, and filtering by role.
- **Query Parameters**:
  - `page`: (number, optional) The page number for pagination (default: `1`).
  - `limit`: (number, optional) The number of results per page (default: `10`, max: `100`).
  - `search`: (string, optional) A search term to filter users by name, email, or username.
  - `role`: (string, optional) Filters users by role (e.g., `User` or `Admin`).
  - `sortBy`: (string, optional) The field to sort by (default: `createdAt`).
  - `order`: (string, optional) The sort order (`asc` or `desc`, default: `desc`).
- **Response**:
  - `200`: Returns a paginated list of users with profile picture URLs.
  - `500`: Internal server error.

---
## User Addreses Endpoint

## 1. Create Address
- **Endpoint**: `POST /address/create`
- **Description**: Creates a new address for the authenticated user.
- **Authentication**: Required.
- **Request Body**:
  - `userId`: (string, required) The ID of the user associated with the address.
  - `street`: (string, required) The street name.
  - `number`: (string, required) The street number.
  - `complement`: (string, optional) Additional address details (e.g., apartment number).
  - `neighborhood`: (string, required) The neighborhood name.
  - `city`: (string, required) The city name.
  - `state`: (string, required) The state or region.
  - `zipCode`: (string, required) The postal or ZIP code.
  - `country`: (string, required) The country name.
- **Response**:
  - `201`: Returns the created address object.
  - `400`: Bad request (e.g., validation error or missing fields).
  - `500`: Internal server error.

---

## 2. Get All Addresses for Authenticated User
- **Endpoint**: `GET /address/get`
- **Description**: Retrieves all addresses associated with the authenticated user.
- **Authentication**: Required.
- **Response**:
  - `200`: Returns a list of addresses for the authenticated user.
  - `500`: Internal server error.

---

## 3. Get Address by ID
- **Endpoint**: `GET /address/get/:addressId?`
- **Description**: Retrieves a specific address by its ID. The authenticated user must be the owner of the address.
- **Authentication**: Required.
- **Path Parameters**:
  - `addressId`: (string, optional) The ID of the address to retrieve. If not provided, it can be passed in the request body.
- **Response**:
  - `200`: Returns the address object.
  - `404`: Address not found.
  - `500`: Internal server error.

---

## 4. Get Addresses by User ID
- **Endpoint**: `GET /address/get-user-addresses/:userId?`
- **Description**: Retrieves all addresses associated with a specific user ID. Admins can access any user's addresses, while regular users can only access their own.
- **Authentication**: Required.
- **Path Parameters**:
  - `userId`: (string, optional) The ID of the user whose addresses are being retrieved. If not provided, it defaults to the authenticated user's ID.
- **Response**:
  - `200`: Returns a list of addresses for the specified user.
  - `404`: No addresses found for the user.
  - `500`: Internal server error.

---

## 5. Update Address
- **Endpoint**: `PUT /address/update/:addressId?`
- **Description**: Updates an existing address by its ID. The authenticated user must be the owner of the address.
- **Authentication**: Required.
- **Path Parameters**:
  - `addressId`: (string, optional) The ID of the address to update. If not provided, it can be passed in the request body.
- **Request Body**:
  - Any of the address fields (`street`, `number`, `complement`, `neighborhood`, `city`, `state`, `zipCode`, `country`) can be updated.
- **Response**:
  - `200`: Returns the updated address object.
  - `404`: Address not found.
  - `400`: Bad request (e.g., validation error).
  - `500`: Internal server error.

---

## 6. Delete Address
- **Endpoint**: `DELETE /address/delete/:addressId?`
- **Description**: Deletes an address by its ID. The authenticated user must be the owner of the address.
- **Authentication**: Required.
- **Path Parameters**:
  - `addressId`: (string, optional) The ID of the address to delete. If not provided, it can be passed in the request body.
- **Response**:
  - `200`: Returns a success message.
  - `404`: Address not found.
  - `500`: Internal server error.

---

## 7. Set Primary Address
- **Endpoint**: `PUT /address/set-primary/:userId?/:addressId?`
- **Description**: Sets an address as the primary address for a user. The authenticated user must be the owner of the address.
- **Authentication**: Required.
- **Path Parameters**:
  - `userId`: (string, optional) The ID of the user whose primary address is being updated. If not provided, it can be passed in the request body.
  - `addressId`: (string, optional) The ID of the address to set as primary. If not provided, it can be passed in the request body.
- **Response**:
  - `200`: Returns a success message.
  - `500`: Internal server error.

---

## 8. Get Primary Address
- **Endpoint**: `GET /address/primary/:userId?`
- **Description**: Retrieves the primary address for a specific user. Admins can access any user's primary address, while regular users can only access their own.
- **Authentication**: Required.
- **Path Parameters**:
  - `userId`: (string, optional) The ID of the user whose primary address is being retrieved. If not provided, it defaults to the authenticated user's ID.
- **Response**:
  - `200`: Returns the primary address object.
  - `404`: Primary address not found.
  - `500`: Internal server error.


---

