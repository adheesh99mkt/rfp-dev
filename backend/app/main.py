from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes
from app.init_db import init_db
import asyncio
from app.services.email_service import EmailService

app = FastAPI(
    title="AI-Powered RFP Management System",
    description="A system to streamline the RFP workflow using AI",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

# Include routers
app.include_router(routes.router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    # Start email polling service
    # Note: IMAP polling has a known error but emails will still be checked
    email_service = EmailService()
    asyncio.create_task(email_service.start_polling_service())

@app.get("/")
async def root():
    return {"message": "AI-Powered RFP Management System"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)