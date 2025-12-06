# Backend - AI-Powered RFP Management System

This directory contains the backend implementation of the AI-Powered RFP Management System, built with Python FastAPI.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)

## Overview

The backend provides RESTful APIs for managing RFPs, vendors, and proposals, along with AI-powered processing capabilities for natural language understanding and vendor response parsing.

## Project Structure

```
backend/
├── app/
│   ├── api/           # API route definitions
│   ├── core/          # Business logic and AI agents
│   ├── database/      # Database configuration
│   ├── models/        # Database models
│   ├── schemas/       # Pydantic schemas for data validation
│   ├── services/      # Business services
│   ├── utils/         # Utility functions
│   ├── init_db.py     # Database initialization script
│   └── main.py        # Application entry point
├── requirements.txt   # Python dependencies
└── .env.example      # Environment variable examples
```

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

Copy the example environment file and configure your settings:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
- Database connection string
- OpenAI API key
- Email server settings

## Running the Application

Initialize the database:
```bash
python -m app.init_db
```

Start the development server:
```bash
python -m app.main
```

The API will be available at `http://localhost:8000`.

## API Documentation

Once the server is running, you can access the interactive API documentation:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Database Schema

The application uses the following database tables:

### RFPs
Stores information about requests for proposals.

### Vendors
Maintains a database of vendors and their contact information.

### Proposals
Contains vendor responses to RFPs with pricing and terms.

### Relationships
- Many-to-many relationship between RFPs and Vendors
- One-to-many relationship between RFPs and Proposals
- One-to-many relationship between Vendors and Proposals