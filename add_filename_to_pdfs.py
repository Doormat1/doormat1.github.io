import os
import glob
from pathlib import Path
from PyPDF2 import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from io import BytesIO

def add_filename_to_pdf(pdf_path, filename_text):
    """Add filename text to top left corner of every page in a PDF."""
    try:
        # Read the existing PDF
        reader = PdfReader(pdf_path)
        writer = PdfWriter()
        
        # Get the page size from the first page
        first_page = reader.pages[0]
        page_width = float(first_page.mediabox.width)
        page_height = float(first_page.mediabox.height)
        
        # Create a BytesIO object to hold the overlay
        packet = BytesIO()
        can = canvas.Canvas(packet, pagesize=(page_width, page_height))
        
        # Set font and size
        can.setFont("Helvetica", 10)
        
        # Add text to top left corner (with small margin)
        can.drawString(10, page_height - 20, filename_text)
        
        can.save()
        
        # Move to the beginning of the BytesIO object
        packet.seek(0)
        overlay_reader = PdfReader(packet)
        overlay_page = overlay_reader.pages[0]
        
        # Add the overlay to each page
        for page_num, page in enumerate(reader.pages):
            page.merge_page(overlay_page)
            writer.add_page(page)
        
        # Write the output PDF
        with open(pdf_path, 'wb') as output_file:
            writer.write(output_file)
        
        return True
    except Exception as e:
        print(f"Error processing {pdf_path}: {str(e)}")
        return False

def main():
    # Path to search
    search_path = "G:/My Drive/Past Papers"
    
    # Check if the path exists
    if not os.path.exists(search_path):
        print(f"Path not found: {search_path}")
        return
    
    # Find all PDF files
    pdf_files = glob.glob(os.path.join(search_path, "**/*.pdf"), recursive=True)
    
    if not pdf_files:
        print(f"No PDF files found in {search_path}")
        return
    
    print(f"Found {len(pdf_files)} PDF files")
    
    # Filter and process
    processed_count = 0
    for pdf_file in pdf_files:
        filename = os.path.basename(pdf_file)
        
        # Check if filename contains "2024" and does NOT contain "questions"
        if "2024" in filename and "questions" not in filename.lower():
            print(f"Processing: {filename}")
            
            # Remove .pdf extension for the text to add
            filename_text = filename.replace(".pdf", "").replace(".PDF", "")
            
            if add_filename_to_pdf(pdf_file, filename_text):
                processed_count += 1
                print(f"  ✓ Successfully added filename to all pages")
            else:
                print(f"  ✗ Failed to process file")
    
    print(f"\nCompleted! Processed {processed_count} files.")

if __name__ == "__main__":
    main()
