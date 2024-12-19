Task Management Application
Frontend (React + TypeScript)
Architecture

## Technology Stack:

React with TypeScript
Material-UI v5 for UI components
Recoil for state management
Vite as build tool
Axios for API requests
Date-fns for date manipulation


## Features

## Task Management

View list of tasks with pagination
Create new tasks with form validation
Edit existing tasks
Delete tasks
Tags management


## Filtering & Search

Search tasks with debouncing
Filter by status and priority
Sort by different fields
Date range filtering


## User Interface

Responsive design
Loading states
Error handling
Notification system
Form validation
Date picker


## State Management (Recoil)

Task state
Filter state
Pagination state
Notification state

## Setup & Running

Install dependencies:

npm run install:all

Set up environment variables:

.env in client folder:VITE_API_URL=http://localhost:3000/api

.env in server folder:
PORT=3000
NODE_ENV=development
DB_FILE_PATH=./_mockDB/tasks.json
DB_BACKUP_PATH=./_mockDB/backup/


Start development server concurrently from root directory run:

npm run dev



Backend (Node.js + Express + TypeScript)
Architecture

## Technology Stack:

Node.js with TypeScript
Express.js framework
JSON file-based storage
JWT for authentication
Express middleware for request handling


## RESTful API Endpoints

GET /tasks - List tasks with pagination
GET /tasks/:id - Get single task
POST /tasks - Create task
PUT /tasks/:id - Update task
DELETE /tasks/:id - Delete task

## Error Handling

Centralized error handling
Validation errors
Authentication errors
Not found errors

Data Validation

Input validation
Type checking
Request sanitization


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