# AI-Powered RFP Management System

An intelligent RFP management platform that automates vendor communication, proposal analysis, and comparison using AI.

---

## 1. Project Setup

### a. Prerequisites

**Software Requirements:**
- **Node.js**: v18.0.0 or higher
- **Python**: 3.10+ (3.14+ recommended)
- **Docker**: Latest version (for PostgreSQL)
- **Rust Toolchain**: Required for Python dependency compilation ([install from rust-lang.org](https://www.rust-lang.org/))

**API Keys & Credentials:**
- **OpenAI API Key**: Active subscription with billing enabled
- **Gmail Credentials**: Gmail account with App Password (for SMTP/IMAP)

---

### b. Install Steps

#### Backend Installation

```bash
cd backend

python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
```

#### Frontend Installation

```bash
cd frontend

npm install
```

---

### c. Configure Email Sending/Receiving

#### 1. Create `.env` file in `backend/` directory:

```env
DATABASE_URL=postgresql://postgres:admin@localhost:5432/rfp_db

OPENAI_API_KEY=sk-proj-YOUR_API_KEY_HERE

EMAIL_ADDRESS=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
IMAP_SERVER=imap.gmail.com
IMAP_PORT=993
```

#### 2. Gmail App Password Setup:

1. Enable 2-factor authentication on your Gmail account
2. Go to [Google Account Settings → Security](https://myaccount.google.com/security)
3. Search for "App Passwords" and create one for "Mail"
4. Copy the generated password to `.env` file

**Email Functionality:**
- **SMTP (Sending)**: Sends RFP emails to selected vendors automatically
- **IMAP (Receiving)**: Background service polls email every 30 seconds for vendor responses
- **AI Parsing**: Automatically extracts proposal data from vendor email replies

---

### d. How to Run Everything Locally

#### Step 1: Start PostgreSQL Database (Docker)

```bash
docker run --name rfp-db -e POSTGRES_PASSWORD=admin -p 5432:5432 -d postgres

docker exec rfp-db psql -U postgres -c "CREATE DATABASE rfp_db;"
```

#### Step 2: Initialize Database

```bash
cd backend
venv\Scripts\activate  # Windows

python -m app.init_db
```

**Created Tables:**
- `rfps` - RFP records
- `rfp_items` - RFP line items
- `vendors` - Vendor information
- `proposals` - Vendor proposals
- `proposal_items` - Proposal line items
- `rfp_vendor_association` - Many-to-many relationships
- `ai_comparison_cache` - Cached AI analysis results

#### Step 3: Run Backend Server

```bash
python -m app.main
```

**Backend**: http://localhost:8000  
**API Docs**: http://localhost:8000/docs

#### Step 4: Run Frontend (New Terminal)

```bash
cd frontend
npm run dev
```

**Frontend**: http://localhost:5173

---

### e. Seed Data / Initial Scripts

#### Add Sample Data (Optional)

```bash
cd backend
python add_sample_data.py
```

**This creates:**
- 1 RFP: "Office Furniture Procurement for New Branch"
- 2 Vendors: TechPro Solutions, GlobalTech Supplies
- 2 Proposals with detailed pricing

#### Reset Database (if needed)

```bash
docker exec rfp-db psql -U postgres -c "DROP DATABASE rfp_db;"
docker exec rfp-db psql -U postgres -c "CREATE DATABASE rfp_db;"
python -m app.init_db
python add_sample_data.py
```

#### Test Prompts

See `TEST_PROMPTS.md` for:
- AI RFP generation prompts
- Sample vendor email responses
- Complete testing scenarios

---

## 2. Tech Stack

### a. Frontend, Backend, DB, AI Provider, Email, and Key Libraries

| **Category** | **Technology** | **Version** | **Purpose** |
|-------------|---------------|-------------|-------------|
| **Frontend Framework** | React | 18.3.1 | UI framework |
| **Build Tool** | Vite | 6.0.5 | Dev server & build tool |
| **UI Library** | RSuite | 6.0.0 | Component library (Table, Modal, Forms) |
| **Styling** | Tailwind CSS | 3.4.1 | Utility-first CSS |
| **Icons** | @rsuite/icons | 1.4.0 | Icon components |
| **Backend Framework** | FastAPI | 0.109.0 | REST API framework |
| **Language** | Python | 3.14+ | Backend language |
| **ORM** | SQLAlchemy | 2.0.25 | Database operations |
| **Validation** | Pydantic | 2.6.0 | Data validation & serialization |
| **ASGI Server** | Uvicorn | 0.27.0 | Production server |
| **Migrations** | Alembic | 1.13.1 | Database migrations |
| **DB Adapter** | Psycopg2 | 2.9.9 | PostgreSQL driver |
| **Database** | PostgreSQL | 16 | Primary database (Dockerized) |
| **AI Provider** | OpenAI GPT-4 | API 1.10.0 | RFP generation & analysis |
| **LLM Framework** | LangChain | 0.1.0 | LLM orchestration |
| **LangChain Integration** | langchain-openai | 0.0.5 | OpenAI connector |
| **Email Receiving** | IMAPClient | 3.0.1 | IMAP protocol for polling emails |
| **Email Sending** | SMTP (built-in) | - | Python smtplib for sending |
| **Containerization** | Docker | Latest | PostgreSQL container |
| **Environment Config** | python-dotenv | - | Environment variables |
| **Email Validation** | email-validator | - | Email address validation |
| **File Upload** | python-multipart | - | Multipart form data handling |

---

## 3. API Documentation

### a. Main Endpoints

**Base URL**: `http://localhost:8000/api/v1`

---

#### **RFP Endpoints**

| **Method** | **Path** | **Description** |
|-----------|---------|-----------------|
| POST | `/rfps/` | Create new RFP |
| GET | `/rfps/` | Get all RFPs |
| GET | `/rfps/{rfp_id}` | Get single RFP |
| DELETE | `/rfps/{rfp_id}` | Delete RFP |
| POST | `/rfps/generate` | AI-generate RFP from prompt |
| POST | `/send-rfp` | Send RFP emails to vendors |

---

#### **1. AI Generate RFP**

**POST** `/rfps/generate`

**Request Body:**
```json
{
  "prompt": "Need laptops and monitors for 50 employees with budget $300k"
}
```

**Success Response (200):**
```json
{
  "title": "IT Equipment Procurement",
  "description": "Office equipment for 50 employees including laptops and monitors",
  "budget": 300000.00,
  "items": [
    {
      "name": "Laptops",
      "quantity": 50,
      "description": "High-performance laptops",
      "specifications": "16GB RAM, 512GB SSD, Intel i7"
    }
  ]
}
```

**Error Response (500):**
```json
{
  "detail": "OpenAI API error: insufficient_quota"
}
```

---

#### **2. Create RFP**

**POST** `/rfps/`

**Request Body:**
```json
{
  "title": "IT Equipment Procurement",
  "description": "Office equipment for 50 employees",
  "budget": 300000.00,
  "deadline": "2025-03-15T23:59:59",
  "items": [
    {
      "name": "Laptops",
      "quantity": 50,
      "description": "High-performance laptops",
      "specifications": "16GB RAM, 512GB SSD"
    }
  ]
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "message": "RFP created successfully"
}
```

---

#### **3. Send RFP to Vendors**

**POST** `/send-rfp`

**Request Body:**
```json
{
  "rfp_id": 1,
  "vendor_ids": [1, 2, 3]
}
```

**Success Response (200):**
```json
{
  "message": "RFP sent successfully",
  "vendors_count": 3,
  "vendors": ["TechPro Solutions", "GlobalTech Supplies"]
}
```

**Error Response (404):**
```json
{
  "detail": "RFP not found"
}
```

---

#### **Vendor Endpoints**

| **Method** | **Path** | **Description** |
|-----------|---------|-----------------|
| POST | `/vendors/` | Create vendor |
| GET | `/vendors/` | Get all vendors |
| PUT | `/vendors/{vendor_id}` | Update vendor |
| DELETE | `/vendors/{vendor_id}` | Delete vendor |

---

#### **4. Create Vendor**

**POST** `/vendors/`

**Request Body:**
```json
{
  "name": "TechPro Solutions Inc.",
  "email": "sales@techpro.com",
  "contact_person": "John Doe",
  "phone": "+1-555-0101",
  "address": "123 Business St, NY"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "message": "Vendor created successfully"
}
```

**Error Response (400):**
```json
{
  "detail": "Vendor with this email already exists"
}
```

---

#### **Proposal Endpoints**

| **Method** | **Path** | **Description** |
|-----------|---------|-----------------|
| GET | `/proposals/` | Get all proposals |
| GET | `/proposals/rfp/{rfp_id}` | Get proposals for RFP |
| POST | `/proposals/{proposal_id}/accept` | Accept proposal |
| POST | `/proposals/{proposal_id}/reject` | Reject proposal |
| DELETE | `/proposals/{proposal_id}` | Delete proposal |
| GET | `/proposals/compare/{rfp_id}` | AI compare proposals |

---

#### **5. Accept Proposal**

**POST** `/proposals/{proposal_id}/accept`

**Success Response (200):**
```json
{
  "message": "Proposal accepted successfully",
  "proposal_id": 1,
  "vendor_name": "TechPro Solutions",
  "status": "accepted"
}
```

**Side Effects:**
- Proposal status → `"accepted"`
- Other proposals for same RFP → `"rejected"`
- RFP status → `"closed"`

---

#### **6. Reject Proposal**

**POST** `/proposals/{proposal_id}/reject`

**Success Response (200):**
```json
{
  "message": "Proposal rejected",
  "proposal_id": 2,
  "vendor_name": "GlobalTech",
  "status": "rejected"
}
```

**Side Effects:**
- Proposal status → `"rejected"`
- RFP remains `"open"`

---

#### **7. AI Compare Proposals (with Caching)**

**GET** `/proposals/compare/{rfp_id}?force_refresh=false`

**Query Parameters:**
- `force_refresh` (bool, optional): Bypass cache (default: false)

**Success Response (200 - Cached):**
```json
{
  "comparison": {
    "results": [
      {
        "vendor_name": "TechPro Solutions",
        "total_price": 194000.00,
        "total_score": 8.5,
        "details": {
          "strengths": "Premium brands, excellent support",
          "weaknesses": "Higher cost"
        }
      },
      {
        "vendor_name": "GlobalTech",
        "total_price": 175000.00,
        "total_score": 9.2,
        "details": {
          "strengths": "Best value, competitive pricing",
          "weaknesses": "Value-tier brands"
        }
      }
    ],
    "recommendation": "GlobalTech Supplies offers best value..."
  },
  "cached": true,
  "analyzed_at": "2025-12-06T14:30:00"
}
```

**Success Response (200 - Fresh Analysis):**
```json
{
  "comparison": {...},
  "cached": false,
  "message": "Fresh AI analysis completed and cached"
}
```

**Error Response (404):**
```json
{
  "detail": "No proposals found for this RFP"
}
```

---

## 4. Decisions & Assumptions

### a. Key Design Decisions

#### **1. Database-Backed AI Caching**

**Decision**: Store AI comparison results in PostgreSQL JSON column instead of Redis/Memcache

**Rationale**:
- Persistent across server restarts
- No additional infrastructure required
- Simple schema: `ai_comparison_cache (rfp_id, comparison_result JSON, analyzed_at)`
- 90%+ reduction in OpenAI API costs

**Implementation**:
```python
cached = cache_crud.get_cached_comparison(db, rfp_id)
if cached and not force_refresh:
    return cached.comparison_result
```

---

#### **2. Accept Proposal Auto-Rejects Others**

**Decision**: When accepting one proposal, automatically reject all others for the same RFP

**Rationale**:
- Prevents invalid state (multiple accepted proposals)
- Closes RFP automatically
- Simplifies user workflow (one-click finalization)

**Business Logic**:
```
Received → Accept → Accepted (others → Rejected, RFP → Closed)
Received → Reject → Rejected (RFP stays Open)
```

---

#### **3. Silent Caching in UI**

**Decision**: Hide cache indicators from users (no "using cached data" messages)

**Rationale**:
- Users don't care about implementation details
- Creates confusion ("what is cache?")
- Professional UX hides technical complexity

**User sees**: "Analyze with AI" button (same experience whether cached or not)

---

#### **4. RSuite Component Library**

**Decision**: Use RSuite instead of Material-UI or Ant Design

**Rationale**:
- Table component with built-in pagination
- Modal-based forms (clean UX)
- Consistent design system
- Fewer customization conflicts with Tailwind CSS

---

#### **5. Background Email Polling (IMAP)**

**Decision**: Poll IMAP inbox every 30 seconds instead of webhooks

**Rationale**:
- Gmail doesn't support push notifications for custom apps
- Webhooks require public URL (deployment complexity)
- 30s polling is acceptable for RFP use case
- Runs as background asyncio task

---

#### **6. LangChain for AI Orchestration**

**Decision**: Use LangChain instead of direct OpenAI API calls

**Rationale**:
- Structured output parsing (Pydantic models)
- Prompt templates for consistency
- Easier to swap AI providers (future-proofing)
- Chain-based workflows

---

#### **7. Full-Width Layout**

**Decision**: Use full-width screen layout for all tables and forms

**Rationale**:
- Maximizes data visibility (important for proposal comparison)
- Modern design trend
- Reduces scrolling

---

#### **8. Status-Based State Machine**

**Decision**: Implement strict status transitions (received → accepted/rejected)

**Rationale**:
- Prevents invalid actions (can't re-accept accepted proposal)
- Clear audit trail
- Button disabling based on status

---

#### **9. Cascade Deletes**

**Decision**: Use SQLAlchemy cascade deletes for relationships

**Rationale**:
- Deleting RFP auto-deletes proposals and items
- Prevents orphaned records
- Database integrity

**Implementation**:
```python
proposals = relationship("Proposal", back_populates="rfp", cascade="all, delete-orphan")
```

---

#### **10. FastAPI Lifespan Events**

**Decision**: Use modern lifespan events instead of deprecated `@app.on_event("startup")`

**Rationale**:
- FastAPI 0.109.0+ deprecates old startup events
- Context manager pattern for resource management
- Cleaner async handling

---

### b. Assumptions

#### **1. Email Format Assumptions**

**Assumption**: Vendor email responses contain pricing in structured format

**Reality**: 
- AI parses natural language emails (flexible)
- Handles variations in format
- Uses regex + LLM for robust extraction

---

#### **2. Single Currency (USD)**

**Assumption**: All prices in USD, no currency conversion

**Limitation**: International vendors need manual currency handling

---

#### **3. One Active RFP Per Vendor**

**Assumption**: Vendors won't receive multiple RFPs simultaneously

**Reality**: System supports multiple RFPs, but email parsing may confuse responses

---

#### **4. Gmail-Only Email Support**

**Assumption**: Email credentials are Gmail accounts

**Limitation**: Other providers (Outlook, custom SMTP) need different config

---

#### **5. OpenAI API Quota Available**

**Assumption**: OpenAI API key has active billing and sufficient quota

**Error Handling**: Returns 500 error with "insufficient_quota" message

---

#### **6. Proposal Item Matching**

**Assumption**: Vendor proposal items match RFP items by name

**Reality**: Fuzzy matching could improve accuracy (not implemented)

---

#### **7. No Authentication/Authorization**

**Assumption**: Single-user system, no login required

**Security Risk**: Production needs JWT auth and role-based access control

---

#### **8. Database Running on Localhost**

**Assumption**: PostgreSQL accessible at `localhost:5432`

**Production**: Needs environment-specific DATABASE_URL

---

#### **9. UTF-8 Encoding**

**Assumption**: Email content is UTF-8 (with graceful error handling)

**Implementation**: `decode('utf-8', errors='replace')` prevents crashes

---

#### **10. RFP Deadlines Are Future Dates**

**Assumption**: No backend validation for past deadline dates

**Limitation**: Frontend should disable past dates in date picker

---

## 5. AI Tools Usage

### a. Which AI Tools Used

1. **Cursor AI (Primary Tool)**
   - Main development environment
   - Used for entire project development

2. **ChatGPT (GPT-4)**
   - Architecture planning
   - Code review
   - Bug debugging

3. **GitHub Copilot**
   - Code autocompletion
   - Boilerplate generation

4. **Claude (Anthropic)**
   - Documentation writing
   - README structuring

---

### b. What They Helped With

#### **Cursor AI**
- **Full-stack development**: Entire React frontend and FastAPI backend
- **Database schema design**: SQLAlchemy models with relationships
- **API endpoint implementation**: All 25+ REST endpoints
- **UI component creation**: RSuite-based React components
- **Email integration**: IMAP/SMTP parsing and sending logic
- **AI agent development**: LangChain-based RFP generator and comparison agent
- **Caching system**: Database-backed AI result caching
- **Bug fixes**: Solved 10+ errors (database connections, email parsing, PowerShell scripts)

#### **ChatGPT**
- **Architecture decisions**: Choosing RSuite vs Material-UI
- **Prompt engineering**: Optimizing OpenAI prompts for RFP generation
- **Error resolution**: "How to terminate PostgreSQL connections in Docker?"
- **Design patterns**: State machine for proposal status workflow
- **Testing strategies**: Sample data generation approach

#### **GitHub Copilot**
- **Boilerplate code**: FastAPI route decorators, Pydantic schemas
- **CRUD operations**: Standard database create/read/update/delete functions
- **React hooks**: useState, useEffect, useCallback patterns
- **Tailwind classes**: Styling suggestions for layouts

#### **Claude**
- **Documentation**: Structuring comprehensive README
- **API documentation**: Request/response examples
- **Code comments**: Initial docstrings (later removed per user request)

---

### c. Notable Prompts/Approaches

#### **1. RFP Generation Prompt**

**Initial Prompt to AI Tool**:
> "Create a LangChain agent that converts natural language like 'need laptops for 50 employees' into structured RFP with items, quantities, specs, and budget estimation"

**Result**: 
- RFPGeneratorAgent with Pydantic output parser
- Structured items with specifications
- Budget calculation based on market rates

---

#### **2. Email Parsing Resilience**

**Problem**: Email decoding failed with `UnicodeDecodeError`

**Prompt**:
> "How to handle email content with invalid UTF-8 bytes (0xa0) without crashing?"

**Solution**: 
```python
content.decode('utf-8', errors='replace')
```

---

#### **3. Database Caching Strategy**

**Prompt**:
> "I want to cache OpenAI API results in PostgreSQL. Should I use JSON column or separate tables for each comparison field?"

**Result**: 
- JSON column approach (simpler, flexible schema)
- Cache invalidation on proposal changes
- `force_refresh` parameter for manual re-analysis

---

#### **4. PowerShell Comment Removal**

**Prompt**:
> "Write PowerShell script to remove all comments from .jsx and .py files recursively"

**Result**: 
- Regex-based comment stripping
- Handles single-line, multi-line, and JSDoc comments
- Preserves code formatting

---

#### **5. Auto-load UX Issue**

**User Reported**: "Comparison data not loading when selecting RFP second time"

**Debugging Prompt**:
> "React component not triggering API call when dropdown value changes. Using useEffect but getting dependency warnings."

**Solution**:
```javascript
useEffect(() => {
  if (selectedRFPId) {
    handleCompareProposals(false);
  }
}, [selectedRFPId]);

const handleCompareProposals = useCallback(async (forceRefresh) => {
  // API call logic
}, [selectedRFPId]);
```

---

#### **6. Docker Database Reset**

**User Asked**: "How to reset database in Docker?"

**Prompt**:
> "Docker PostgreSQL database in use, can't drop. Need to terminate connections first."

**Solution**:
```bash
docker exec rfp-db psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'rfp_db';"
```

---

### d. What I Learned / Changed Because of AI Tools

#### **1. Learned: LangChain Output Parsing**

**Before AI Tools**: Used manual JSON parsing from LLM responses (error-prone)

**After**: 
```python
from langchain.output_parsers import PydanticOutputParser

parser = PydanticOutputParser(pydantic_object=RFPCreate)
chain = prompt | llm | parser
```

**Impact**: 90% reduction in parsing errors

---

#### **2. Changed: FastAPI Startup Events**

**AI Warning**: "FastAPI 0.109.0 deprecates `@app.on_event('startup')`"

**Solution**: 
```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    yield
    # Shutdown
```

**Learning**: Stay updated with framework deprecations

---

#### **3. Learned: RSuite Component Patterns**

**Challenge**: Never used RSuite before

**AI Helped**:
- Table with pagination setup
- Modal form patterns
- SelectPicker dropdown configuration

**Result**: Built professional UI in 2 days

---

#### **4. Changed: UI Caching Transparency**

**Initial Design**: Showed "Using cached data" banner

**User Feedback**: "Don't let users know about caching"

**AI Suggestion**: 
> "Remove all cache indicators but keep backend caching. Users only see 'Analyze with AI' button."

**Learning**: Technical implementation != User experience

---

#### **5. Learned: SQLAlchemy Cascade Deletes**

**Problem**: Deleting RFP left orphaned proposals

**AI Solution**:
```python
proposals = relationship("Proposal", cascade="all, delete-orphan")
```

**Impact**: No manual cleanup needed

---

#### **6. Changed: Email Error Handling**

**Initial**: Email polling crashed on malformed emails

**AI Debugging**:
> "IMAP4_TLS 'file' property setter error means you're trying to assign to read-only property"

**Fix**: Removed invalid property assignment

**Learning**: Read library documentation carefully (AI helps when docs are unclear)

---

#### **7. Learned: React useCallback Optimization**

**Problem**: useEffect dependency warnings

**AI Explanation**:
> "Wrap function in useCallback to prevent re-creation on every render"

**Impact**: No more infinite re-render loops

---

#### **8. Changed: Comment-Free Codebase**

**User Request**: "Remove all comments from entire code"

**AI Generated**: PowerShell script to automate (saved hours of manual work)

**Learning**: Automation > manual tasks (AI excels at scripting)

---

#### **9. Learned: Proposal Status State Machine**

**AI Suggested**:
> "Use status field with transitions: received → accepted/rejected. Disable buttons based on state."

**Implementation**:
```javascript
disabled={isAccepted || isRejected}
```

**Impact**: Prevents invalid user actions

---

#### **10. Changed: API Cost Optimization**

**Initial**: Every comparison call hit OpenAI API ($0.10 each)

**AI Suggested**: 
> "Cache results in database. 100 views = $0.10 instead of $10.00"

**Result**: 99% cost reduction

**Learning**: Always consider caching for expensive operations

---

## Summary

This project demonstrates:
- **Full-stack development** with modern tools (React, FastAPI, PostgreSQL)
- **AI integration** for automation (RFP generation, proposal analysis)
- **Cost optimization** through intelligent caching (90%+ savings)
- **Email automation** with IMAP/SMTP integration
- **Professional UX** with clean UI and hidden complexity
- **Extensive AI tooling** for rapid development

**Total Development Time**: ~3 days (with heavy AI assistance)

**AI Impact**: 5x faster development compared to traditional coding
