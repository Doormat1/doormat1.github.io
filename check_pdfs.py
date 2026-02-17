#!/usr/bin/env python3
"""Validate PDFs under a folder and report corrupted files."""

from __future__ import annotations

import argparse
import os
import sys
from typing import Iterable

from pypdf import PdfReader


def iter_pdfs(root: str) -> Iterable[str]:
    for dirpath, _, filenames in os.walk(root):
        for name in filenames:
            if name.lower().endswith(".pdf"):
                yield os.path.join(dirpath, name)


def check_pdf(path: str) -> str | None:
    try:
        reader = PdfReader(path)
        # Touch basic structures to force parsing.
        _ = len(reader.pages)
        return None
    except Exception as exc:  # pragma: no cover - reporting only
        return f"{type(exc).__name__}: {exc}"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate PDFs and report corrupted files.")
    parser.add_argument(
        "root",
        nargs="?",
        default="Past Paper",
        help="Root folder to scan (default: Past Paper)",
    )
    args = parser.parse_args()

    root = os.path.abspath(args.root)
    if not os.path.isdir(root):
        print(f"Root folder not found: {root}")
        return 2

    total = 0
    bad = 0
    for path in iter_pdfs(root):
        total += 1
        error = check_pdf(path)
        if error:
            bad += 1
            rel = os.path.relpath(path, root)
            print(f"BAD  {rel} -> {error}")

    print(f"Checked {total} PDFs. Corrupted: {bad}.")
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
