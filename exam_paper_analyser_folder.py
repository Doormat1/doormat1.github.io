"""
Batch Exam Paper Analyzer
=========================

Process all PDFs in a folder, running ExamPaperAnalyzer for each file and writing
outputs into per-paper folders.

Usage
-----
python exam_paper_analyser_folder.py "<folder>" [--pattern "*.pdf"] [--recursive]
    [--save-text] [--export-pdfs] [--outdir "<output root>"] [--install-pdf-deps]

Examples
--------
python exam_paper_analyser_folder.py "G:/My Drive/Past Papers/Physics" --save-text
python exam_paper_analyser_folder.py "G:/My Drive/Past Papers/Physics" --recursive --export-pdfs --install-pdf-deps 

Notes
-----
- Each paper gets its own folder named <pdf_stem>_questions inside the chosen
  output root (default: alongside the PDF).
- Text output: <pdf_stem>_questions/<pdf_stem>_questions.txt
- PDF outputs (if enabled): <pdf_stem>_questions/<pdf_stem>_Q<N>.pdf
- Page 1 is skipped by the underlying analyzer; question headers are detected
  via top-left numeric patterns (e.g., "1.").
"""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path
from typing import List

from exam_paper_analyzer import ExamPaperAnalyzer


def ensure_pypdf(allow_install: bool) -> bool:
    """Ensure pypdf is importable; optionally install via pip if missing."""
    try:
        __import__("pypdf")
        return True
    except ImportError:
        if not allow_install:
            print("pypdf not found. Re-run with --install-pdf-deps or install manually.")
            return False
        print("Installing pypdf for PDF export...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf"])
            return True
        except Exception as exc:  # noqa: BLE001
            print(f"Failed to install pypdf: {exc}")
            return False


def gather_pdfs(folder: Path, pattern: str, recursive: bool) -> List[Path]:
    if recursive:
        return sorted(folder.rglob(pattern))
    return sorted(folder.glob(pattern))


def process_pdf(pdf_path: Path, save_text: bool, export_pdfs: bool, out_root: Path | None, allow_install: bool):
    print(f"\nProcessing: {pdf_path}")
    analyzer = ExamPaperAnalyzer(str(pdf_path))
    analyzer.analyze()

    # Prepare output folder
    base_dir = out_root if out_root else pdf_path.parent
    paper_dir = base_dir / f"{pdf_path.stem}_questions"
    paper_dir.mkdir(parents=True, exist_ok=True)

    if save_text:
        text_path = paper_dir / f"{pdf_path.stem}_questions.txt"
        analyzer.save_questions_to_file(output_path=str(text_path))

    if export_pdfs:
        if ensure_pypdf(allow_install):
            analyzer.save_questions_to_pdfs(output_dir=str(paper_dir))

    analyzer.print_summary()


def main():
    parser = argparse.ArgumentParser(description="Batch analyze all exam PDFs in a folder.")
    parser.add_argument("folder", help="Folder containing PDF exam papers")
    parser.add_argument("--pattern", default="*.pdf", help="Glob pattern for PDFs (default: *.pdf)")
    parser.add_argument("--recursive", action="store_true", help="Recurse into subfolders")
    parser.add_argument("--save-text", action="store_true", help="Save combined text per paper")
    parser.add_argument("--export-pdfs", action="store_true", help="Export each question as an individual PDF")
    parser.add_argument("--outdir", help="Root directory to place per-paper output folders")
    parser.add_argument("--install-pdf-deps", action="store_true", help="Auto-install pypdf if missing (for --export-pdfs)")

    args = parser.parse_args()
    folder_path = Path(args.folder)
    if not folder_path.is_dir():
        print(f"Folder not found: {folder_path}")
        sys.exit(1)

    out_root = Path(args.outdir) if args.outdir else None
    if out_root:
        out_root.mkdir(parents=True, exist_ok=True)

    pdfs = gather_pdfs(folder_path, args.pattern, args.recursive)
    if not pdfs:
        print("No PDFs matched the pattern.")
        sys.exit(0)

    for pdf_path in pdfs:
        try:
            process_pdf(
                pdf_path,
                save_text=args.save_text,
                export_pdfs=args.export_pdfs,
                out_root=out_root,
                allow_install=args.install_pdf_deps,
            )
        except Exception as exc:  # noqa: BLE001
            print(f"Error processing {pdf_path.name}: {exc}")
            continue


if __name__ == "__main__":
    main()
