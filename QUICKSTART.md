# Quick Start Guide

This guide will help you get the AI-Powered RFP Management System up and running quickly.

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- PostgreSQL 12 or higher (or use SQLite for quick testing)
- OpenAI API key
- Gmail account with app password (for email integration)

## Quick Setup (5 minutes)

### 1. Clone and Navigate
```bash
cd rfp-dev
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

Edit `.env` file with your credentials:
```
DATABASE_URL=sqlite:///./rfp.db
OPENAI_API_KEY=your_openai_api_key
EMAIL_ADDRESS=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
IMAP_EMAIL=your_email@gmail.com
IMAP_PASSWORD=your_gmail_app_password
```

```bash
# Initialize database
python -m app.init_db

# Seed with sample data (optional)
python seed_data.py

# Start backend server
python -m app.main
```

Backend will run at: http://localhost:8000

### 3. Frontend Setup (New Terminal)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run at: http://localhost:5173

## Testing the Application

1. **Open your browser**: Navigate to http://localhost:5173

2. **Create an RFP**:
   - Click on "Create RFP" tab
   - Enter a natural language description like:
     ```
     I need to procure laptops and monitors for our new office. 
     Budget is $50,000 total. Need delivery within 30 days. 
     We need 20 laptops with 16GB RAM and 15 monitors 27-inch. 
     Payment terms should be net 30, and we need at least 1 year warranty.
     ```
   - Click "Generate RFP with AI"
   - Review and save the generated RFP

3. **Manage Vendors**:
   - Click on "Manage Vendors" tab
   - Add vendor information
   - Click "Add Vendor"

4. **Send RFP**:
   - From the created RFP, send to vendors
   - Check vendor emails for the RFP

5. **View Proposals**:
   - The system automatically polls for vendor responses
   - View proposals in the "Vendor Proposals" tab

6. **Compare Proposals**:
   - Click on "Compare Proposals" tab
   - Select an RFP
   - View AI-powered comparison and recommendations

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Troubleshooting

### Backend won't start
- Check if Python virtual environment is activated
- Verify all dependencies are installed: `pip list`
- Check if port 8000 is available

### Frontend won't start
- Check if Node modules are installed: `npm install`
- Verify port 5173 is available
- Clear npm cache: `npm cache clean --force`

### Database errors
- Ensure database URL is correct in `.env`
- Re-run database initialization: `python -m app.init_db`

### Email not working
- Verify Gmail app password is correct
- Enable "Less secure app access" or use App Password
- Check SMTP/IMAP settings

## Next Steps

1. Configure your OpenAI API key for AI features
2. Set up email credentials for sending/receiving RFPs
3. Add your own vendors
4. Create custom RFPs
5. Test the complete workflow

For detailed documentation, see the main README.md file.