# AI-Powered RFP Management System

A comprehensive web application that streamlines the RFP (Request for Proposal) workflow using AI to automate procurement processes.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Email Configuration](#email-configuration)
- [API Documentation](#api-documentation)
- [AI Integration](#ai-integration)
- [Usage Guide](#usage-guide)
- [Development Decisions & Assumptions](#development-decisions--assumptions)
- [AI Tools Usage](#ai-tools-usage)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)

## Overview

This system automates the traditionally manual and error-prone RFP process by leveraging AI to:
- Convert natural language procurement needs into structured RFPs
- Parse vendor responses (even messy emails with attachments) into structured data
- Compare proposals and provide AI-powered recommendations

## Features

1. **RFP Creation**
   - Natural language input for describing procurement needs
   - AI-powered conversion to structured RFP format
   - RFP editing and management

2. **Vendor Management**
   - Maintain vendor database with contact information
   - Select vendors for specific RFPs

3. **Email Integration**
   - Send RFPs to selected vendors via email
   - Receive and automatically parse vendor responses
   - Support for email attachments (including PDFs)

4. **Proposal Comparison**
   - Side-by-side comparison of vendor proposals
   - AI-powered scoring and recommendations
   - Exportable comparison reports

## Tech Stack

### Frontend
- React with Vite
- Tailwind CSS for styling
- Responsive design for all device sizes

### Backend
- Python FastAPI
- SQLAlchemy for ORM
- PostgreSQL database
- OpenAI API for AI capabilities
- LangChain for prompt engineering
- IMAPClient for email polling
- pdfplumber for PDF text extraction

### Infrastructure
- RESTful API architecture
- Environment-based configuration
- Modular, scalable design

## Architecture

```mermaid
graph TB
    A[Frontend - React] --> B[Backend API - FastAPI]
    B --> C[Database - PostgreSQL]
    B --> D[OpenAI API]
    B --> E[Email Services]
    E --> F[SMTP - Send Emails]
    E --> G[IMAP - Receive Emails]
```

The system follows a clean architecture pattern with:
- **Frontend**: User interface built with React
- **API Layer**: FastAPI backend exposing REST endpoints
- **Business Logic**: Core services handling RFP creation, vendor management, and proposal processing
- **AI Agents**: Specialized modules for natural language processing
- **Data Layer**: PostgreSQL database with SQLAlchemy ORM
- **External Services**: Email providers and OpenAI API

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL 12+
- OpenAI API key
- Email account with SMTP/IMAP access (Gmail recommended)

### Backend Setup

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

4. Initialize the database:
   ```bash
   python -m app.init_db
   ```

5. Start the backend server:
   ```bash
   python -m app.main
   ```
   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the backend directory based on `.env.example`:

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/rfp_db

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Email Configuration (SMTP for sending)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_ADDRESS=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Email Configuration (IMAP for receiving)
IMAP_SERVER=imap.gmail.com
IMAP_PORT=993
IMAP_EMAIL=your_email@gmail.com
IMAP_PASSWORD=your_app_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Database Setup

The system uses PostgreSQL. To set up the database:

1. Install PostgreSQL on your system
2. Create a new database:
   ```sql
   CREATE DATABASE rfp_db;
   ```
3. Update the `DATABASE_URL` in your `.env` file with your database credentials

The application will automatically create all necessary tables on first run.

### Email Configuration

For email integration, we recommend using Gmail:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use this app password in your `.env` file

## API Documentation

The backend exposes the following REST endpoints:

### RFP Endpoints
- `POST /api/v1/rfps/` - Create a new RFP
- `GET /api/v1/rfps/` - Get all RFPs
- `GET /api/v1/rfps/{rfp_id}` - Get a specific RFP

### Vendor Endpoints
- `POST /api/v1/vendors/` - Create a new vendor
- `GET /api/v1/vendors/` - Get all vendors

### Proposal Endpoints
- `POST /api/v1/proposals/` - Create a new proposal
- `GET /api/v1/proposals/` - Get all proposals

### AI Agent Endpoints
- `POST /api/v1/ai/create-rfp` - Convert natural language to structured RFP
- `POST /api/v1/ai/parse-response` - Parse vendor email response
- `POST /api/v1/ai/compare-proposals` - Compare proposals and generate recommendations

Example request to create RFP with AI:
```bash
curl -X POST http://localhost:8000/api/v1/ai/create-rfp \
  -H "Content-Type: application/json" \
  -d '{"prompt": "I need to procure laptops and monitors for our new office. Budget is $50,000 total. Need delivery within 30 days. We need 20 laptops with 16GB RAM and 15 monitors 27-inch. Payment terms should be net 30, and we need at least 1 year warranty."}'
```

## AI Integration

The system leverages OpenAI's GPT models through three specialized AI agents:

### 1. RFP Generator Agent
Converts natural language procurement needs into structured RFPs using prompt engineering with Pydantic models for output validation.

### 2. Response Parser Agent
Parses vendor email responses (including attachments) into structured proposal data, matching items with RFP requirements.

### 3. Comparison Agent
Analyzes multiple vendor proposals and generates comparative scores and recommendations based on pricing, terms, and completeness.

All AI interactions use LangChain for prompt management and output validation.

## Usage Guide

1. **Create an RFP**
   - Navigate to the "Create RFP" tab
   - Describe your procurement needs in natural language
   - Click "Generate RFP with AI"
   - Review and edit the generated RFP
   - Save the RFP

2. **Manage Vendors**
   - Go to the "Manage Vendors" tab
   - Add vendors to your database
   - Edit or remove existing vendors

3. **Send RFP to Vendors**
   - From the generated RFP, select "Send RFP to Vendors"
   - Choose vendors from your database
   - The system will email the RFP to selected vendors

4. **Receive Vendor Responses**
   - The system automatically polls your email inbox every 30 seconds
   - Vendor responses are parsed and converted to structured proposals
   - Proposals appear in the "Vendor Proposals" tab

5. **Compare Proposals**
   - Navigate to the "Compare Proposals" tab
   - Select an RFP to compare proposals for
   - View side-by-side comparison with AI-generated scores
   - Read the AI-powered recommendation for the best vendor

## Development Decisions & Assumptions

### Key Design Decisions

1. **Python/FastAPI Choice**: Chose Python/FastAPI over Node.js because:
   - Superior ecosystem for AI integration (Pydantic, LangChain)
   - Better type safety for ensuring LLM outputs match database schemas
   - More mature libraries for structured data extraction

2. **IMAP Polling**: Used IMAP polling instead of webhooks for email receiving because:
   - More reliable and easier to demo
   - Doesn't require complex tunneling solutions (ngrok)
   - Works consistently across different environments

3. **Component-Based Frontend**: Built modular React components for:
   - Reusability and maintainability
   - Clear separation of concerns
   - Easier testing and debugging

### Assumptions

1. **Email Format**: Assumes vendor responses will be in English and contain relevant pricing/term information
2. **PDF Handling**: Assumes PDF attachments contain text that can be extracted (not scanned images)
3. **Network Connectivity**: Assumes stable internet connection for API calls to OpenAI and email servers
4. **Data Privacy**: Assumes appropriate data handling procedures are in place for sensitive procurement information

## AI Tools Usage

During development, the following AI tools were used:

### Tools Utilized
- GitHub Copilot: Code completion and suggestions
- ChatGPT: Architecture design discussions and debugging assistance
- Claude: Prompt engineering refinement

### How They Helped
- **Boilerplate Generation**: Accelerated initial setup of FastAPI backend and React components
- **Debugging Assistance**: Helped resolve complex issues with email parsing and database relationships
- **Design Guidance**: Provided insights on best practices for AI integration and prompt engineering
- **Documentation**: Assisted in writing clear, comprehensive documentation

### Notable Prompts/Approaches
- Used Chain of Thought prompting for complex parsing tasks
- Implemented few-shot learning examples for consistent output formatting
- Leveraged function calling capabilities for structured data extraction

### Learnings
- Importance of specific, constrained prompts for consistent outputs
- Value of iterative refinement in prompt engineering
- Necessity of fallback mechanisms for handling parsing errors

## Known Limitations

1. **Email Parsing Accuracy**: May struggle with highly unstructured or ambiguous vendor responses
2. **PDF Handling**: Limited to text-based PDFs; cannot process scanned documents
3. **Language Support**: Currently optimized for English; other languages may have reduced accuracy
4. **Attachment Types**: Only supports PDF attachments; other formats are ignored
5. **Rate Limits**: Subject to OpenAI API rate limits during heavy usage

## Future Improvements

1. **Enhanced AI Capabilities**
   - Multi-language support
   - Improved handling of complex PDF documents
   - Integration with additional AI models for specialized tasks

2. **Advanced Features**
   - Real-time collaboration tools
   - Approval workflows for RFPs
   - Version control for RFP documents
   - Advanced analytics and reporting

3. **Infrastructure Enhancements**
   - Containerization with Docker
   - CI/CD pipeline implementation
   - Cloud deployment options
   - Enhanced security measures

4. **User Experience Improvements**
   - Mobile-responsive design
   - Dark mode support
   - Customizable dashboards
   - Advanced filtering and search capabilities

---

This system demonstrates how modern AI technologies can transform traditional business processes, reducing manual effort while improving accuracy and decision-making capabilities.