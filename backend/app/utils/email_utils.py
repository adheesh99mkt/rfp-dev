import smtplib
import imaplib
import email
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import decode_header
import os
from typing import List, Dict
import time
from imapclient import IMAPClient
from imapclient.exceptions import IMAPClientError
import pdfplumber
from io import BytesIO

class EmailSender:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER")
        self.smtp_port = int(os.getenv("SMTP_PORT", 587))
        self.email_address = os.getenv("EMAIL_ADDRESS")
        self.email_password = os.getenv("EMAIL_PASSWORD")
    
    def send_rfp(self, to_emails: List[str], subject: str, body: str, attachments: List[str] = None) -> bool:
        """
        Send RFP email to vendors
        """
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.email_address
            msg['To'] = ", ".join(to_emails)
            msg['Subject'] = subject
            
            # Add body to email
            msg.attach(MIMEText(body, 'plain'))
            
            # Add attachments if any
            if attachments:
                for file_path in attachments:
                    with open(file_path, "rb") as attachment:
                        part = MIMEText(attachment.read(), 'base64')
                        part.add_header(
                            'Content-Disposition',
                            f'attachment; filename= {os.path.basename(file_path)}'
                        )
                        msg.attach(part)
            
            # Create SMTP session
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()  # Enable security
            server.login(self.email_address, self.email_password)
            
            # Send email
            text = msg.as_string()
            server.sendmail(self.email_address, to_emails, text)
            server.quit()
            
            return True
        except Exception as e:
            print(f"Error sending email: {str(e)}")
            return False

class EmailReceiver:
    def __init__(self):
        self.imap_server = os.getenv("IMAP_SERVER")
        self.imap_port = int(os.getenv("IMAP_PORT", 993))
        self.email_address = os.getenv("IMAP_EMAIL")
        self.email_password = os.getenv("IMAP_PASSWORD")
    
    def poll_emails(self, folder: str = "INBOX") -> List[Dict]:
        """
        Poll emails from the inbox and return parsed emails
        """
        try:
            # Connect to the server
            with IMAPClient(self.imap_server, port=self.imap_port, ssl=True) as client:
                client.login(self.email_address, self.email_password)
                client.select_folder(folder)
                
                # Search for unseen emails
                messages = client.search(['UNSEEN'])
                
                emails = []
                for uid, message_data in client.fetch(messages, ['RFC822']).items():
                    email_message = email.message_from_bytes(message_data[b'RFC822'])
                    
                    # Parse email
                    parsed_email = self._parse_email(email_message)
                    parsed_email['uid'] = uid
                    emails.append(parsed_email)
                    
                    # Mark as seen
                    client.add_flags([uid], ['\\Seen'])
                
                return emails
        except IMAPClientError as e:
            print(f"IMAP error: {str(e)}")
            return []
        except Exception as e:
            print(f"Error polling emails: {str(e)}")
            return []
    
    def _parse_email(self, email_message) -> Dict:
        """
        Parse email message and extract content
        """
        # Decode the email subject
        subject = decode_header(email_message["Subject"])[0][0]
        if isinstance(subject, bytes):
            subject = subject.decode()
        
        # Extract sender
        from_ = email_message.get("From")
        
        # Extract body and attachments
        body = ""
        attachments = []
        
        if email_message.is_multipart():
            for part in email_message.walk():
                content_type = part.get_content_type()
                content_disposition = str(part.get("Content-Disposition"))
                
                try:
                    # Get the email body
                    if "attachment" not in content_disposition:
                        if content_type == "text/plain":
                            body = part.get_payload(decode=True).decode()
                        elif content_type == "text/html":
                            # For simplicity, we're not parsing HTML emails
                            pass
                    else:
                        # Handle attachments
                        filename = part.get_filename()
                        if filename:
                            # Check if it's a PDF
                            if filename.lower().endswith('.pdf'):
                                attachment_data = part.get_payload(decode=True)
                                pdf_text = self._extract_text_from_pdf(attachment_data)
                                attachments.append({
                                    'filename': filename,
                                    'content': pdf_text,
                                    'is_pdf': True
                                })
                except Exception as e:
                    print(f"Error parsing email part: {str(e)}")
        else:
            # Not multipart - get payload directly
            content_type = email_message.get_content_type()
            if content_type == "text/plain":
                body = email_message.get_payload(decode=True).decode()
            elif content_type == "text/html":
                # For simplicity, we're not parsing HTML emails
                pass
        
        return {
            "subject": subject,
            "from": from_,
            "body": body,
            "attachments": attachments
        }
    
    def _extract_text_from_pdf(self, pdf_data: bytes) -> str:
        """
        Extract text from PDF attachment
        """
        try:
            with pdfplumber.open(BytesIO(pdf_data)) as pdf:
                text = ""
                for page in pdf.pages:
                    text += page.extract_text() or ""
                return text
        except Exception as e:
            print(f"Error extracting text from PDF: {str(e)}")
            return ""