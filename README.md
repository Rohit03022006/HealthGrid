# HealthGrid

![HealthGrid](https://img.shields.io/badge/HealthGrid-OPD%20Management-1f4fff?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.x-61dafb?style=for-the-badge&logo=react&logoColor=000000)
![Vite](https://img.shields.io/badge/Vite-8.x-646cff?style=for-the-badge&logo=vite&logoColor=ffffff)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=ffffff)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Relational%20DB-336791?style=for-the-badge&logo=postgresql&logoColor=ffffff)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?style=for-the-badge&logo=socketdotio&logoColor=ffffff)
![Dexie](https://img.shields.io/badge/IndexedDB-Dexie.js-ffb000?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge)

Modern OPD management system for patient registration, token assignment, real-time queue tracking, prescriptions, analytics, and offline-first data capture.

## Project Overview

HealthGrid is a full-stack outpatient department workflow system designed to reduce paper-based handling at the reception desk and speed up doctor consultations. The application is split into a React + Vite frontend and an Express + PostgreSQL backend, with Socket.IO used for real-time queue updates and Dexie/IndexedDB used for offline persistence on the client.

The repository contains role-based experiences for receptionists, doctors, and administrators. The public landing page introduces the product, the receptionist desk handles patient search and tokening, the doctor dashboard supports history review and prescription generation, and the admin dashboard surfaces operational analytics.

## Problem Statement

Traditional OPD workflows often depend on paper registers, manual token distribution, fragmented patient records, and delayed handoffs between reception and consultation. These issues create avoidable waiting time, make queue visibility poor, and increase the chance of data loss when connectivity is unstable.

HealthGrid addresses these problems by centralizing registration, tokening, queue management, prescriptions, and analytics into one system with real-time updates and offline support for front-desk operations.

## Key Features

- Role-based authentication for receptionist, doctor, and admin users.
- Patient registration and patient lookup by phone.
- OPD token assignment with printable QR-based token slips.
- Real-time queue updates through Socket.IO.
- Doctor workflow for current patient review, prior visit history, and prescription creation.
- Prescription templates for faster repeat consultations.
- Medicine autocomplete and dosage/frequency entry.
- PDF generation for prescriptions.
- Admin analytics for patient load, doctor load, peak hours, and top medicines.
- Offline-first capture for patient and token actions using IndexedDB.
- Secure API access with JWT, request validation, and role checks.

## Architecture Overview

HealthGrid follows a layered client-server architecture:

1. The React frontend renders public, receptionist, doctor, and admin interfaces.
2. The frontend calls the REST API through an Axios client that automatically attaches JWT tokens.
3. Socket.IO keeps queue state synchronized between reception and doctor views.
4. The Express backend exposes modular routes for auth, patients, tokens, queue, prescriptions, medicines, templates, and analytics.
5. PostgreSQL stores users, patients, tokens, visits, prescriptions, templates, medicines, and audit logs.
6. Dexie/IndexedDB stores offline patient/token actions until connectivity returns.
7. Nginx, Docker, and EC2 are shown in the system diagram as the deployment/infrastructure layer.

### Architecture Diagram

![HealthGrid architecture and data flow](docx/Workflow.png)

*Caption: End-to-end architecture showing users, frontend, backend APIs, Socket.IO, offline sync, and PostgreSQL persistence.*

## Complete Workflow Explanation

### 1. Public Entry Flow

The landing page presents the product, queue preview, and navigation into the authenticated dashboard. From here, users move into the login screen and are redirected to the correct role-based workspace after authentication.

### 2. Receptionist Flow

The receptionist desk is the front-line operational screen. The workflow is:

1. Search an existing patient by phone.
2. Register a new patient if no match is found.
3. Generate a patient code automatically.
4. Assign an OPD token number.
5. Print or share the token slip with QR code.
6. Persist offline actions locally if the network is unavailable.
7. Sync pending actions to the server when connectivity returns.
8. Broadcast queue changes to connected doctor dashboards in real time.

### 3. Doctor Flow

The doctor dashboard is built around consultation efficiency:

1. Open the live queue and see the current serving token.
2. Select the active patient to load profile and visit history.
3. Review previous prescriptions when available.
4. Start from a template or manually enter a fresh prescription.
5. Search medicines using autocomplete.
6. Add dosage, frequency, instructions, advice, and follow-up date.
7. Generate and print a prescription PDF.
8. Mark the consultation complete so the next patient loads.

### 4. Admin Flow

The admin dashboard focuses on operational oversight:

1. Review daily and weekly patient volume.
2. Inspect doctor load and consultation duration.
3. Track peak hours across the week.
4. Review the most prescribed medicines over a selected period.

### 5. Offline Sync Flow

When the browser is offline, patient registration and token assignment actions are stored in IndexedDB through Dexie. A pending-sync badge can be shown in the UI until the service worker and network restore the connection. Once online, the client retries pending records, removes successful sync items, and keeps only unresolved conflicts in the queue.

### Workflow Diagrams

![Receptionist workflow](docx/Receptionist%20Flow.png)

*Caption: Receptionist registration and token assignment flow, including offline storage and sync back to the server.*

![Doctor workflow](docx/DoctorFlow.png)

*Caption: Doctor consultation flow from login to prescription generation and patient handoff.*

![Offline synchronization flow](docx/OfflineSyncFlow.png)

*Caption: Offline-first capture flow using IndexedDB, background sync, and conflict handling.*

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- Shadcn-style component primitives
- Framer Motion / Motion
- Socket.IO Client
- Dexie / IndexedDB
- jsPDF
- QR code utilities

### Backend

- Node.js
- Express 5
- PostgreSQL
- Socket.IO
- JWT
- bcryptjs
- Helmet
- CORS
- Morgan
- Zod validation
- Winston logging

### Infrastructure and Deployment Concepts

- Docker
- Nginx
- AWS EC2

## Installation & Setup Guide

### Prerequisites

- Node.js 20+ recommended
- npm 10+ recommended
- PostgreSQL database
- A browser that supports service workers and IndexedDB

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd HealthGrid
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure environment variables

Create a backend `.env` file in `backend/` and a frontend `.env` file in `frontend/` as described below.

### 5. Run database migrations

```bash
cd backend
npm run migrate
```

### 6. Seed sample data if needed

```bash
npm run seed:medicines
npm run seed:demo
```

## Environment Variables

### Backend `.env`

```env
DATABASE_URL=postgresql://user:password@localhost:5432/healthgrid
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
PORT=5000
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Running Locally

### Backend

```bash
cd backend
npm run dev
```

The API will start on the configured port, defaulting to `5000`.

### Frontend

```bash
cd frontend
npm run dev
```

The Vite app will start on the local development port, typically `5173`.

## API Endpoints

All protected endpoints require a valid JWT unless noted otherwise.

### Auth

- `POST /api/auth/register` - register a user.
- `POST /api/auth/login` - authenticate and receive a token.
- `GET /api/auth/me` - fetch the current authenticated user.

### Patients

- `GET /api/patients/search` - search patient by phone.
- `GET /api/patients` - list patients.
- `GET /api/patients/:id` - get patient details.
- `POST /api/patients` - register a new patient.
- `PUT /api/patients/:id` - update a patient.

### Tokens and Queue

- `POST /api/tokens` - assign a token.
- `GET /api/tokens/queue` - get today’s queue.
- `GET /api/tokens/:id` - get token details.
- `PATCH /api/tokens/:id/status` - update token status.
- `GET /api/queue/status/:token` - get public queue status for a token.

### Prescriptions

- `POST /api/prescriptions` - create a prescription.
- `GET /api/prescriptions/visit/:visitId` - fetch a prescription for a visit.
- `GET /api/prescriptions/patient/:patientId` - fetch a patient’s history.

### Medicines

- `GET /api/medicines/search` - search medicine catalog.

### Templates

- `GET /api/templates` - list doctor templates.
- `POST /api/templates` - create a template.
- `PUT /api/templates/:id` - update a template.
- `DELETE /api/templates/:id` - delete a template.

### Analytics

- `GET /api/analytics/dashboard` - dashboard summary.
- `GET /api/analytics/doctor-load` - doctor workload statistics.
- `GET /api/analytics/heatmap` - peak-hour heatmap.
- `GET /api/analytics/medicines` - top medicines report.

### Utility

- `GET /test` - health check endpoint.

## Screenshots

### Public and Authentication Screens

![HealthGrid landing page](docx/LandingPage.png)

*Caption: Public landing page with live queue preview and navigation to the dashboard.*

![HealthGrid login page](docx/LoginPage.png)

*Caption: Authentication screen used by staff to enter the role-based dashboard.*

### Receptionist Screens

![Receptionist desk](docx/ReceptionistPage.png)

*Caption: Receptionist workspace for searching patients, registering new cases, and assigning tokens.*

![Printable token slip](docx/TokenSlipPage.png)

*Caption: QR-based token slip ready for printing or scanning at the front desk.*

![Token details modal](docx/TokenDetailsPage.png)

*Caption: Token details view showing patient, reason, issued time, and queue status.*


### Doctor Screens

![Doctor dashboard](docx/DoctorDashboardPage.png)

*Caption: Doctor dashboard with live queue, patient history, and active consultation context.*

![Prescription builder](docx/PrescriptionPage.png)

*Caption: Prescription authoring screen with medicine autocomplete, dosage, and follow-up fields.*

### Admin Screens

![Admin dashboard analytics](docx/AdminDashboard_1.png)

*Caption: Admin analytics dashboard showing patient counts, consultation time, and doctor load.*

![Admin heatmap and medicines report](docx/AdminDashboard_2.png)

*Caption: Peak-hour heatmap and top medicines report used for operational analysis.*

## Workflow Diagrams Explanation

The workflow visuals in this repository are not decorative slides; they map directly to how the product behaves:

- `Workflow.png` shows the full system boundary from users through frontend, backend, realtime sockets, offline sync, and PostgreSQL.
- `Receptionist Flow.png` shows the patient registration decision tree, token assignment, QR slip output, and offline fallback.
- `DoctorFlow.png` shows the consultation flow, including patient selection, history review, template usage, medicine autocomplete, drug-interaction checks, and prescription output.
- `OfflineSyncFlow.png` shows how pending records are stored locally, synced later, and conflict-checked before server reconciliation.

## Database Design Overview

The backend uses PostgreSQL with a normalized structure centered on operational OPD entities. The migration set creates tables for users, patients, tokens, visits, prescriptions, templates, medicines, and audit logs. Indexes are added for patient phone/code lookups, user email lookup, visit timelines, prescription visit joins, token date/status filtering, and template ownership filtering.

![Database and persistence overview](docx/Workflow.png)

*Caption: Data-layer view showing PostgreSQL persistence, medicines storage, and offline sync boundaries.*

### Main Data Entities

- `users` stores authenticated staff accounts and role information.
- `patients` stores registration details and patient codes.
- `tokens` stores OPD token generation and status history.
- `visits` links patients to doctors and consultation timestamps.
- `prescriptions` stores consultation outcomes and medicine lists.
- `templates` stores reusable doctor prescription templates.
- `medicines` stores searchable medicine catalog data.
- `audit_logs` stores traceable system events.

## Security Considerations

- JWT-based authentication protects sensitive routes.
- Role middleware restricts receptionist, doctor, and admin capabilities by endpoint.
- Helmet adds baseline HTTP security headers.
- CORS is explicitly configured for the client origin.
- Input validation is enforced with Zod-backed validation middleware.
- Passwords are hashed with bcryptjs.
- Axios interceptors remove stale sessions on `401` responses.
- Offline queue items use UUID-based de-duplication to reduce duplicate sync writes.

## Performance Optimizations

- Real-time queue updates avoid repeated polling.
- PostgreSQL indexes support fast token, patient, visit, and template lookups.
- Medicine search is optimized for autocomplete-driven consultation flows.
- Frontend request timeout and error normalization keep the UI responsive under failure.
- Offline-first writes let the receptionist continue working without waiting on network retries.
- Queue updates are filtered client-side to keep only active records in view.

## Future Enhancements

- Add richer audit dashboards for clinical and operational traceability.
- Expand appointment and follow-up scheduling beyond same-day OPD tokens.
- Add exportable reports for monthly analytics and medicine usage.
- Extend offline sync conflict visualization for front-desk reconciliation.
- Add multi-branch and department-aware queue routing.
- Introduce stricter observability around latency, queue lag, and failed sync events.

## Notes

- The frontend expects `VITE_API_URL` and `VITE_SOCKET_URL` only when you want to override the local defaults.
- The backend migration runner executes SQL files in filename order and skips migrations that already ran.
- The screenshots and workflows in this README come from the repository’s `docx/` directory and the current source tree.
