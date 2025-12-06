from app.database import engine, Base
from app.models import models

def init_db():
    """
    Initialize the database and create all tables
    """
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully!")

if __name__ == "__main__":
    init_db()