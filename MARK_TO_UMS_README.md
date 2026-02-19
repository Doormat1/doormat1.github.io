# Mark to UMS Converter Implementation

This is a complete implementation of the WJEC/EDUQAS Mark to UMS converter with advanced features.

## Files Created

### 1. `mark_to_ums.html`
The main web application with:
- **State Preservation**: Year/Session/Brand changes preserve Subject and Option selections
- **PDF Export**: Download grade boundaries as PDF using html2pdf.js
- **Print Support**: Print-friendly layout
- **Interactive Calculator**: Enter raw mark to get grade
- **Responsive Design**: Works on mobile and desktop
- **Modern UI**: Beautiful gradient design with smooth transitions

### 2. `mark_ums_data.json`
Generated data file containing:
- Grade boundaries for all years/sessions/brands/subjects
- Session code mappings
- Subject names and options

### 3. `generate_mark_schemes.py`
Python script to generate/update the JSON data file

## Features

### ✅ Implemented
1. **Data Loading from JSON**
   - Loads `mark_ums_data.json` on page load
   - Falls back to error message if data unavailable
   - Fully customizable data structure

2. **Integration with Past Papers Viewer Structure**
   - Compatible with existing folder structure
   - Can be extended to link papers and mark schemes
   - Shared data format for consistency

3. **PDF Export**
   - Downloads grade boundaries table as PDF
   - Uses html2pdf.js library
   - Landscape format for better readability
   - Filename includes subject and year

4. **Print Support**
   - Optimized print stylesheet
   - Hides filters and buttons on print
   - Full table visibility

5. **Grade Calculation**
   - Enter raw mark in input field
   - Real-time grade calculation
   - Supports all grade boundaries from data

## Usage

### Basic Setup
1. Ensure `mark_ums_data.json` is in the same directory as `mark_to_ums.html`
2. Navigate to `mark_to_ums.html` in browser
3. Select Year → Session → Brand → Subject → Option
4. Enter raw mark to calculate grade

### Updating Grade Boundaries
1. Edit `generate_mark_schemes.py` to add new data
2. Run: `python generate_mark_schemes.py`
3. This generates an updated `mark_ums_data.json`

### Data File Format
```json
{
  "sessions": {
    "N": "GCSE November",
    "G": "GCSE June"
  },
  "gradeBoundaries": {
    "2025": {
      "N": {
        "WJEC": {
          "3700": {
            "name": "ENGLISH LANGUAGE",
            "QS": {
              "raw_mark": 240,
              "boundaries": {
                "A": 192, "B": 168, "C": 144, "D": 120,
                "E": 96, "F": 72, "G": 48, "U": 0
              }
            }
          }
        }
      }
    }
  }
}
```

## JavaScript Functions

### Data Loading
- `loadDataFile()` - Loads JSON data
- `populateYears()` - Populates year dropdown
- `populateSessions()` - Populates session dropdown

### State Management
- `updateData()` - Main handler, triggers all updates
- `updateSubjects()` - Updates subject dropdown (preserves selection on year change)
- `updateOptions()` - Updates option dropdown (preserves selection)
- `displayData()` - Shows grade boundaries table

### Calculation
- `calculateGrade()` - Converts mark to grade
- `downloadPDF()` - Exports to PDF
- `printPage()` - Triggers print dialog

## Key Features

### 1. Preserved State
When you change the year, subject and option selections are preserved if available for the new year/session combo. This solves the original issue where changing the year reset all other selections.

### 2. Real-time Calculation
Enter any mark and see the grade instantly. The calculator uses the grade boundaries from the selected subject/option/session.

### 3. Professional Exports
- PDF exports with proper formatting
- Print-optimized layout
- Filename includes context information

### 4. Responsive Design
- Desktop: Multi-column layout
- Mobile: Single column with full-width buttons
- Touch-friendly dropdowns

## Extending the Tool

### Add More Subjects
Edit `generate_mark_schemes.py`:
```python
grade_boundaries = {
    "2025": {
        "G": {  # GCSE June
            "WJEC": {
                "1234": {  # New subject code
                    "name": "NEW SUBJECT",
                    "QS": {
                        "raw_mark": 240,
                        "boundaries": {"A": 192, ...}
                    }
                }
            }
        }
    }
}
```

### Link to Past Papers
Extend the HTML to show related past papers:
```javascript
// Add link button in displayData()
const relatedPapers = `<a href="past_papers_viewer.html?subject=${subject}">View Past Papers</a>`;
```

### Integration Notes
The application is designed to be extensible. Consider:
1. Creating a shared data format between this tool and past papers viewer
2. Adding filter parameters in URL for deep linking
3. Creating an admin interface to update grade boundaries

## Browser Compatibility

- Chrome/Chromium: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Edge: ✅ Full support
- IE 11: ⚠️ Partial (no fetch API, basic functionality)

## Dependencies

- **html2pdf.js** - PDF export (CDN link)
- **Modern JavaScript** - ES6+ features

## Performance

- Lightweight JSON data file
- Instant dropdowns populated from memory
- No API calls required
- Smooth animations with CSS transitions

## Future Enhancements

1. **Data Scraping**: Automatic scraping of WJEC website for latest boundaries
2. **Historical Trends**: Graph showing grade boundary changes over years
3. **Mark Simulator**: Predict likely grade from sample marks
4. **Comparison Tool**: Compare boundaries across sessions
5. **Mobile App**: React Native version for iOS/Android

## Support

To add new subjects or years:
1. Update `generate_mark_schemes.py`
2. Run the script to regenerate JSON
3. Refresh the website

For bugs or feature requests, refer to the code comments.
