Task Management Application
Frontend (React + TypeScript)
Architecture

# Technology Stack:

React with TypeScript
Material-UI v5 for UI components
Recoil for state management
Vite as build tool
Axios for API requests
Date-fns for date manipulation



# Frontend Project Structure
client/
├── src/
│   ├── components/
│   │   ├── TaskWrapper/      # Main container component
│   │   ├── TaskList/         # Task listing and item components
│   │   ├── TaskCreation/     # New task creation form
│   │   ├── TaskFilters/      # Search and filtering components
│   │   ├── TaskForm/         # Edit task modal
│   │   └── NotificationCenter/ # Global notification system
│   ├── constants/
│   │   └── task.ts          # Task-related constants and enums
│   ├── hooks/
│   │   ├── useTasks.ts      # Task operations hook
│   │   ├── useNotification.ts # Notification system hook
│   │   └── useDebounce.ts   # Debounce hook for search
│   ├── recoil/
│   │   └── atoms.ts         # Global state definitions
│   ├── services/
│   │   └── api.ts           # API service layer
│   ├── types/
│   │   ├── task.ts          # Task-related types
│   │   └── notification.ts   # Notification types
│   └── utils/
│       └── date.ts          # Date utility functions

## Features

# Task Management

View list of tasks with pagination
Create new tasks with form validation
Edit existing tasks
Delete tasks
Tags management


# Filtering & Search

Search tasks with debouncing
Filter by status and priority
Sort by different fields
Date range filtering


# User Interface

Responsive design
Loading states
Error handling
Notification system
Form validation
Date picker


# State Management (Recoil)

Task state
Filter state
Pagination state
Notification state

# Setup & Running

Install dependencies:

bashnpm install

Set up environment variables:

envVITE_API_URL=http://localhost:3000/api

Start development server:

bashnpm run dev

Backend (Node.js + Express + TypeScript)
Architecture

# Technology Stack:

Node.js with TypeScript
Express.js framework
JSON file-based storage
JWT for authentication
Express middleware for request handling



# Backend Project Structure
server/
├── src/
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
|   │-- constants/          # Constants
│   ├── middleware/         # Custom middleware
│   │   ├── auth.ts        # Authentication middleware
│   │   ├── error.ts       # Error handling
│   │   └── validate.ts    # Request validation
│   ├── models/            # Data models
│   ├── routes/            # Route definitions
│   ├── services/          # Business logic
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
└── _mockDB/              # Mock database files
Features

# RESTful API Endpoints

GET /tasks - List tasks with pagination
GET /tasks/:id - Get single task
POST /tasks - Create task
PUT /tasks/:id - Update task
DELETE /tasks/:id - Delete task

# Error Handling

Centralized error handling
Validation errors
Authentication errors
Not found errors

Data Validation

Input validation
Type checking
Request sanitization

# Setup & Running

Install dependencies:

bashnpm install

Set up environment variables:

envPORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key

Start development server:

bashnpm run dev
API Endpoints
Tasks
GET    /api/tasks       - Get all tasks (with filtering & pagination)
GET    /api/tasks/:id   - Get specific task
POST   /api/tasks       - Create new task
PUT    /api/tasks/:id   - Update task
DELETE /api/tasks/:id   - Delete task
Query Parameters:

page: Page number
limit: Items per page
status: Filter by status
priority: Filter by priority
search: Search in title/description
sortBy: Field to sort by
sortOrder: asc/desc

Error Handling
The API returns error responses in the following format:
json{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
Response Format
Successful responses follow this format:
json{
  "success": true,
  "data": [],
  "pagination": {
    "totalItems": 0,
    "totalPages": 0,
    "currentPage": 1,
    "itemsPerPage": 10
  }
}