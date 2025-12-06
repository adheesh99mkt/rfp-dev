# Frontend - AI-Powered RFP Management System

This directory contains the frontend implementation of the AI-Powered RFP Management System, built with React and Vite.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Component Architecture](#component-architecture)

## Overview

The frontend provides a responsive user interface for managing the complete RFP workflow, from creation to vendor selection.

## Project Structure

```
frontend/
├── public/            # Static assets
├── src/
│   ├── components/    # React components
│   ├── assets/        # Images and other assets
│   ├── App.jsx        # Main application component
│   └── main.jsx       # Entry point
├── index.html         # HTML template
├── vite.config.js     # Vite configuration
├── tailwind.config.js # Tailwind CSS configuration
└── postcss.config.js  # PostCSS configuration
```

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Component Architecture

The frontend is organized into the following main components:

### RFPCreation
Handles the creation of new RFPs through natural language input and AI processing.

### VendorManagement
Manages the vendor database, including adding, editing, and removing vendors.

### ProposalManagement
Displays and manages vendor proposals received in response to RFPs.

### ProposalComparison
Provides side-by-side comparison of vendor proposals with AI-powered recommendations.

Each component is designed to be modular and reusable, following React best practices.