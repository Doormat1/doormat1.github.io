"""
Exam Paper Analyzer
====================

Quick start
-----------
- Interactive mode:
        python exam_paper_analyzer.py

- Non-interactive examples:
        python exam_paper_analyzer.py "<path to pdf>"
        python exam_paper_analyzer.py "<path to pdf>" --save
        python exam_paper_analyzer.py "<path to pdf>" --export-pdfs --install-pdf-deps
        python exam_paper_analyzer.py "<path to pdf>" --export-pdfs --outdir "<output folder>"

What it does
------------
- Skips page 1 of the PDF.
- Detects question numbers from the top-left of the main rectangle on each page.
- Splits text by question and can save:
    - A combined text file: <pdf_stem>_questions.txt
    - Individual PDFs per question: <pdf_stem>_questions/<pdf_stem>_Q<N>.pdf

CLI flags
---------
- pdf_path (positional): Path to the exam paper PDF. If omitted, prompts interactively.
- --save: Write all questions to a single text file in the working directory.
- --export-pdfs: Export each question as its own PDF.
- --outdir <dir>: Target directory for PDF exports (used with --export-pdfs).
- --install-pdf-deps: Auto-install pypdf when exporting PDFs.

Notes
-----
- Requires pdfplumber; PDF export also requires pypdf (auto-installed with --install-pdf-deps).
- If question headers are missed, we can tighten the rectangle top-left band thresholds or use char-level font sizes.
"""

import pdfplumber
import argparse
import subprocess
import sys
import re
from statistics import median
import re
from pathlib import Path
from typing import List, Dict, Tuple


class ExamPaperAnalyzer:
    """
    Analyzes exam papers in PDF format and separates them into individual questions.
    Identifies question numbers from bold text in the top-left corner of each page.
    """
    
    def __init__(self, pdf_path: str):
        """
        Initialize the analyzer with a PDF file path.
        
        Args:
            pdf_path: Path to the PDF exam paper
        """
        self.pdf_path = Path(pdf_path)
        if not self.pdf_path.exists():
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")
        
        self.questions = {}  # Dictionary to store questions
        self.raw_text = ""   # Full text from PDF
    
    def extract_text_with_formatting(self) -> List[Dict]:
        """
        Extract text from PDF while preserving formatting information.
        Returns a list of pages with their text and formatting details.
        """
        pages_data = []
        
        with pdfplumber.open(self.pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages, 1):
                # Ignore the first page of the exam paper
                if page_num == 1:
                    continue
                page_data = {
                    'page_num': page_num,
                    'text': page.extract_text(),
                    'words': page.extract_words(),
                    'chars': page.chars,
                    'rects': page.rects,
                    'page_width': page.width,
                    'page_height': page.height
                }
                pages_data.append(page_data)
        
        return pages_data
    
    def detect_bold_text_top_left(self, page_data: Dict, threshold: float = 0.25) -> List[Tuple[str, float, float]]:
        """
        Detect candidate question numbers in the top-left band of the main rectangle
        (if present), otherwise the page top-left. Prefers numeric patterns like "1.".
        
        Args:
            page_data: Dictionary containing page information
            threshold: Fraction of rectangle height to consider as "top" (default 0.25)
        
        Returns:
            List of tuples (text, x_position, y_position) for candidate text in top-left
        """
        words = page_data.get('words', [])
        rects = page_data.get('rects', [])
        chars = page_data.get('chars', [])
        if not words:
            return []

        # Build a size map per word using overlapping chars
        word_sizes = {}
        for word in words:
            wx0, wx1 = word.get('x0'), word.get('x1')
            wtop, wbottom = word.get('top'), word.get('bottom')
            sizes = [c.get('size') for c in chars if c.get('size')
                     and c.get('x0') <= wx1 and c.get('x1') >= wx0
                     and c.get('top') >= wtop and c.get('bottom') <= wbottom]
            if sizes:
                word_sizes[id(word)] = sum(sizes) / len(sizes)
        all_sizes = list(word_sizes.values())
        size_threshold = median(all_sizes) * 1.05 if all_sizes else None

        # Find main rectangle near top if present
        main_rect = None
        if rects:
            sorted_rects = sorted(
                rects,
                key=lambda r: -((r.get('x1', 0) - r.get('x0', 0)) * (r.get('bottom', 0) - r.get('top', 0)))
            )
            for r in sorted_rects:
                rect_top = r.get('top')
                rect_bottom = r.get('bottom')
                rect_left = r.get('x0')
                rect_right = r.get('x1')
                if None in (rect_top, rect_bottom, rect_left, rect_right):
                    continue
                page_height = page_data.get('page_height', rect_bottom)
                if rect_top <= page_height * 0.5:
                    main_rect = {'top': rect_top, 'bottom': rect_bottom, 'x0': rect_left, 'x1': rect_right}
                    break
            if main_rect is None and sorted_rects:
                r = sorted_rects[0]
                main_rect = {'top': r.get('top'), 'bottom': r.get('bottom'), 'x0': r.get('x0'), 'x1': r.get('x1')}

        # Define region to search
        if main_rect:
            rect_h = (main_rect['bottom'] - main_rect['top'])
            rect_w = (main_rect['x1'] - main_rect['x0'])
            top_band_bottom = main_rect['top'] + rect_h * threshold
            left_band_right = main_rect['x0'] + rect_w * 0.35
            region_test = lambda w: (main_rect['top'] <= w['top'] <= top_band_bottom and main_rect['x0'] <= w['x0'] <= left_band_right)
        else:
            page_height = page_data.get('page_height') or max([w['top'] for w in words])
            page_width = page_data.get('page_width') or max([w['x1'] for w in words])
            top_threshold = page_height * 0.22
            left_threshold = page_width * 0.4
            region_test = lambda w: (w['top'] < top_threshold and w['x0'] < left_threshold)

        num_dot_re = re.compile(r"^\d+\.\s*$")
        candidates = []
        for word in words:
            if not region_test(word):
                continue
            text = word.get('text', '')
            is_num_dot = bool(num_dot_re.match(text.strip()))
            size = word_sizes.get(id(word))
            is_big = size_threshold is not None and size is not None and size >= size_threshold
            score = 0
            if is_num_dot:
                score += 2
            if is_big:
                score += 1
            # Favor bold-like font naming if present
            if 'fontname' in word and word['fontname'] and 'Bold' in word['fontname']:
                score += 1
            if score > 0:
                candidates.append((score, size or 0, word['text'], word['x0'], word['top']))

        # If nothing found in the focused region, fall back to page-level top area for num-dot
        if not candidates:
            page_height = page_data.get('page_height') or max([w['top'] for w in words])
            page_width = page_data.get('page_width') or max([w['x1'] for w in words])
            fallback_top = page_height * 0.35
            fallback_left = page_width * 0.6
            for word in words:
                text = word.get('text', '')
                if not num_dot_re.match(text.strip()):
                    continue
                if word.get('top', 0) <= fallback_top and word.get('x0', 0) <= fallback_left:
                    size = word_sizes.get(id(word))
                    score = 2 + (1 if size_threshold is not None and size is not None and size >= size_threshold else 0)
                    candidates.append((score, size or 0, word['text'], word['x0'], word['top']))

        # Sort by score desc, size desc, then vertical position
        candidates.sort(key=lambda t: (-t[0], -t[1], t[4]))
        return [(text, x0, top) for _, _, text, x0, top in candidates]
    
    def extract_question_number(self, text: str) -> str:
        """
        Extract question number from text.
        Handles formats like "Question 1", "1.", "Q1", etc.
        
        Args:
            text: Text to extract question number from
        
        Returns:
            Question number as string, or None if not found
        """
        # Try various patterns
        patterns = [
            r'[Qq]uestion\s+(\d+)',
            r'(?:^|\s)(\d+)\.?\s*(?:\)|$)',
            r'[Qq](\d+)',
            r'^(\d+)$'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text.strip())
            if match:
                return match.group(1)
        
        return None
    
    def analyze(self) -> Dict[str, str]:
        """
        Analyze the exam paper and separate into questions.
        
        Returns:
            Dictionary with question numbers as keys and question text as values
        """
        pages_data = self.extract_text_with_formatting()
        
        current_question = None
        current_text = []
        self.question_pages: Dict[str, List[int]] = {}
        
        for page_data in pages_data:
            page_text = page_data['text']
            
            # Detect candidate text in the top-left of main rectangle
            top_left_texts = self.detect_bold_text_top_left(page_data)
            
            # Try to identify question number from those candidates
            for cand_text, _, _ in top_left_texts:
                question_num = self.extract_question_number(cand_text)
                if question_num:
                    # Save previous question if exists
                    if current_question is not None:
                        self.questions[current_question] = '\n'.join(current_text).strip()
                    
                    # Start new question
                    current_question = question_num
                    current_text = []
                    # Initialize page list for this question
                    self.question_pages.setdefault(current_question, [])
                    break
            
            # Track pages for current question
            if current_question is not None:
                self.question_pages.setdefault(current_question, []).append(page_data['page_num'])
            
            # Add page text to current question
            if page_text:
                current_text.append(page_text)
        
        # Save last question
        if current_question is not None:
            self.questions[current_question] = '\n'.join(current_text).strip()
        
        return self.questions
    
    def get_question(self, question_num: str) -> str:
        """
        Get the text of a specific question.
        
        Args:
            question_num: Question number as string
        
        Returns:
            Question text, or None if not found
        """
        return self.questions.get(str(question_num))
    
    def save_questions_to_file(self, output_path: str = None):
        """
        Save extracted questions to a text file.
        
        Args:
            output_path: Path to save the output file. If None, uses default name.
        """
        if output_path is None:
            output_path = self.pdf_path.stem + "_questions.txt"
        
        with open(output_path, 'w', encoding='utf-8') as f:
            for question_num in sorted(self.questions.keys(), key=lambda x: int(x) if x.isdigit() else 0):
                f.write(f"\n{'='*80}\n")
                f.write(f"QUESTION {question_num}\n")
                f.write(f"{'='*80}\n\n")
                f.write(self.questions[question_num])
                f.write("\n\n")
        
        print(f"Questions saved to: {output_path}")

    def save_questions_to_pdfs(self, output_dir: str | None = None):
        """
        Save each question's pages into an individual PDF file.
        
        Args:
            output_dir: Directory to save the PDFs. Defaults next to the PDF with folder <stem>_questions.
        """
        try:
            from pypdf import PdfReader, PdfWriter
        except ImportError:
            raise ImportError("pypdf is required for PDF export. Install it or run with --install-pdf-deps.")

        if not hasattr(self, 'question_pages') or not self.question_pages:
            raise ValueError("No question page mappings found. Run analyze() first.")

        if output_dir is None:
            output_dir = self.pdf_path.parent / f"{self.pdf_path.stem}_questions"
        else:
            output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

        reader = PdfReader(str(self.pdf_path))
        for question_num in sorted(self.question_pages.keys(), key=lambda x: int(x) if x.isdigit() else 0):
            pages = self.question_pages[question_num]
            writer = PdfWriter()
            for pnum in pages:
                # pdfplumber pages are 1-indexed; pypdf uses 0-index
                if 0 <= (pnum - 1) < len(reader.pages):
                    writer.add_page(reader.pages[pnum - 1])
            out_path = output_dir / f"{self.pdf_path.stem}_Q{question_num}.pdf"
            with open(out_path, 'wb') as f:
                writer.write(f)
        print(f"Question PDFs saved to: {output_dir}")
    
    def print_summary(self):
        """Print a summary of extracted questions."""
        print(f"\n{'='*80}")
        print(f"Exam Paper Analysis: {self.pdf_path.name}")
        print(f"{'='*80}")
        print(f"Total questions found: {len(self.questions)}")
        print(f"Question numbers: {', '.join(sorted(self.questions.keys(), key=lambda x: int(x) if x.isdigit() else 0))}")
        print(f"{'='*80}\n")


def main():
    """Example usage of the ExamPaperAnalyzer."""
    
    parser = argparse.ArgumentParser(description="Analyze an exam paper PDF and split into questions.")
    parser.add_argument("pdf_path", nargs="?", help="Path to the exam paper PDF")
    parser.add_argument("--save", action="store_true", help="Save extracted questions to a text file")
    parser.add_argument("--export-pdfs", action="store_true", help="Export each question as an individual PDF")
    parser.add_argument("--outdir", help="Directory to save exported PDFs (optional)")
    parser.add_argument("--install-pdf-deps", action="store_true", help="Automatically install PDF export dependencies (pypdf)")
    args = parser.parse_args()

    # Specify the PDF file to analyze
    if args.pdf_path:
        pdf_file = args.pdf_path.strip()
        interactive = False
    else:
        pdf_file = input("Enter the path to the exam paper PDF: ").strip()
        interactive = True
    
    try:
        analyzer = ExamPaperAnalyzer(pdf_file)
        print("Analyzing exam paper...")
        questions = analyzer.analyze()
        
        analyzer.print_summary()
        
        # Print first question as sample
        if questions:
            first_question = list(questions.keys())[0]
            print(f"First 500 characters of Question {first_question}:")
            print("-" * 80)
            print(analyzer.get_question(first_question)[:500])
            print("...\n")
        
        if args.save:
            analyzer.save_questions_to_file()
        if args.export_pdfs:
            # Ensure pypdf is available; optionally auto-install
            try:
                __import__("pypdf")
            except ImportError:
                if args.install_pdf_deps:
                    print("Installing pypdf for PDF export...")
                    subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf"])
                else:
                    print("pypdf is required for --export-pdfs. Re-run with --install-pdf-deps or install pypdf manually.")
            # Attempt export after ensuring deps
            try:
                analyzer.save_questions_to_pdfs(output_dir=args.outdir)
            except ImportError as e:
                print(f"Dependency error: {e}")
        elif interactive:
            # Ask if user wants to save to file (interactive only)
            save = input("Save questions to file? (y/n): ").strip().lower()
            if save == 'y':
                analyzer.save_questions_to_file()
            pdfs = input("Also export individual question PDFs? (y/n): ").strip().lower()
            if pdfs == 'y':
                # Interactive: offer to install deps if missing
                try:
                    analyzer.save_questions_to_pdfs()
                except ImportError:
                    choice = input("pypdf not found. Install now? (y/n): ").strip().lower()
                    if choice == 'y':
                        subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf"]) 
                        analyzer.save_questions_to_pdfs()
    
    except FileNotFoundError as e:
        print(f"Error: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main()
