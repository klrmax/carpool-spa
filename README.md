# Carpool SPA 🚗

A modern carpooling/ride-sharing Single Page Application built with Angular 18. This application allows users to browse available rides, create their own rides, manage ride requests, and even compare carpool options with train alternatives.

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Authentication Flow](#-authentication-flow)
- [Configuration](#-configuration)
- [Contributing](#-contributing)

## ✨ Features

### User Features
- **Browse Rides**: Search and filter available rides by location, date, and time
- **Create Rides**: Offer rides to other users with customizable routes and schedules
- **Request Rides**: Send requests to join rides offered by other drivers
- **Manage Requests**: Accept or reject ride requests from other users
- **Dashboard**: Personal hub for managing all your rides and requests
- **Train Alternatives**: View train connection options alongside carpool rides
- **Real-time Updates**: Live ride listings with driver information and seat availability

### Technical Features
- **Hybrid API Architecture**: GraphQL for queries, REST for mutations
- **Token-based Authentication**: Secure authentication with JWT tokens
- **Responsive Design**: Mobile-friendly interface with gradient theme
- **State Management**: Reactive state management with RxJS BehaviorSubjects
- **Route Guards**: Protected routes with automatic authentication checks
- **Error Handling**: Comprehensive error handling with user-friendly notifications
- **Standalone Components**: Modern Angular 18 architecture without NgModules

## 🚀 Technology Stack

### Frontend
- **Angular** 18.1.0 - Modern web application framework
- **TypeScript** 5.5.2 - Type-safe JavaScript
- **RxJS** 7.8.0 - Reactive programming library
- **Apollo Client** 3.11.8 - GraphQL client
- **Apollo Angular** 7.0.0 - Angular integration for Apollo

### Backend Integration
- **GraphQL** 16.11.0 - Query language for APIs
- **REST API** - Traditional HTTP endpoints for mutations

### Server & Deployment
- **Express.js** 4.18.2 - Static file serving
- **Node.js** 20.x - JavaScript runtime
- **Heroku** - Cloud deployment platform

## 🏗️ Architecture

### Component Architecture

```
AppComponent (Root)
├── Sidebar Navigation
├── RidesComponent (Browse rides)
│   ├── SearchbarComponent (Filters)
│   └── RideListComponent (Grid display)
├── RideDetailComponent (Single ride view)
└── DashboardComponent (User hub)
    ├── Create Ride Tab
    ├── MyRidesComponent (User's rides)
    └── RideRequestsComponent (Request management)
```

### Service Layer

- **RideService**: Core ride data management with REST API integration
- **RideGraphqlService**: GraphQL queries for ride data
- **AuthService**: Authentication and token management
- **TrainService**: Train connection alternatives
- **NotificationService**: Toast notification system

### Guards & Interceptors

- **AuthGuard**: Protects authenticated routes and handles token extraction
- **AuthInterceptor**: Automatically adds Bearer token to HTTP requests

## 🎯 Getting Started

### Prerequisites

- Node.js 20.x
- npm 10.x
- Angular CLI 18.1.0

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd carpool-spa
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run watch
```

4. Navigate to `http://localhost:4200/`

The application will automatically reload when you change source files.

## 💻 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server (Express) |
| `npm run build` | Build for production |
| `npm run watch` | Development mode with auto-reload |
| `npm test` | Run unit tests via Karma |
| `ng serve` | Angular dev server on port 4200 |
| `ng generate component <name>` | Generate new component |

### Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application automatically reloads on file changes.

### Build

```bash
npm run build
```

Build artifacts are stored in `dist/carpool-spa/browser/`. The build is optimized for production with:
- Output hashing for cache busting
- Minification and bundling
- 500KB initial bundle size budget
- 1MB maximum bundle size

### Running Tests

```bash
npm test
```

Execute unit tests via [Karma](https://karma-runner.github.io) test runner.

## 🌐 Deployment

### Heroku Deployment

The application is configured for Heroku deployment:

1. **Build Process**: Automatically runs `ng build --configuration production` on deployment
2. **Server**: Express.js serves static files from `dist/carpool-spa/browser/`
3. **Port**: Configured via `PORT` environment variable
4. **Node Version**: Locked to Node.js 20.x

### Manual Deployment

```bash
# Build the application
npm run build

# Start the production server
npm start
```

The server listens on `process.env.PORT` or port 8080 by default.

### Production URLs

- **Frontend**: https://carpool-spa-<app-id>.herokuapp.com
- **Backend API**: https://carpoolbff-c576f25b03e8.herokuapp.com
- **Login MPA**: https://carpool-mpa-b2ab41ee1e9d.herokuapp.com

## 📡 API Documentation

### Backend Endpoints

**Base URLs:**
- GraphQL: `https://carpoolbff-c576f25b03e8.herokuapp.com/graphql`
- REST API: `https://carpoolbff-c576f25b03e8.herokuapp.com/api`

### GraphQL Queries

#### Get All Rides
```graphql
query GetAllRides {
  getAllRides {
    id
    startLocation
    destination
    departureTime
    availableSeats
    driver {
      userid
      name
    }
  }
}
```

#### Search Rides
```graphql
query SearchRides($start: String, $destination: String, $date: String, $time: String) {
  searchRides(start: $start, destination: $destination, date: $date, time: $time) {
    id
    startLocation
    destination
    departureTime
    availableSeats
    driver {
      userid
      name
    }
  }
}
```

#### Get Ride By ID
```graphql
query GetRideById($id: Int!) {
  getRideById(id: $id) {
    id
    startLocation
    destination
    departureTime
    availableSeats
    created_at
    driver {
      userid
      name
      email
    }
  }
}
```

### REST API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/ride/:id` | Get ride details | Yes |
| POST | `/api/ride` | Create new ride | Yes |
| DELETE | `/api/ride/:id` | Delete ride | Yes |
| GET | `/api/ride/mine` | Get user's created rides | Yes |
| GET | `/api/ride/joined` | Get user's joined rides | Yes |
| POST | `/api/ride-request?rideId={id}` | Request to join ride | Yes |
| GET | `/api/ride-request/open` | Get open requests | Yes |
| GET | `/api/ride-request/mine` | Get user's requests | Yes |
| PATCH | `/api/ride-request/:id` | Accept/reject request | Yes |
| POST | `/api/users/logout` | Logout user | Yes |
| GET | `/api/trains` | Get train alternatives | Yes |

### Authentication

All authenticated requests require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## 📂 Project Structure

```
carpool-spa/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── app.component.ts/html/css        # Root component with sidebar
│   │   │   ├── rides/                            # Browse rides page
│   │   │   │   ├── rides.component.ts
│   │   │   │   ├── rides.component.html
│   │   │   │   └── rides.component.css
│   │   │   ├── ride-detail/                      # Individual ride detail
│   │   │   │   ├── ride-detail.component.ts
│   │   │   │   └── ride-detail.component.html
│   │   │   ├── dashboard/                        # User dashboard
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   ├── dashboard.component.html
│   │   │   │   └── dashboard.component.css
│   │   │   ├── ride-list/                        # Shared ride list component
│   │   │   │   ├── ride-list.component.ts
│   │   │   │   └── ride-list.component.html
│   │   │   ├── searchbar/                        # Search filter component
│   │   │   │   ├── searchbar.component.ts
│   │   │   │   └── searchbar.component.html
│   │   │   ├── my-rides/                         # User's created & joined rides
│   │   │   │   ├── my-rides.component.ts
│   │   │   │   └── my-rides.component.html
│   │   │   └── ride-requests/                    # Manage ride requests
│   │   │       ├── ride-requests.component.ts
│   │   │       └── ride-requests.component.html
│   │   ├── services/
│   │   │   ├── ride.service.ts                   # Ride CRUD & search logic
│   │   │   ├── ride-graphql.service.ts           # GraphQL ride queries
│   │   │   ├── auth.service.ts                   # Authentication & tokens
│   │   │   ├── train.service.ts                  # Train connection API
│   │   │   └── notification.service.ts           # Toast notifications
│   │   ├── guards/
│   │   │   └── auth.guard.ts                     # Route protection
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts               # Add auth token to requests
│   │   ├── graphql/
│   │   │   ├── ride.queries.ts                   # GraphQL queries
│   │   │   └── ride-request.operations.ts        # Request interfaces & enums
│   │   ├── shared/
│   │   │   └── notification.component.ts         # Reusable notifications
│   │   ├── app.routes.ts                         # Angular routing
│   │   ├── app.config.ts                         # Apollo & providers
│   │   └── graphql.config.ts                     # Apollo client factory
│   ├── main.ts                                    # Bootstrap entry point
│   ├── index.html                                # HTML root
│   └── styles.css                                # Global styles
├── server.js                                      # Express server
├── package.json                                   # Dependencies & scripts
├── angular.json                                   # Angular CLI config
├── tsconfig.json                                  # TypeScript config
├── public/                                        # Static assets
└── dist/                                          # Build output
```

## 🔐 Authentication Flow

1. **Initial Access**: User navigates to `/rides` (public page)
2. **Login Redirect**: User clicks login, redirected to external MPA:
   ```
   https://carpool-mpa-b2ab41ee1e9d.herokuapp.com/Login.html
   ```
3. **Token Return**: After successful login, MPA redirects back to SPA:
   ```
   /dashboard?token=xxx&userid=123&username=john
   ```
4. **Token Storage**: `AuthGuard` captures and stores token in localStorage:
   - `authToken`: JWT token
   - `userId`: User ID
   - `userName`: User name
5. **Request Authentication**: `AuthInterceptor` adds token to all API requests:
   ```
   Authorization: Bearer {token}
   ```
6. **Protected Routes**: Routes with `authGuard` require valid token
7. **Logout**: Clears localStorage and redirects to MPA home

## ⚙️ Configuration

### Environment Files

The application uses hardcoded API endpoints. To change them, update:

- `src/app/graphql.config.ts` - GraphQL endpoint
- `src/app/services/ride.service.ts` - REST API base URL
- `src/app/services/auth.service.ts` - Authentication URLs

### TypeScript Configuration

- **Strict Mode**: Enabled for type safety
- **Target**: ES2022
- **Module**: ES2022
- **ESModuleInterop**: Enabled

### Build Configuration

- **Initial Bundle Budget**: 500KB
- **Maximum Bundle Budget**: 1MB
- **Source Maps**: Enabled in development
- **Output Hashing**: Enabled for production

## 🎨 Design System

### Color Palette

- **Primary Gradient**: `#667eea` → `#764ba2` (Purple/Indigo)
- **Text**: High contrast for accessibility
- **Background**: Light neutral tones

### UI Components

- **Layout**: Sidebar navigation with main content area
- **Styling**: Vanilla CSS (no Bootstrap or Material)
- **Icons**: Unicode emojis for UI elements
- **Responsive**: Flexbox-based responsive design

## 🤝 Contributing

### Code Style

- Follow the `.editorconfig` settings:
  - UTF-8 encoding
  - 2-space indentation
  - Single quotes for TypeScript
  - LF line endings

### Component Guidelines

- Use **standalone components** (Angular 18 pattern)
- Implement **OnInit** lifecycle hook for initialization
- Use **RxJS observables** for reactive data
- Follow **Angular style guide** conventions

### Commit Messages

Follow conventional commit format:
```
feat: add ride filtering by price
fix: resolve GraphQL schema mismatch
docs: update README with API documentation
refactor: extract driver display logic to helper
```

## 📝 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with [Angular CLI](https://github.com/angular/angular-cli) 18.1.4
- GraphQL integration via [Apollo Client](https://www.apollographql.com/)
- Deployed on [Heroku](https://www.heroku.com/)

## 📞 Support

For issues and questions:
1. Check the existing documentation
2. Review the codebase structure
3. Contact the development team

---

**Last Updated**: November 2025
**Angular Version**: 18.1.0
**Node Version**: 20.x
