from app.utils.email_utils import EmailSender, EmailReceiver
from app.core.agents import ResponseParserAgent
from app.database import SessionLocal
from app.crud import proposal as proposal_crud, rfp as rfp_crud, vendor as vendor_crud
from typing import List, Dict
import asyncio
import time
import re

class EmailService:
    def __init__(self):
        self.sender = EmailSender()
        self.receiver = EmailReceiver()
        self.parser_agent = ResponseParserAgent()
    
    def send_rfp_to_vendors(self, to_emails: List[str], subject: str, body: str, attachments: List[str] = None) -> bool:
        """
        Send RFP email to vendors
        """
        return self.sender.send_rfp(to_emails, subject, body, attachments)
    
    def poll_vendor_responses(self, folder: str = "INBOX") -> List[Dict]:
        """
        Poll vendor responses from email
        """
        return self.receiver.poll_emails(folder)
    
    async def start_polling_service(self, interval: int = 30):
        """
        Start polling service to check for vendor responses
        """
        print("📧 Email polling service started (checking every 30 seconds)")
        
        while True:
            try:
                emails = self.poll_vendor_responses()
                
                if emails:
                    print(f"📬 Found {len(emails)} new email(s)")
                    
                    for email_data in emails:
                        try:
                            # Process each email
                            print(f"📧 Processing email from {email_data['from']} with subject: {email_data['subject']}")
                            
                            # Extract vendor email from "from" field
                            vendor_email = self._extract_email(email_data['from'])
                            
                            # Find vendor by email
                            db = SessionLocal()
                            vendor = vendor_crud.get_vendor_by_email(db, vendor_email)
                            
                            if not vendor:
                                print(f"⚠️  Vendor not found for email: {vendor_email}")
                                db.close()
                                continue
                            
                            # Extract RFP ID from subject (expecting format: "Re: RFP: Title")
                            rfp = None
                            rfps = rfp_crud.get_rfps(db)
                            for r in rfps:
                                if r.title.lower() in email_data['subject'].lower():
                                    rfp = r
                                    break
                            
                            if not rfp:
                                # Use the latest RFP as fallback
                                rfp = rfp_crud.get_rfps(db, skip=0, limit=1)
                                if rfp:
                                    rfp = rfp[0]
                            
                            if not rfp:
                                print(f"⚠️  No RFP found to associate with this email")
                                db.close()
                                continue
                            
                            print(f"✅ Matched RFP: {rfp.title} (ID: {rfp.id})")
                            print(f"✅ Matched Vendor: {vendor.name}")
                            
                            # Parse email body to extract proposal data
                            proposal_data = self._parse_proposal_from_email(email_data['body'], rfp, vendor)
                            
                            if proposal_data:
                                # Save proposal to database
                                db_proposal = proposal_crud.create_proposal(db, proposal_data)
                                print(f"💾 Proposal saved with ID: {db_proposal.id}")
                                print(f"   Total Price: ${proposal_data.total_price:,.2f}")
                            else:
                                print(f"⚠️  Could not parse proposal data from email")
                            
                            db.close()
                            
                        except Exception as e:
                            print(f"❌ Error processing email: {str(e)}")
                            import traceback
                            traceback.print_exc()
                
                # Wait for the specified interval
                await asyncio.sleep(interval)
                
            except Exception as e:
                print(f"❌ Error in polling service: {str(e)}")
                await asyncio.sleep(interval)
    
    def _extract_email(self, from_field: str) -> str:
        """
        Extract email address from 'from' field
        Example: 'John Doe <john@example.com>' -> 'john@example.com'
        """
        match = re.search(r'[\w\.-]+@[\w\.-]+', from_field)
        return match.group(0) if match else from_field
    
    def _parse_proposal_from_email(self, email_body: str, rfp, vendor):
        """
        Parse proposal details from email body
        """
        try:
            from app.schemas import ProposalCreate, ProposalItem
            
            # Extract total price
            total_price = 0.0
            price_match = re.search(r'[Tt]otal[:\s]+\$?([\d,]+\.?\d*)', email_body)
            if price_match:
                total_price = float(price_match.group(1).replace(',', ''))
            
            # Extract delivery terms
            delivery_terms = "Standard delivery"
            delivery_match = re.search(r'[Dd]elivery[:\s]+([^\n]+)', email_body)
            if delivery_match:
                delivery_terms = delivery_match.group(1).strip()
            
            # Extract payment terms
            payment_terms = "Net 30"
            payment_match = re.search(r'[Pp]ayment[:\s]+([^\n]+)', email_body)
            if payment_match:
                payment_terms = payment_match.group(1).strip()
            
            # Extract warranty
            warranty_match = re.search(r'[Ww]arranty[:\s]+(\d+)\s*(year|month)', email_body)
            warranty_period = 12  # default 12 months
            if warranty_match:
                period = int(warranty_match.group(1))
                unit = warranty_match.group(2).lower()
                warranty_period = period * 12 if unit == 'year' else period
            
            # Create proposal items for each RFP item
            items = []
            if rfp.items:
                price_per_unit = total_price / sum(item.quantity for item in rfp.items) if rfp.items else 0
                
                for rfp_item in rfp.items:
                    item_total = price_per_unit * rfp_item.quantity
                    items.append(ProposalItem(
                        rfp_item_id=rfp_item.id,
                        price_per_unit=price_per_unit,
                        total_price=item_total,
                        delivery_time=14,  # default 14 days
                        warranty_period=warranty_period,
                        specifications_match=True
                    ))
            
            proposal = ProposalCreate(
                rfp_id=rfp.id,
                vendor_id=vendor.id,
                items=items,
                total_price=total_price,
                delivery_terms=delivery_terms,
                payment_terms=payment_terms,
                validity_period=30,
                notes=f"Automatically imported from email on {time.strftime('%Y-%m-%d %H:%M:%S')}"
            )
            
            return proposal
            
        except Exception as e:
            print(f"Error parsing proposal: {str(e)}")
            import traceback
            traceback.print_exc()
            return None