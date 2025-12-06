from app.database import SessionLocal
from app.crud import rfp as rfp_crud, vendor as vendor_crud
from app.schemas import RFPCreate, RFPItem, VendorCreate
from datetime import datetime, timedelta

def seed_database():
    """
    Seed the database with sample data for testing
    """
    db = SessionLocal()
    
    try:
        # Create sample vendors
        vendors_data = [
            VendorCreate(
                name="Tech Solutions Inc.",
                email="contact@techsolutions.com",
                contact_person="John Smith",
                phone="+1 (555) 123-4567",
                address="123 Tech Street, San Francisco, CA 94103"
            ),
            VendorCreate(
                name="Global Electronics Ltd.",
                email="info@globalelectronics.com",
                contact_person="Sarah Johnson",
                phone="+1 (555) 987-6543",
                address="456 Electronic Ave, New York, NY 10001"
            ),
            VendorCreate(
                name="Premier Office Supplies",
                email="sales@premieroffice.com",
                contact_person="Michael Brown",
                phone="+1 (555) 456-7890",
                address="789 Business Blvd, Chicago, IL 60601"
            )
        ]
        
        print("Creating vendors...")
        for vendor_data in vendors_data:
            existing_vendor = vendor_crud.get_vendor_by_email(db, vendor_data.email)
            if not existing_vendor:
                vendor_crud.create_vendor(db, vendor_data)
                print(f"Created vendor: {vendor_data.name}")
            else:
                print(f"Vendor already exists: {vendor_data.name}")
        
        # Create sample RFPs
        rfps_data = [
            RFPCreate(
                title="Office Equipment Procurement",
                description="Procurement of laptops and monitors for new office setup",
                budget=50000.0,
                deadline=datetime.now() + timedelta(days=30),
                items=[
                    RFPItem(
                        name="Laptop",
                        quantity=20,
                        description="Business laptops for employees",
                        specifications="16GB RAM, 512GB SSD, Intel i7 processor"
                    ),
                    RFPItem(
                        name="Monitor",
                        quantity=15,
                        description="Desktop monitors for workstations",
                        specifications="27-inch, 4K resolution"
                    )
                ],
                delivery_terms="Delivery within 30 days of order confirmation",
                payment_terms="Net 30 payment terms",
                warranty_requirements="Minimum 1 year warranty on all equipment"
            ),
            RFPCreate(
                title="Software Licensing RFP",
                description="Procurement of software licenses for the team",
                budget=25000.0,
                deadline=datetime.now() + timedelta(days=45),
                items=[
                    RFPItem(
                        name="Project Management Software",
                        quantity=50,
                        description="Cloud-based project management tool licenses",
                        specifications="Supports team collaboration, time tracking, and reporting"
                    ),
                    RFPItem(
                        name="Design Software",
                        quantity=10,
                        description="Professional design software licenses",
                        specifications="Industry-standard design and illustration tools"
                    )
                ],
                delivery_terms="Immediate delivery after purchase",
                payment_terms="Net 15 payment terms",
                warranty_requirements="12-month support and updates"
            )
        ]
        
        print("\\nCreating RFPs...")
        for rfp_data in rfps_data:
            rfp_crud.create_rfp(db, rfp_data)
            print(f"Created RFP: {rfp_data.title}")
        
        print("\\nDatabase seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()