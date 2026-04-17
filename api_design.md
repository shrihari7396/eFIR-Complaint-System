# eFIR Complaint System API Design

This document details the complete REST API specification for the eFIR backend system based on current Spring Boot controllers and DTOs.

## Base Configuration
- All endpoints prefixed with the base server URL (e.g., `http://localhost:8080`).
- Secured endpoints require a JWT token passed in the `Authorization` header as `Bearer <token>`. Do not prepend `Bearer` if passing the token as a query parameter (where supported).

---

## 1. Authentication & User Management (`UserController`)
All user onboarding, authentication, and profile retrieval are handled here.

### 1.1 Citizen Registration
- **URL**: `/user/register`
- **Method**: `POST`
- **Description**: Registers a new citizen or police user in the system.
- **Request Body** (`application/json`):
```json
{
  "username": "johndoe",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "aadharNumber": "123456789012",
  "email": "johndoe@example.com",
  "role": "CITIZEN",
  "verified": false,
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zip": "400001",
    "country": "India"
  }
}
```
- **Response** (`200 OK`, `application/json`): Returns a `UserResponse` object detailing the user.

### 1.2 Citizen Login
- **URL**: `/user/login`
- **Method**: `POST`
- **Description**: Authenticates a citizen user and returns a JWT token.
- **Request Body** (`application/json`):
```json
{
  "username": "johndoe",
  "password": "securepassword"
}
```
- **Response** (`200 OK`, `text/plain`): Returns the JWT string directly.

### 1.3 Police Login
- **URL**: `/user/login/police`
- **Method**: `POST`
- **Description**: Authenticates a police user and returns a JWT token.
- **Request Body** (`application/json`): Same as Citizen Login.
- **Response** (`200 OK`, `text/plain`): Returns the JWT string directly.

### 1.4 Send OTP
- **URL**: `/user/sendOtp` (also maps to `/user/sendotp`)
- **Method**: `POST`
- **Description**: Generates an OTP and sends it to the specified email if the user exists.
- **Query Parameter**: `email` (e.g., `?email=johndoe@example.com`)
- **Response** (`200 OK`, `text/plain`): `"OTP sent successfully"` 

### 1.5 Verify OTP
- **URL**: `/user/verifyOtp`
- **Method**: `POST`
- **Description**: Validates the OTP for a user and issues a JWT token.
- **Query Parameters**: `email`, `otp`
- **Response** (`200 OK`, `text/plain`): Returns the JWT string.

### 1.6 Fetch User Profile
- **URL**: `/user/get`
- **Method**: `GET`
- **Security**: Requires JWT in `Authorization` header OR via `token` query parameter.
- **Description**: Fetches the profile data of the currently logged-in user.
- **Response** (`200 OK`, `application/json`):
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "johndoe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "aadharNumber": "123456789012",
  "role": "CITIZEN",
  "verified": true,
  "street": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zip": "400001",
  "country": "India"
}
```

---

## 2. Complaint Management (`ComplaintController`)
Allows citizens to file and check the status of their complaints.

### 2.1 File a Complaint
- **URL**: `/complaint/save`
- **Method**: `POST`
- **Security**: Requires JWT.
- **Description**: Submits a new FIR/complaint as the authenticated citizen.
- **Request Body** (`application/json`):
```json
{
  "evidenceLink": "https://link.to.image.or.pdf",
  "victim": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "9876543210",
    "address": { "street": "...", "city": "...", "state": "...", "zip": "...", "country": "..." }
  },
  "accused": {
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "1234567890",
    "address": { ... }
  },
  "incidence": {
    "date": "2026-04-12",
    "time": "14:30",
    "description": "Bag stolen at the station.",
    "crimeType": "THEFT",
    "address": { ... }
  }
}
```
- **Response** (`200 OK`, `application/json`):
```json
{
  "id": 101,
  "userId": 1,
  "status": "PENDING",
  "evidenceLink": "...",
  "victim": { ... },
  "accused": { ... },
  "incidence": { ... },
  "createdAt": "2026-04-12T14:35:00Z"
}
```

### 2.2 Fetch User Complaints
- **URL**: `/complaint/fetch`
- **Method**: `GET`
- **Security**: Requires JWT.
- **Description**: Retrieves a list of all complaints made by the logged-in user.
- **Response** (`200 OK`, `application/json`): Returns `List<ComplaintResponse>`, an array of ComplaintResponse objects.

---

## 3. Police Operations (`PoliceController`)
Exclusive endpoints for the police officers to view all records and update verdicts.

### 3.1 Get All Complaints (Paginated)
- **URL**: `/api/police/complaints`
- **Method**: `GET`
- **Security**: Requires JWT (Must have `POLICE` role).
- **Query Parameters**: 
  - `pageNumber` (optional, default = `0`)
  - `size` (optional, default = `10`)
- **Response** (`200 OK`, `application/json`): Returns a `PagedComplaintsResponse` containing a paginated list of complaints.

### 3.2 Update Complaint Verdict
- **URL**: `/api/police/update`
- **Method**: `POST`
- **Security**: Requires JWT (Must have `POLICE` role).
- **Description**: Update the status or verdict of a given complaint ID.
- **Query Parameters**: 
  - `id` (Complaint ID, e.g., `101`)
  - `verdict` (e.g., `RESOLVED`, `REJECTED`, `IN_PROGRESS`)
- **Response** (`200 OK`, `text/plain`): `"Verdict updated successfully"`

---

## 4. AI Assistant (`AiController`)
Integration with Groq for AI-powered legal advice or query resolution.

### 4.1 Chat with AI
- **URL**: `/ai/api/groq`
- **Method**: `POST`
- **Description**: Query the AI model.
- **Request Body** (`application/json`):
```json
{
  "content": "What is the procedure to file an FIR for a stolen phone?"
}
```
- **Response** (`200 OK`, `text/plain`): The AI's response text.

