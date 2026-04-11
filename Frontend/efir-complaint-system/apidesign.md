# eFIR Complaint System — API Design Document

> **Base URL**: `http://localhost:8085` (configurable via `VITE_API_BASE_URL` env variable)
>
> **Authentication**: JWT Bearer token passed in `Authorization` header for protected endpoints.
> All sensitive fields (names, phone, aadhar, addresses, descriptions) are **AES-256 ECB encrypted** before transmission and stored encrypted in the database. The frontend encrypts before sending and decrypts after receiving.

---

## Table of Contents

| # | Endpoint | Method | Auth | Category |
|---|----------|--------|------|----------|
| 1 | `/user/register` | POST | ❌ | User Auth |
| 2 | `/user/login` | POST | ❌ | User Auth |
| 3 | `/user/login/police` | POST | ❌ | User Auth |
| 4 | `/user/sendOtp` | POST | ❌ | User Auth |
| 5 | `/user/sendotp` | POST | ❌ | User Auth |
| 6 | `/user/verifyOtp` | POST | ❌ | User Auth |
| 7 | `/user/get` | GET | ✅ | User Profile |
| 8 | `/complaint/save` | POST | ✅ | Complaints |
| 9 | `/complaint/fetch` | GET | ✅ | Complaints |
| 10 | `/api/police/complaints` | GET | ✅ | Police |
| 11 | `/api/police/update` | POST | ✅ | Police |
| 12 | `/ai/api/groq` | POST | ❌ | AI Chat |

---

## Shared Data Models

### `Address`
```json
{
  "street":  "string (AES encrypted)",
  "city":    "string (AES encrypted)",
  "state":   "string (AES encrypted)",
  "zip":     "string (AES encrypted)",
  "country": "string (AES encrypted)"
}
```

### `Person` (victim / accused)
```json
{
  "firstName": "string (AES encrypted)",
  "lastName":  "string (AES encrypted)",
  "phone":     "string (AES encrypted)",
  "address":   "Address"
}
```

### `Incidence`
```json
{
  "date":        "string (YYYY-MM-DD, plaintext)",
  "time":        "string (HH:mm, plaintext)",
  "description": "string (AES encrypted)",
  "crimetype":   "string (AES encrypted — may be JSON array serialized as string)",
  "address":     "Address"
}
```

### `Complaint`
```json
{
  "id":           "number (server-generated)",
  "victim":       "Person",
  "accused":      "Person",
  "incidence":    "Incidence",
  "evidenceLink": "string | null (plaintext URL)",
  "status":       "string (enum: PROCESSING | SUCCEEDED | REJECTED)"
}
```

### `User`
```json
{
  "id":           "number (server-generated)",
  "username":     "string (plaintext)",
  "email":        "string (plaintext)",
  "firstName":    "string (AES encrypted)",
  "lastName":     "string (AES encrypted)",
  "aadharNumber": "string (AES encrypted)",
  "address":      "Address",
  "role":         "string (enum: USER | POLICE)",
  "verified":     "boolean"
}
```

---

## API Endpoints — Detailed

---

### 1. `POST /user/register`

**Description**: Register a new citizen user account.

**Auth Required**: ❌ No

**Called From**: `Register.jsx`

**Request**:
- **Content-Type**: `application/json`
- **Body**:
```json
{
  "username":     "string (plaintext)",
  "password":     "string (plaintext)",
  "firstName":    "string (AES encrypted)",
  "lastName":     "string (AES encrypted)",
  "aadharNumber": "string (AES encrypted)",
  "email":        "string (plaintext)",
  "address": {
    "street":  "string (AES encrypted)",
    "city":    "string (AES encrypted)",
    "state":   "string (AES encrypted)",
    "zip":     "string (AES encrypted)",
    "country": "string (AES encrypted)"
  },
  "role":     "USER",
  "verified": false
}
```

**Response**:
| Status | Body | Description |
|--------|------|-------------|
| `200 OK` | `User` object (JSON) | Registration successful |
| `208 Already Reported` | `string` or error object | User already exists |
| `400 Bad Request` | `{ "message": "string" }` or `{ "error": "string" }` | Validation error |

**Encryption Note**: `firstName`, `lastName`, `aadharNumber`, and all address fields are AES-encrypted by the frontend before sending. `username`, `email`, `password` are sent in plaintext.

---

### 2. `POST /user/login`

**Description**: Citizen credential-based login.

**Auth Required**: ❌ No

**Called From**: `Login.jsx`

**Request**:
- **Content-Type**: `application/json`
- **Body**:
```json
{
  "username": "string",
  "password": "string",
  "verified": true,
  "role":     "USER"
}
```

**Response**:
| Status | Body | Description |
|--------|------|-------------|
| `200 OK` | `string` (JWT token, plain text — NOT JSON) | Login successful |
| `401 Unauthorized` | — | Invalid credentials |

**Important**: Response body is a **raw string** JWT token, not wrapped in JSON. Use `response.text()` not `response.json()`.

---

### 3. `POST /user/login/police`

**Description**: Police officer credential-based login.

**Auth Required**: ❌ No

**Called From**: `PoliceLogin.jsx`

**Request**:
- **Content-Type**: `application/json`
- **Body**:
```json
{
  "username": "string",
  "password": "string",
  "verified": true,
  "role":     "POLICE"
}
```

**Response**:
| Status | Body | Description |
|--------|------|-------------|
| `200 OK` | `string` (JWT token) | Login successful |
| `401 Unauthorized` | — | Invalid credentials |

**Note**: Same response format as citizen login — raw JWT string.

---

### 4. `POST /user/sendOtp`

**Description**: Send OTP to user's email for passwordless login (from Login page).

**Auth Required**: ❌ No

**Called From**: `Login.jsx`

**Request**:
- **Content-Type**: `application/json`
- **Query Parameters**:
  - `email` (string, required, URL-encoded) — user's registered email
- **Body**: Empty

```
POST /user/sendOtp?email=user@example.com
```

**Response**:
| Status | Body | Description |
|--------|------|-------------|
| `200 OK` | — | OTP sent successfully |
| `405 Method Not Allowed` | — | User not registered |

---

### 5. `POST /user/sendotp`

**Description**: Send OTP to user's email for account verification (from Verification page).

**Auth Required**: ❌ No

**Called From**: `Verification.jsx`

**Request**:
- **Content-Type**: `application/json`
- **Query Parameters**:
  - `email` (string, required) — user's email
- **Body**: Empty

```
POST /user/sendotp?email=user@example.com
```

**Response**:
| Status | Body | Description |
|--------|------|-------------|
| `200 OK` | — | OTP sent successfully |
| `405 Method Not Allowed` | — | User not registered |

> **Note**: This is likely the same backend endpoint as #4 — the frontend uses two different casing patterns (`sendOtp` vs `sendotp`). The backend should handle both or be case-insensitive.

---

### 6. `POST /user/verifyOtp`

**Description**: Verify OTP and receive JWT token.

**Auth Required**: ❌ No

**Called From**: `Login.jsx`, `Verification.jsx`

**Request**:
- **Content-Type**: `application/json`
- **Query Parameters**:
  - `email` (string, required, URL-encoded) — user's email
  - `otp` (string, required, URL-encoded) — 6-digit OTP code
- **Body**: Empty

```
POST /user/verifyOtp?email=user@example.com&otp=123456
```

**Response**:
| Status | Body | Description |
|--------|------|-------------|
| `200 OK` | `string` (JWT token, plain text) | OTP valid, JWT returned |
| `401 Unauthorized` / other | — | Invalid OTP |

---

### 7. `GET /user/get`

**Description**: Fetch authenticated user's profile details by JWT token.

**Auth Required**: ✅ Yes (JWT via query param AND Authorization header)

**Called From**: `AuthContext.jsx` (login function)

**Request**:
- **Query Parameters**:
  - `token` (string, required) — JWT token
  
```
GET /user/get?token=eyJhbGciOi...
```

**Response**:
| Status | Body | Description |
|--------|------|-------------|
| `200 OK` | `User` object (JSON, AES-encrypted fields) | User found |
| `400 Bad Request` | — | Invalid token / user not found |

**Response Body** (example):
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "firstName": "U2FsdGVkX1...",        // AES encrypted
  "lastName": "U2FsdGVkX1...",         // AES encrypted
  "aadharNumber": "U2FsdGVkX1...",     // AES encrypted
  "address": {
    "street": "U2FsdGVkX1...",         // AES encrypted
    "city": "U2FsdGVkX1...",           // AES encrypted
    "state": "U2FsdGVkX1...",          // AES encrypted
    "zip": "U2FsdGVkX1...",            // AES encrypted
    "country": "U2FsdGVkX1..."         // AES encrypted
  },
  "role": "USER",
  "verified": true
}
```

**Decryption**: The frontend decrypts `firstName`, `lastName`, `aadharNumber`, and all address fields using `decryptuser()` from `DecryptionHelper.js`.

---

### 8. `POST /complaint/save`

**Description**: Submit a new FIR complaint. All sensitive fields are AES-encrypted before sending.

**Auth Required**: ✅ Yes (JWT Bearer)

**Called From**: `ComplaintSubmission.jsx`

**Request**:
- **Content-Type**: `application/json`
- **Authorization**: `Bearer <JWT>`
- **Body**: Fully AES-encrypted `Complaint` payload:
```json
{
  "victim": {
    "firstName": "string (AES encrypted)",
    "lastName":  "string (AES encrypted)",
    "phone":     "string (AES encrypted)",
    "address": {
      "street":  "string (AES encrypted)",
      "city":    "string (AES encrypted)",
      "state":   "string (AES encrypted)",
      "zip":     "string (AES encrypted)",
      "country": "string (AES encrypted)"
    }
  },
  "accused": {
    "firstName": "string (AES encrypted)",
    "lastName":  "string (AES encrypted)",
    "phone":     "string (AES encrypted)",
    "address": {
      "street":  "string (AES encrypted)",
      "city":    "string (AES encrypted)",
      "state":   "string (AES encrypted)",
      "zip":     "string (AES encrypted)",
      "country": "string (AES encrypted)"
    }
  },
  "incidence": {
    "date":        "string (plaintext)",
    "time":        "string (plaintext)",
    "description": "string (AES encrypted)",
    "address": {
      "street":  "string (AES encrypted)",
      "city":    "string (AES encrypted)",
      "state":   "string (AES encrypted)",
      "zip":     "string (AES encrypted)",
      "country": "string (AES encrypted)"
    }
  },
  "evidenceLink": "string | null (plaintext URL)"
}
```

**Response**:
| Status | Body | Description |
|--------|------|-------------|
| `200 OK` | `Complaint` object (JSON) or success message | Complaint saved |
| `400 Bad Request` | `{ "message": "string" }` | Validation error |
| `401 Unauthorized` | — | Token expired / invalid |

**Encryption Details**:
- The frontend calls `encryptComplaint()` from `DecryptionHelper.js` before posting
- Fields encrypted: victim (firstName, lastName, phone, address.*), accused (same), incidence (description, address.*)
- Fields NOT encrypted: `incidence.date`, `incidence.time`, `evidenceLink`

---

### 9. `GET /complaint/fetch`

**Description**: Fetch all complaints for the authenticated citizen user.

**Auth Required**: ✅ Yes (JWT Bearer)

**Called From**: `session.js` → `fetchActiveComplaints()`

**Request**:
```
GET /complaint/fetch
Authorization: Bearer <JWT>
```

**Response**:
| Status | Body | Description |
|--------|------|-------------|
| `200 OK` | `Complaint[]` (JSON array) or `{ complaints: Complaint[] }` | Complaints list |
| `401 Unauthorized` | — | Token expired / invalid |

**Response Body** (example):
```json
[
  {
    "id": 1,
    "victim": {
      "firstName": "U2FsdGVkX1...",
      "lastName": "U2FsdGVkX1...",
      "phone": "U2FsdGVkX1...",
      "address": { "street": "...", "city": "...", "state": "...", "zip": "...", "country": "..." }
    },
    "accused": { ... },
    "incidence": {
      "date": "2026-04-10",
      "time": "14:30",
      "description": "U2FsdGVkX1...",
      "crimetype": "U2FsdGVkX1...",
      "address": { ... }
    },
    "evidenceLink": "https://drive.google.com/...",
    "status": "PROCESSING"
  }
]
```

**Decryption**: The frontend calls `decryptComplaint()` on each item. Decrypts victim/accused person fields and incidence description/crimetype/address fields.

**Multiple response formats handled**: The frontend handles the response as:
1. Direct array: `Complaint[]`
2. Wrapped: `{ complaints: Complaint[] }`
3. Single object: `Complaint` → wraps in array

---

### 10. `GET /api/police/complaints`

**Description**: Fetch paginated complaints for police review.

**Auth Required**: ✅ Yes (JWT Bearer, role=POLICE)

**Called From**: `PoliceDashboard.jsx`

**Request**:
- **Query Parameters**:
  - `pageNumber` (number, required) — zero-indexed page number
  - `size` (number, required) — page size (frontend default: 5)

```
GET /api/police/complaints?pageNumber=0&size=5
Authorization: Bearer <JWT>
```

**Response**:
| Status | Body | Description |
|--------|------|-------------|
| `200 OK` | Paginated response (see below) | Page of complaints |
| `401 Unauthorized` | — | Token expired / not a police user |

**Response Body**:
```json
{
  "complaints": [
    {
      "id": 1,
      "victim":    { ... },
      "accused":   { ... },
      "incidence": { ... },
      "evidenceLink": "string | null",
      "status": "PROCESSING"
    }
  ],
  "total": 25
}
```

**Pagination calculation**: `totalPages = Math.ceil(response.data.total / pageSize)`

---

### 11. `POST /api/police/update`

**Description**: Update complaint status (Accept or Reject) by police officer.

**Auth Required**: ✅ Yes (JWT Bearer, role=POLICE)

**Called From**: `PoliceDashboard.jsx`

**Request**:
- **Content-Type**: `application/json`
- **Query Parameters**:
  - `verdict` (string, required) — `"SUCCEEDED"` or `"REJECTED"`
  - `id` (number, required) — complaint ID
- **Body**: `{}` (empty JSON object)

```
POST /api/police/update?verdict=SUCCEEDED&id=1
Authorization: Bearer <JWT>
Content-Type: application/json
Body: {}
```

**Response**:
| Status | Body | Description |
|--------|------|-------------|
| `200 OK` | — | Status updated successfully |
| `401 Unauthorized` | — | Token expired / not a police user |
| `400 Bad Request` | — | Invalid complaint ID or verdict |

---

### 12. `POST /ai/api/groq`

**Description**: Send a user message to the AI legal assistant chatbot (Groq-powered).

**Auth Required**: ❌ No (public endpoint)

**Called From**: `ChatBox.jsx`

**Request**:
- **Content-Type**: `application/json`
- **Body**:
```json
{
  "content": "string (user's question)"
}
```

**Response**:
| Status | Body | Description |
|--------|------|-------------|
| `200 OK` | `string` (AI response text, plain or JSON) | Response from AI |
| `500 Internal Server Error` | — | AI service unavailable |

---

## Authentication Flow

```
┌─────────┐          ┌─────────────┐          ┌──────────┐
│  Client  │          │   Backend   │          │   DB     │
└────┬─────┘          └──────┬──────┘          └────┬─────┘
     │  POST /user/login     │                      │
     │  {username, password} │                      │
     │──────────────────────>│  validate creds       │
     │                       │─────────────────────>│
     │                       │  user found           │
     │                       │<─────────────────────│
     │  200: "eyJhbG..."     │  generate JWT         │
     │<──────────────────────│                      │
     │                       │                      │
     │  GET /user/get?token= │                      │
     │──────────────────────>│  decode token         │
     │                       │─────────────────────>│
     │  200: { User }        │  return user (encrypted)
     │<──────────────────────│<─────────────────────│
     │                       │                      │
     │  [localStorage.setItem("token", jwt)]        │
     │  [localStorage.setItem("user", userJSON)]    │
     │                       │                      │
     ├───── ALL SUBSEQUENT REQUESTS ────────────────┤
     │  Authorization: Bearer <JWT>                 │
     │──────────────────────>│  verify JWT           │
     │                       │                      │
```

## Encryption Architecture

```
┌──────────────────────────────────────────────┐
│                  FRONTEND                     │
│                                               │
│  User Input (plaintext)                      │
│       │                                      │
│       ▼                                      │
│  encryptAES(field)   ─── AES-256-ECB ──►     │
│  encryptPerson()     ─── Key: hardcoded ──►  │
│  encryptComplaint()                          │
│       │                                      │
│       ▼                                      │
│  Encrypted Payload (Base64 strings)          │
│       │                                      │
└───────┼──────────────────────────────────────┘
        │  HTTPS POST
        ▼
┌──────────────────────────────────────────────┐
│                  BACKEND                      │
│                                               │
│  Stores encrypted fields directly in DB      │
│  Returns encrypted fields in responses       │
│                                               │
└──────────────────────────────────────────────┘
        │  HTTPS GET
        ▼
┌──────────────────────────────────────────────┐
│                  FRONTEND                     │
│                                               │
│  Encrypted Response                          │
│       │                                      │
│       ▼                                      │
│  decryptAES(field)   ◄── AES-256-ECB ───     │
│  decryptPerson()     ◄── Key: hardcoded ──   │
│  decryptComplaint()                          │
│       │                                      │
│       ▼                                      │
│  Decrypted Data (plaintext for UI)           │
│                                               │
└──────────────────────────────────────────────┘
```

### Fields that are AES encrypted/decrypted:
| Entity | Encrypted Fields | Plaintext Fields |
|--------|-----------------|------------------|
| User | firstName, lastName, aadharNumber, address.* | id, username, email, role, verified |
| Person | firstName, lastName, phone, address.* | — |
| Incidence | description, crimetype, address.* | date, time |
| Complaint | (via nested entities above) | id, status, evidenceLink |

### AES Configuration:
- **Algorithm**: AES-256
- **Mode**: ECB (Electronic Codebook)
- **Padding**: PKCS7
- **Key**: 32-character string (hardcoded in `AESEncryption.js`)
- **Output**: Base64-encoded ciphertext

---

## Status Enum

The `status` field on a `Complaint` uses the following values:

| Value | Meaning | Set By |
|-------|---------|--------|
| `PROCESSING` | Complaint submitted, pending police review | System (on creation) |
| `SUCCEEDED` | Complaint accepted by police | Police officer |
| `REJECTED` | Complaint rejected by police | Police officer |

---

## Error Handling

### Global (via Axios interceptor in `axiosInstance.js`)
- **401 responses**: Auto-clear `localStorage` (token + user) + `sessionStorage` (complaints), redirect to `/login`
- Only triggers on protected paths (not on `/`, `/login`, `/police-login`, `/register`, `/verification`)

### Per-endpoint error handling
All endpoints show errors via `react-hot-toast` notifications. No `alert()` calls are used.

---

## CORS Requirements

The backend must allow CORS from the frontend origin:
- **Development**: `http://localhost:5173` (Vite dev server)
- **Production**: Configured deployment URL

Required CORS headers:
```
Access-Control-Allow-Origin: <frontend-origin>
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```
