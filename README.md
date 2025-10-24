# CasePerl

CasePerl is a platform designed for individuals who have experienced a cyberattack. Users can securely file cybercrime complaints, which are then reviewed by administrators (admins) who are cybersecurity experts. Admins can take ownership of cases, investigate, and provide personalized solutions to help users resolve their issues effectively.

---

## Tech Stack

**Backend**

* Django
* Django REST Framework
* JWT Authentication
* MySQL

**Frontend**

* React.js
* Tailwind CSS

**Containerization**

* Docker & Docker Compose

---

## Folder Structure

```
caseperl/
├── backend/
│   ├── caseperl/
│   │   ├── case/              # Case management module
│   │   ├── users/             # User authentication and management
│   │   └── caseperl/          # Core app configuration
│   ├── Dockerfile
│   ├── .env
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   └── Main.jsx
│   └── Dockerfile
├── docker-compose.yml
├── docker-compose.dev.yml
└── README.md
```

---

## Data Model and Design Choices

### Case Model

The **Case** model represents user-reported cyber incidents and supports tracking, prioritization, and resolution workflow.

**Model Fields:**

| Field                | Type       | Description                                                                           |
| -------------------- | ---------- | ------------------------------------------------------------------------------------- |
| `title`              | CharField  | Brief title of the issue                                                              |
| `description`        | TextField  | Detailed explanation of the cyber incident                                            |
| `status`             | CharField  | Tracks case progress (`new`, `open`, `in_progress`, `resolved`, `closed`, `reopened`) |
| `priority`           | CharField  | Case urgency (`low`, `medium`, `high`)                                                |
| `user`               | ForeignKey | Links the case to the reporting user                                                  |
| `created_at`         | DateTime   | Auto-set creation timestamp                                                           |
| `updated_at`         | DateTime   | Auto-updated modification timestamp                                                   |
| `due_date`           | DateTime   | Optional field for expected resolution deadline                                       |
| `resolution_summary` | TextField  | Admin’s resolution summary after handling the case                                    |

**Indexes:**

* Indexed by `status`, `priority`, and `user` for faster filtering and queries.

### User Model

The **User** model extends Django’s authentication system with role-based access control.

**Model Fields:**

| Field       | Type      | Description                                         |
| ----------- | --------- | --------------------------------------------------- |
| `uname`     | CharField | Unique username used for login                      |
| `role`      | CharField | Defines user role (`agent` or `admin`)              |
| `password`  | Encrypted | Handled securely using Django’s password management |

**Roles:**

* **Agent** – Regular user who can submit and view their own cases.
* **Admin** – Cybersecurity expert who can view, manage, and update all cases.

---

## Custom Business Rules

1. **Status Transition Rule**
   Cases can only move forward through logical statuses.
   Example:
   `new → open → in_progress → resolved → closed`
   Moving backward (e.g., from resolved to in_progress) is not allowed.

2. **Role-based Access Control (RBAC)**

   * Agents can only view, create, or modify their own cases.
   * Admins can view and update all cases, including status transitions.

3. **Soft Delete Implementation**
   Instead of permanently removing records, `is_deleted` is set to `True`.
   This keeps data available for audit purposes.

---

## Backend Overview

The backend is built using **Django REST Framework (DRF)** with modular architecture.

### Case Management API (`/api/case/`)

| Method | Endpoint                              | Description                            |
| ------ | ------------------------------------- | -------------------------------------- |
| GET    | `/api/case/`                          | Retrieve all cases (admin only)        |
| POST   | `/api/case/`                          | Create a new case                      |
| GET    | `/api/case/user/{user_id}/`           | Retrieve all cases for a specific user |
| PUT    | `/api/case/update/{id}/{user_id}/`    | Update a case owned by a user          |
| PUT    | `/api/case/status/{id}/{idx_status}/` | Update case status (admin only)        |
| DELETE | `/api/case/delete/{id}/`              | Soft-delete a case by ID               |

### Authentication API (`/api/auth/`)

| Method | Endpoint                   | Description                             |
| ------ | -------------------------- | --------------------------------------- |
| POST   | `/api/auth/register/`      | Register a new user                     |
| POST   | `/api/auth/login/`         | Log in and receive JWT tokens           |
| POST   | `/api/auth/logout/`        | Log out and blacklist the token         |
| GET    | `/api/auth/me/`            | Retrieve the current user’s information |
| POST   | `/api/auth/token/refresh/` | Refresh access tokens                   |

### Validation and Error Handling

* DRF serializers ensure clean input validation.
* Clear and consistent JSON error responses.
* JWT authentication for secure API access.
* Role-based permissions for agents and admins.

---

## Frontend Overview

The frontend is built using **React.js** and **Tailwind CSS**.
It communicates with the Django API to handle authentication and case management.

### Key Features

* Dashboard view for all cases (filtered by user or role).
* Create, edit, delete, and update case status from the UI.
* Loading indicators and alert messages for better UX.
* Responsive layout for desktop and mobile screens.

### State Management

* Implemented using React Context API for global authentication and case data.
* Uses Axios for secure API communication.

---

## Deployment and Containerization

Both backend and frontend are containerized using Docker.
`docker-compose.yml` manages the services for backend, frontend, and MySQL.

### Docker Compose Highlights

* Each service runs independently in isolated containers.
* Shared internal network allows communication between containers.
* Persistent MySQL volume for data retention.
* Environment variables for flexible configuration.

---

## Running the Project

### Prerequisites

Make sure the following are installed:

* Docker and Docker Compose
* Node.js 16+
* Python 3.10+
* MySQL

---

### Environment Variables

Create a `.env` file inside the **backend** directory and include:

```bash
DB_NAME=mydb
DB_USER=myuser
DB_PASSWORD=mypassword
DB_HOST=db
DB_PORT=3306

SECRET_KEY="your_django_secret_key"
DEBUG=True
```

---

### Run with Docker

1. **Clone the repository**

   ```bash
   git clone https://github.com/gdevakrishnan/caseperl
   cd caseperl
   ```

2. **Build and start containers**

   ```bash
   docker-compose build
   docker-compose up
   ```

3. **Access the application**

   * Frontend: [http://localhost:3000](http://localhost:3000)
   * Backend API: [http://localhost:8000](http://localhost:8000)

4. **Stop containers**

   ```bash
   docker-compose down
   ```

---

### Run Locally (Without Docker)

**Backend Setup**

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Use source venv/bin/activate on macOS/Linux
pip install -r requirements.txt
python manage.py runserver
```

**Frontend Setup**

```bash
cd ../frontend
npm install
npm run dev
```

**Access:**

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend API: [http://localhost:8000](http://localhost:8000)

---

## Features

### General

* Full-stack web app with Django backend and React frontend
* MySQL database for structured data storage
* `.env` based configuration
* Dockerized deployment for portability

### Backend

* REST API using Django REST Framework
* JWT-based authentication and RBAC
* Case priority, status management, and custom validations
* Soft deletion and indexed queries

### Frontend

* Responsive design with Tailwind CSS
* Context-based state management
* Reusable component structure
* Real-time API updates and feedback

---

## Development Challenges and Solutions

### 1. Secure Case Handling

Implemented JWT authentication and role-based permissions to maintain user data privacy while allowing admin oversight.

### 2. Workflow Management

Developed strict status transition validation to maintain case progression integrity.

### 3. Cross-Origin Resource Sharing (CORS)

Used `django-cors-headers` to handle cross-origin API requests from React.

### 4. Docker Networking

Configured container communication using service names in `docker-compose.yml`.

### 5. Database Migrations

Ensured consistent migrations and data persistence using Docker volumes.

### 6. Error Handling

Standardized API response structure and integrated frontend error notifications for better debugging and UX.

---

## Key points

* Admins are certified cybersecurity professionals.
* Agents can only view and manage their own cases.
* Case workflow follows the logical lifecycle (`new → open → in_progress → resolved → closed`).
* JWT tokens are used for secure authentication and session handling.

---