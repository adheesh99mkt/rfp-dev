from app.utils.email_utils import EmailSender, EmailReceiver
from app.core.agents import ResponseParserAgent
from typing import List, Dict
import asyncio
import time

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
        while True:
            try:
                emails = self.poll_vendor_responses()
                for email_data in emails:
                    # Process each email
                    print(f"Processing email from {email_data['from']} with subject {email_data['subject']}")
                    # Here we would parse the email and save the proposal
                    # For now, we'll just print the data
                    print(f"Email body: {email_data['body'][:100]}...")
                    
                # Wait for the specified interval
                await asyncio.sleep(interval)
            except Exception as e:
                print(f"Error in polling service: {str(e)}")
                await asyncio.sleep(interval)