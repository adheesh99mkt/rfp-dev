# Quick Command Reference

## Your Setup Status
- ✅ PostgreSQL running in Docker (Container: be3636924d4b)
- ✅ Database URL configured in `.env`
- ⏳ Ready to create tables and run the application

## Complete Setup Commands (Copy & Paste)

### Terminal 1 - Backend Setup

```powershell
# Navigate to backend directory
cd c:\sgs-adheesh\rfp-dev\backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create database tables
python -m app.init_db

# Seed sample data (optional but recommended)
python seed_data.py

# Start backend server
python -m app.main
```

**Backend will run at:** http://localhost:8000
**API Docs will be at:** http://localhost:8000/docs

---

### Terminal 2 - Frontend Setup

```powershell
# Navigate to frontend directory
cd c:\sgs-adheesh\rfp-dev\frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

**Frontend will run at:** http://localhost:5173

---

## Important: Update Your .env File

Before running the backend, update these values in `backend\.env`:

```env
# OpenAI API Key (REQUIRED for AI features)
OPENAI_API_KEY=sk-your-actual-openai-key-here

# Email Configuration (REQUIRED for email features)
EMAIL_ADDRESS=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
IMAP_EMAIL=your_email@gmail.com
IMAP_PASSWORD=your_gmail_app_password
```

---

## Verify Everything is Working

### 1. Check Database Connection
```powershell
# Connect to PostgreSQL
docker exec -it rfp-db psql -U postgres

# Inside psql:
\dt                    # List all tables (should show 6 tables)
SELECT * FROM vendors; # View sample vendors
\q                     # Exit
```

### 2. Check Backend API
- Open browser: http://localhost:8000/docs
- Try GET `/api/v1/vendors/` endpoint
- Should see sample vendors

### 3. Check Frontend
- Open browser: http://localhost:5173
- Navigate through all tabs
- UI should be fully functional

---

## What the init_db Script Does

When you run `python -m app.init_db`, it creates these tables:

1. **rfps** - Stores RFP information
2. **rfp_items** - Individual items in each RFP
3. **vendors** - Vendor contact information
4. **proposals** - Vendor responses to RFPs
5. **proposal_items** - Individual items in each proposal
6. **rfp_vendor_association** - Links RFPs to vendors (many-to-many)

---

## Common Issues & Solutions

### Issue: "ModuleNotFoundError"
**Solution:**
```powershell
# Make sure virtual environment is activated
venv\Scripts\activate
# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: "Connection to database failed"
**Solution:**
```powershell
# Check if Docker container is running
docker ps

# If not running, start it
docker start rfp-db
```

### Issue: "Port 8000 already in use"
**Solution:**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Issue: "npm install fails"
**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -r node_modules
rm package-lock.json

# Reinstall
npm install
```

---

## Database Management Commands

```powershell
# View container status
docker ps -a

# View logs
docker logs rfp-db

# Stop database
docker stop rfp-db

# Start database
docker start rfp-db

# Restart database
docker restart rfp-db

# Remove database (WARNING: Deletes all data!)
docker stop rfp-db
docker rm rfp-db
```

---

## After Setup is Complete

You'll be able to:
1. ✅ Create RFPs using natural language
2. ✅ Manage vendors (add, edit, delete)
3. ✅ Send RFPs to vendors via email
4. ✅ Receive and parse vendor responses automatically
5. ✅ Compare proposals with AI recommendations

---

## Ready to Go! 🚀

Just follow the commands above in order, and you'll have a fully functional RFP management system running locally!
