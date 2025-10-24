# CasePerl

CasePerl is an application designed for individuals who have experienced a cyberattack. Through this platform, users can file a cybercrime complaint easily and securely. Once a case is submitted, it is shared with all the administrators (admins) in the system. They were experts in cybersecurity with proven experience in handling various types of cyber incidents.

These admins review the submitted cases, take ownership of the ones they choose to handle, and begin a thorough investigation. After conducting an in-depth analysis, they provide tailored solutions and recommendations to help users resolve their cyber issues effectively.

## Tech Stack

- **Backend:**
  - Django
  - Django REST Framework
  - JWT Authentication

- **Frontend:**
  - React.js
  - Tailwind CSS

- **Database:**
  - MySQL

---

## Folder Structure

```
caseperl/
├── backend/
│   ├── caseperl/
│   │   ├── case/              # Case management module
│   │   │   ├── urls.py
│   │   │   └── views.py
│   │   ├── users/            # User authentication & management
│   │   │   ├── urls.py
│   │   │   └── views.py
│   │   └── caseperl/         # Core app configuration
│   │       ├── settings.py
│   │       ├── urls.py
│   │       └── wsgi.py
│   ├── Dockerfile
│   ├── .env
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── serviceWorkers/
│   │   ├── App.jsx
│   │   └── Main.jsx
│   └── Dockerfile
├── docker-compose.yml
├── docker-compose.dev.yml
└── README.md
```
---

## Development Approach

### Backend Architecture
- Django framework with modular structure (cases and users apps)
- REST API implementation using Django REST Framework
- Comprehensive serializers for request/response handling and validation
- Role-Based Data Access Control (RBDAC) for secure data access

### Authentication & Security
- JWT-based authentication system
- Refresh token mechanism for persistent sessions
- Role-based authorization for API endpoints

### Development Practices
- Modular code structure for scalability
- Comprehensive error handling
- Separate apps for user management and case handling
- Test-driven development approach

### Frontend Development
- React.js with Vite for enhanced development experience
- Component-based architecture
- State management using React Context
- Tailwind CSS for responsive design