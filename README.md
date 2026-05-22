# Doctor Appointment Server

## 1. Project Name

Doctor Appointment Server

## 2. Live Link

`https://doctor-appointment-server-lg6e.onrender.com/`

## 3. Description

A Node.js backend API for a doctor appointment booking application. It provides RESTful endpoints to fetch doctors, create and manage appointments, and update user profiles. Authentication is supported via JSON Web Tokens (JWT) with remote JWKS verification.

## 4. Features

- Fetch all doctors or search by name/specialty
- Retrieve details for a single doctor
- Create new appointment bookings
- Get bookings for a specific user by email
- Update appointment details
- Delete appointments
- Update user profile data
- Retrieve user profile information by email
- JWT authentication for protected routes

## 5. Installation

1. Clone the repository:

```bash
git clone https://github.com/asm-ayesha/doctor-appointment-server.git
```

2. Change into the project directory:

```bash
cd doctor-appointment-server
```

3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm start
```

5. For development with automatic reload:

```bash
npm run dev
```

## 6. Configuration

Create a `.env` file in the project root with the following variables:

```env
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
CLIENT_URL=<your-auth-client-url>
```

- `PORT`: The port where the server listens (default: `5000`).
- `MONGODB_URI`: MongoDB connection URI for the `doctor-appoinment` database.
- `CLIENT_URL`: URL of the client or authentication provider used for remote JWKS verification.

## 7. Folder Structure

```
doctor-appointment-server/
├── index.js
├── package.json
└── README.md
```

## 8. Technology Used

- Node.js
- Express
- MongoDB
- MongoDB Node.js Driver
- dotenv
- cors
- jose-cjs
- JSON Web Tokens (JWT)

## 9. API Endpoints

### Public

- `GET /` - Health check route
- `GET /doctors` - Fetch all doctors
  - Optional query: `?search=<term>`
- `GET /doctors/:doctorId` - Get a single doctor by ID

### Appointment management

- `POST /appointments` - Create a new appointment
- `GET /my-bookings?email=<userEmail>` - Get bookings for the user email
- `DELETE /appointments/:id` - Delete appointment by ID
- `PUT /appointments/:id` - Update an appointment by ID

### User profile

- `PUT /updateUsers/update` - Update or create user profile
- `GET /updateUsers/profile?email=<userEmail>` - Get user profile by email

## Notes

- Make sure MongoDB is running and accessible using the provided `MONGODB_URI`.
- Ensure `CLIENT_URL` points to the auth service exposing JWKS at `/api/auth/jwks`.
- Update the live link section once the backend is deployed.
