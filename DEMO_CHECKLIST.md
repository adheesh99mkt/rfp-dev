# Demo Video Checklist

This checklist will help you prepare a comprehensive 5-10 minute demo video for the AI-Powered RFP Management System.

## Pre-Demo Setup (Complete Before Recording)

### Environment Setup
- [ ] Backend server running at http://localhost:8000
- [ ] Frontend server running at http://localhost:5173
- [ ] Database initialized with `python -m app.init_db`
- [ ] Sample data loaded with `python seed_data.py`
- [ ] Environment variables configured in `.env`
- [ ] OpenAI API key configured and working
- [ ] Email credentials configured

### Test Data Preparation
- [ ] At least 2-3 vendors created in the system
- [ ] Sample RFP ready to demonstrate
- [ ] Prepare a natural language input for RFP creation
- [ ] Have a sample vendor response email ready (or create one)

## Demo Script (5-10 minutes)

### Part 1: Introduction (30 seconds)
**What to show:**
- Open the application at http://localhost:5173
- Brief overview of the main navigation tabs
- Explain the problem the system solves

**Script:**
"This is an AI-powered RFP management system that streamlines procurement workflows. It helps procurement managers create RFPs, manage vendors, send RFPs via email, receive and parse vendor responses automatically, and compare proposals using AI."

### Part 2: Create RFP with AI (2 minutes)
**What to show:**
- Navigate to "Create RFP" tab
- Paste a natural language description
- Click "Generate RFP with AI"
- Show the AI-generated structured RFP
- Edit fields if needed
- Save the RFP

**Example Input:**
```
I need to procure laptops and monitors for our new office. 
Budget is $50,000 total. Need delivery within 30 days. 
We need 20 laptops with 16GB RAM and 15 monitors 27-inch. 
Payment terms should be net 30, and we need at least 1 year warranty.
```

**Key Points to Highlight:**
- Natural language input
- AI parsing and structuring
- Editable generated output
- Automatic item extraction

### Part 3: Vendor Management (1 minute)
**What to show:**
- Navigate to "Manage Vendors" tab
- Show existing vendors
- Add a new vendor (briefly)
- Demonstrate edit/delete functionality

**Key Points to Highlight:**
- Simple vendor database
- Full CRUD operations
- Vendor contact information storage

### Part 4: Send RFP via Email (1 minute)
**What to show:**
- Select the created RFP
- Click "Send RFP to Vendors"
- Select vendors to receive the RFP
- Show confirmation message
- (Optional) Show the actual email received by vendor

**Key Points to Highlight:**
- Automated email generation
- Multi-vendor distribution
- Professional email formatting

### Part 5: Vendor Response Parsing (2 minutes)
**What to show:**
- Navigate to "Vendor Proposals" tab
- Show how the system polls emails automatically
- Display a parsed vendor response
- Show extracted data (prices, terms, etc.)
- View proposal details

**Key Points to Highlight:**
- Automatic email polling (IMAP)
- AI-powered parsing of unstructured responses
- Extraction of pricing, delivery times, warranty info
- Support for messy, free-form vendor responses

### Part 6: Proposal Comparison (2 minutes)
**What to show:**
- Navigate to "Compare Proposals" tab
- Select an RFP with multiple proposals
- Show side-by-side comparison
- Highlight AI-generated scores
- Show AI recommendation section

**Key Points to Highlight:**
- Automated scoring system
- Multiple evaluation criteria (price, terms, completeness)
- AI-powered recommendation
- Clear comparison visualization

### Part 7: Code Walkthrough (2 minutes)
**What to show:**
Open your code editor and briefly show:
- Project structure (frontend/backend separation)
- AI agents in `backend/app/core/agents.py`
- Email integration in `backend/app/utils/email_utils.py`
- React components in `frontend/src/components/`
- Database models in `backend/app/models/models.py`

**Key Points to Highlight:**
- Clean architecture
- Separation of concerns
- Use of Pydantic for data validation
- LangChain for AI prompting
- Modular component design

### Part 8: Conclusion (30 seconds)
**What to say:**
- Recap key features
- Mention tech stack (Python/FastAPI, React, OpenAI, PostgreSQL)
- Highlight AI integration benefits
- Thank the viewer

## Recording Tips

### Technical Setup
- [ ] Use screen recording software (OBS, Loom, QuickTime)
- [ ] Set resolution to 1920x1080 or 1280x720
- [ ] Enable microphone for narration
- [ ] Close unnecessary applications
- [ ] Clear browser cache and history

### Presentation Tips
- [ ] Speak clearly and at a moderate pace
- [ ] Use cursor highlighting or zoom for small text
- [ ] Practice transitions between sections
- [ ] Have water nearby
- [ ] Do a test recording first

### Things to Avoid
- [ ] Don't show your actual API keys or passwords
- [ ] Don't show real email addresses (use test accounts)
- [ ] Don't spend too much time on any single feature
- [ ] Don't apologize for limitations (mention them in notes instead)

## Post-Recording

### Video Editing
- [ ] Trim dead air at beginning/end
- [ ] Add title slide with project name
- [ ] Add text overlays for section titles (optional)
- [ ] Export in high quality (1080p recommended)

### Upload
- [ ] Upload to Loom, Google Drive, or YouTube
- [ ] Set sharing permissions to "Anyone with link"
- [ ] Test the link in incognito mode
- [ ] Note the video link for submission

### Final Check
- [ ] Video is 5-10 minutes long
- [ ] All required features are demonstrated
- [ ] Code walkthrough is included
- [ ] Audio is clear
- [ ] Link is accessible

## Additional Notes Section Ideas

After your demo, consider adding notes about:
- Known limitations (e.g., "PDF parsing works best with text-based PDFs")
- What you would do next (e.g., "Add user authentication", "Implement approval workflows")
- Challenges you overcame
- Interesting technical decisions
- How AI tools helped in development

Good luck with your demo! 🚀