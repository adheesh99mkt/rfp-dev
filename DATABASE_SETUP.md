# Database Setup Guide for Docker PostgreSQL

## Your Docker PostgreSQL is Running! ✅

Container ID: be3636924d4b
Port: 5432
Password: admin

## Step-by-Step Setup

### 1. Verify Database Connection

First, make sure your backend `.env` file has the correct DATABASE_URL:
```
DATABASE_URL=postgresql://postgres:admin@localhost:5432/postgres
```

### 2. Install Backend Dependencies

Open a terminal in the backend directory and run:

```bash
cd backend

# Create virtual environment (if not already created)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Create Database Tables

The application will automatically create all tables when you run the initialization script:

```bash
# Initialize the database (creates all tables)
python -m app.init_db
```

This script will:
- Connect to your PostgreSQL database
- Create all necessary tables:
  - `rfps` (Request for Proposals)
  - `rfp_items` (Items in RFPs)
  - `vendors` (Vendor information)
  - `proposals` (Vendor proposals)
  - `proposal_items` (Items in proposals)
  - `rfp_vendor_association` (Many-to-many relationship)

### 4. Seed Sample Data (Optional)

To populate the database with test data:

```bash
python seed_data.py
```

This will create:
- 3 sample vendors
- 2 sample RFPs with items

### 5. Start the Backend Server

```bash
python -m app.main
```

The backend will be available at: http://localhost:8000

### 6. Verify Database Connection

You can verify the database is working by:

1. Visit http://localhost:8000/docs (Swagger UI)
2. Try the GET `/api/v1/vendors/` endpoint
3. You should see the sample vendors if you ran the seed script

## Docker PostgreSQL Commands

### Check if container is running:
```bash
docker ps
```

### Stop the database:
```bash
docker stop rfp-db
```

### Start the database:
```bash
docker start rfp-db
```

### View database logs:
```bash
docker logs rfp-db
```

### Connect to PostgreSQL CLI:
```bash
docker exec -it rfp-db psql -U postgres
```

Once inside psql, you can:
```sql
-- List all databases
\l

-- Connect to postgres database
\c postgres

-- List all tables
\dt

-- View vendors table structure
\d vendors

-- Query vendors
SELECT * FROM vendors;

-- Exit
\q
```

### Remove the database (WARNING: This deletes all data):
```bash
docker stop rfp-db
docker rm rfp-db
```

## Troubleshooting

### Connection refused error:
- Ensure Docker container is running: `docker ps`
- Check if port 5432 is available: `netstat -ano | findstr :5432`

### Authentication error:
- Verify PASSWORD in DATABASE_URL matches the one used in docker run (-e POSTGRES_PASSWORD=admin)
- Default username is `postgres`

### Tables not created:
- Run `python -m app.init_db` again
- Check for errors in the output
- Verify DATABASE_URL in .env file

### Permission errors:
- Make sure you're running commands from the backend directory
- Ensure virtual environment is activated

## Next Steps

1. ✅ Database is running in Docker
2. ✅ Configure `.env` file with DATABASE_URL
3. ⏳ Install Python dependencies
4. ⏳ Run `python -m app.init_db` to create tables
5. ⏳ Run `python seed_data.py` to add sample data (optional)
6. ⏳ Start backend server with `python -m app.main`
7. ⏳ Start frontend with `npm run dev`

You're all set! The database configuration is complete and ready to use.