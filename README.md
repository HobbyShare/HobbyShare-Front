# HobbyShare

A social platform for connecting people through shared hobbies and activities.

## Table of Contents

1. [Overview](#1-overview)
2. [Key Features](#2-key-features)
3. [Tech Stack](#3-tech-stack)
4. [Getting Started](#4-getting-started)
5. [Project Structure](#5-project-structure)
6. [Authentication Flow](#6-authentication-flow)
7. [API Endpoints](#7-api-endpoints)
8. [Event Categories](#8-event-categories)
9. [Testing](#9-testing)
10. [Map Integration](#10-map-integration)
11. [Calendar Features](#11-calendar-features)
12. [Dashboard Analytics](#12-dashboard-analytics)
13. [Security Features](#13-security-features)
14. [Decisions and Justifications](#14-decisions-and-justifications)
15. [Project Screenshots](#15-project-screenshots)
16. [Demo](#16-demo)
17. [Team](#17-team)
18. [License](#18-license)

## 1. Overview

HobbyShare is a full-stack web application that enables users to create, discover, and join hobby-based events. Users can view events on an interactive map, manage them through a visual calendar, and track participation metrics via an analytics dashboard.

## 2. Key Features

- **User Authentication**: Secure JWT-based registration and login with bcrypt password hashing
- **Event Management**: Full CRUD operations for hobby events with category filtering
- **Interactive Map**: Leaflet-powered map with event markers and location selection
- **Visual Calendar**: FullCalendar integration displaying events with date filtering
- **Analytics Dashboard**: Chart.js visualizations for events by category and monthly trends
- **Participant System**: Join/leave events with real-time participant tracking
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 3. Tech Stack

**Frontend**
- Angular 21 with Signals for reactive state management
- Tailwind CSS for styling
- Leaflet for interactive maps
- FullCalendar for event calendar
- Chart.js for data visualization
- Vitest for testing

**Backend**
- NestJS framework with TypeScript
- MongoDB with Mongoose ODM
- JWT authentication with Passport
- class-validator for DTO validation
- bcrypt for password security
- Jest for testing
- Swagger for API documentation

## 4. Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas cluster)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
MONGODB_URI=mongodb+srv://your-connection-string
PORT=3000
JWT_SECRET=your-secret-key
JWT_EXPIRATION_TIME=3600s
```

Start the server:

```bash
npm run start:dev
```

API available at `http://localhost:3000`  
Swagger docs at `http://localhost:3000/api-docs`

### Frontend Setup

```bash
cd frontend
npm install
ng serve
```

Application available at `http://localhost:4200`

## 5. Project Structure

```
backend/
├── src/
│   ├── auth/           # JWT authentication & guards
│   ├── users/          # User management & profiles
│   ├── events/         # Event CRUD with participants
│   └── common/         # Shared enums & utilities
│
frontend/
└── src/app/
    ├── auth/           # Login & registration components
    ├── core/
    │   ├── services/   # API services (auth, events, map, calendar)
    │   ├── models/     # TypeScript interfaces
    │   └── enums/      # Hobby categories
    ├── events/
    │   ├── calendar/           # FullCalendar view
    │   ├── event-detail/       # Event details page
    │   ├── event-form/         # Create/edit form
    │   ├── events-list/        # Events listing
    │   ├── map/                # Leaflet map component
    │   └── location-picker-modal/  # Location selection
    ├── dashboard/
    │   ├── dashboard/          # Dashboard view
    │   ├── bar-chart/          # Bar-chart component
    │   ├── line-chart/         # Line-chart component
    │   ├── pie-chart/          # Pie-chart component
    └── shared/         # Reusable components
```

## 6. Authentication Flow

1. User registers with username, email, password, and hobby preferences
2. Password is hashed using bcrypt (10 rounds)
3. User logs in and receives a JWT token
4. Token stored in localStorage and sent via Authorization header
5. JwtAuthGuard protects routes requiring authentication
6. Token payload contains username and userId for authorization

## 7. API Endpoints

**Authentication**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and receive JWT token

**Events**
- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID
- `GET /events/user/my-events` - Get current user's events (protected)
- `POST /events` - Create event (protected)
- `PUT /events/:id` - Update event (protected)
- `DELETE /events/:id` - Delete event (protected)
- `POST /events/:id/join` - Join event (protected)
- `DELETE /events/:id/leave` - Leave event (protected)

## 8. Event Categories

Music | Sports | Art/Creativity | Technology | Reading | Video Games | Cooking | Nature | Wellness | Photography

## 9. Testing

**Backend Tests**
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
```

**Frontend Tests**
```bash
cd frontend
npm run test          # Vitest tests
```

## 10. Map Integration

- Leaflet with OpenStreetMap tiles
- Click-to-select location during event creation
- Draggable markers for precise positioning
- Event markers with popup details
- User geolocation support

## 11. Calendar Features

- Month/week/day grid views
- Event filtering by date
- Click event to view details
- Integration with event service

## 12. Dashboard Analytics

- Events by hobby category (bar chart)
- Events by month (line chart)
- Real-time participant statistics

## 13. Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- HTTP-only token storage
- Protected API routes with guards
- Input validation with class-validator
- CORS configuration for frontend

## 14. Decisions and Justifications

### Architecture Decisions

**Angular Signals over RxJS**  
We chose Angular 21's Signals for state management to simplify reactivity and reduce boilerplate compared to traditional RxJS observables. Signals provide better performance and easier debugging while maintaining reactive patterns.

**NestJS for Backend**  
NestJS was selected for its TypeScript-first approach, built-in dependency injection, and modular architecture. Its decorators and structure align well with Angular's patterns, creating consistency across the stack.

**MongoDB over SQL**  
We chose MongoDB for its flexible schema, which is ideal for rapid prototyping and evolving event structures. The document model naturally fits our nested data (events with participants arrays).

### Technical Decisions

**JWT in localStorage**  
While sessionStorage or httpOnly cookies are more secure, localStorage was chosen for simplicity in this learning project and ease of token management across tabs.

**Leaflet over Google Maps**  
Leaflet with OpenStreetMap provides a free, open-source mapping solution without API key requirements, making it ideal for a student project.

**Tailwind CSS**  
Tailwind's utility-first approach accelerated development and ensured consistent styling without writing custom CSS files.

### Feature Decisions

**Location Picker Modal**  
Rather than inline map editing, we implemented a modal for location selection to provide a focused, distraction-free experience when choosing event locations.

**Participant Array in Events**  
Storing participant IDs directly in the event document (denormalized) allows faster queries for participant counts without joins, at the cost of potential consistency issues.

## 15. Project Screenshots

### Login & Registration
![Login Screen](/public/login-register.gif)


### Events Management & Map
![Events List and Detail](/public/events-list-detail.gif)

![Create Event Form](/public/event-form-map.gif)

### Calendar & Dashboard
![Analytics Dashboard](/public/CalendarGraficos.gif)

## 16. Demo

Access the live demo: [HobbyShare Demo](https://your-demo-url-here.com)

**Test Credentials:**
- Username: `demo`
- Password: `demo123`

## 17. Team

Developed as a collaborative learning project demonstrating full-stack development skills with modern frameworks and best practices.

## 18. License

Educational project - created for learning purposes.

---

**Note**: This is a student project showcasing proficiency in Angular, NestJS, MongoDB, authentication, real-time updates, mapping services, and responsive design patterns.
