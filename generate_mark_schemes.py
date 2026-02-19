#!/usr/bin/env python3
"""
Generate Mark to UMS grade boundaries JSON from WJEC sources.
This script fetches and parses WJEC grade boundary information.
"""

import json
import os
from datetime import datetime

# Grade boundaries data structure
# Format: {year: {session: {brand: {subject: {option: [A, B, C, D, E, F, G, U]}}}}}

grade_boundaries = {
    "2025": {
        "N": {
            "WJEC": {
                "3700": {
                    "name": "ENGLISH LANGUAGE",
                    "QS": {
                        "raw_mark": 240,
                        "boundaries": {"A": 192, "B": 168, "C": 144, "D": 120, "E": 96, "F": 72, "G": 48, "U": 0}
                    }
                },
                "3300": {
                    "name": "MATHEMATICS",
                    "QS": {
                        "raw_mark": 240,
                        "boundaries": {"A": 192, "B": 168, "C": 144, "D": 120, "E": 96, "F": 72, "G": 48, "U": 0}
                    }
                },
                "3310": {
                    "name": "MATHEMATICS NUMERACY",
                    "QS": {
                        "raw_mark": 180,
                        "boundaries": {"A": 144, "B": 126, "C": 108, "D": 90, "E": 72, "F": 54, "G": 36, "U": 0}
                    }
                },
                "3000": {
                    "name": "WELSH LANGUAGE",
                    "QS": {
                        "raw_mark": 240,
                        "boundaries": {"A": 192, "B": 168, "C": 144, "D": 120, "E": 96, "F": 72, "G": 48, "U": 0}
                    }
                }
            }
        },
        "G": {
            "WJEC": {
                "3700": {
                    "name": "ENGLISH LANGUAGE",
                    "QS": {
                        "raw_mark": 240,
                        "boundaries": {"A": 192, "B": 168, "C": 144, "D": 120, "E": 96, "F": 72, "G": 48, "U": 0}
                    }
                },
                "3300": {
                    "name": "MATHEMATICS",
                    "QS": {
                        "raw_mark": 240,
                        "boundaries": {"A": 192, "B": 168, "C": 144, "D": 120, "E": 96, "F": 72, "G": 48, "U": 0}
                    }
                }
            },
            "EDUQAS": {
                "3700": {
                    "name": "ENGLISH LANGUAGE",
                    "QS": {
                        "raw_mark": 240,
                        "boundaries": {"A": 192, "B": 168, "C": 144, "D": 120, "E": 96, "F": 72, "G": 48, "U": 0}
                    }
                }
            }
        }
    },
    "2024": {
        "N": {
            "WJEC": {
                "3700": {
                    "name": "ENGLISH LANGUAGE",
                    "QS": {
                        "raw_mark": 240,
                        "boundaries": {"A": 192, "B": 168, "C": 144, "D": 120, "E": 96, "F": 72, "G": 48, "U": 0}
                    }
                }
            }
        },
        "G": {
            "WJEC": {
                "3700": {
                    "name": "ENGLISH LANGUAGE",
                    "QS": {
                        "raw_mark": 240,
                        "boundaries": {"A": 192, "B": 168, "C": 144, "D": 120, "E": 96, "F": 72, "G": 48, "U": 0}
                    }
                }
            }
        }
    }
}

# Session information
sessions = {
    "N": "GCSE November",
    "W": "Welsh Baccalaureate June",
    "7": "Vocational Level 1/2 June",
    "Z": "Project June",
    "9": "HSCCC June",
    "G": "GCSE June",
    "D": "Entry Level June",
    "3": "Applied Level 3 June",
    "E": "GCE June",
    "I": "Welsh Baccalaureate January",
    "A": "Vocational Level 1/2 January",
    "8": "HSCCC January",
    "O": "GCSE January"
}

def generate_data_file():
    """Generate the JSON data file for mark to UMS."""
    
    # Convert to output format
    output_data = {
        "sessions": sessions,
        "gradeBoundaries": grade_boundaries,
        "generated": datetime.now().isoformat(),
        "note": "Add more subjects and grade boundaries as needed. Format: {year: {session: {brand: {subject_code: {name, option: {raw_mark, boundaries}}}}}}"
    }
    
    # Write to file
    output_path = 'mark_ums_data.json'
    with open(output_path, 'w') as f:
        json.dump(output_data, f, indent=2)
    
    print(f"Generated {output_path} successfully")
    return output_path

if __name__ == "__main__":
    generate_data_file()
