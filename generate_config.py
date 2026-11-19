import os
import json
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
base_path = os.path.join(SCRIPT_DIR, 'Past Papers')
# Output modes: 'local' for file:// paths, 'github' for repo-relative URLs
OUTPUT_MODE = 'github'
# Repo subfolder for GitHub Pages output (no leading slash needed)
REPO_ROOT = 'Past Papers'
IGNORE_DIR_KEYWORDS = ['front covers']

def is_ignored_dir(name):
    name_lower = name.lower()
    return any(keyword in name_lower for keyword in IGNORE_DIR_KEYWORDS)

def format_path(path):
    """Format a filesystem path for the output mode."""
    if OUTPUT_MODE == 'github':
        rel = os.path.relpath(path, base_path).replace('\\', '/').lstrip('/')
        repo_root = REPO_ROOT.strip('/')
        if repo_root:
            return f"/{repo_root}/{rel}"
        return f"/{rel}"
    return path.replace('\\', '/')

def build_structure(path, max_depth=7, current_depth=0, debug=False):
    if debug:
        print(f"['{'  '*current_depth}] depth={current_depth}, path={os.path.basename(path)}")
    
    if current_depth >= max_depth:
        result = {'path': format_path(path), 'files': list_files(path)}
        # Try to find mark scheme folder for this papers folder
        mark_scheme_path = find_mark_scheme_folder(path)
        if mark_scheme_path:
            result['markSchemeFolder'] = mark_scheme_path
        return result
    
    items = os.listdir(path)
    
    dirs = [item for item in items if os.path.isdir(os.path.join(path, item))]
    dirs = [item for item in dirs if not is_ignored_dir(item)]
    
    if not dirs:
        result = {'path': format_path(path), 'files': list_files(path)}
        mark_scheme_path = find_mark_scheme_folder(path)
        if mark_scheme_path:
            result['markSchemeFolder'] = mark_scheme_path
        return result
    
    files = list_files(path)
    has_pdf_files = any(file['name'].lower().endswith('.pdf') for file in files)

    if len(dirs) == 1 and not has_pdf_files and current_depth < max_depth - 1:
        subdir = os.path.join(path, dirs[0])
        return build_structure(subdir, max_depth, current_depth + 1)
    
    result = {}
    if has_pdf_files:
        label = 'Files in this folder'
        if label in dirs:
            raise ValueError(f"Folder name conflicts with generated menu item: {path}/{label}")
        result[label] = {'path': format_path(path), 'files': files}
        mark_scheme_path = find_mark_scheme_folder(path)
        if mark_scheme_path:
            result[label]['markSchemeFolder'] = mark_scheme_path
    for dir_name in sorted(dirs):
        subdir = os.path.join(path, dir_name)
        result[dir_name] = build_structure(subdir, max_depth, current_depth + 1)
    
    return result

def find_mark_scheme_folder(papers_path):
    """Find the corresponding mark scheme folder for a papers folder"""
    # Parse the path
    rel_path = os.path.relpath(papers_path, base_path).replace('\\', '/')
    parts = rel_path.split('/')

    # Don't link mark schemes to other mark schemes.
    if any('mark scheme' in part.lower() for part in parts):
        return None
    
    if len(parts) < 2:
        return None
    
    subject = parts[0]

    if subject == 'Applied' and len(parts) > 2 and parts[1] in ('Single Award', 'Double Award'):
        award = parts[1]
        unit = next((part for part in parts[2:] if re.fullmatch(r'Unit \d+', part)), None)
        tier = next((part for part in parts[2:] if part in ('FT', 'HT')), None)
        if not unit or not tier:
            return None
        ms_base = os.path.join(base_path, subject, award, 'Mark Schemes', unit, tier)
        if not os.path.isdir(ms_base):
            return None
        folder_type = None
        topic_name = None
        for i, part in enumerate(parts):
            if 'whole' in part.lower():
                folder_type = 'whole'
                break
            if 'separated' in part.lower():
                folder_type = 'separated'
                break
            if 'by topic' in part.lower():
                folder_type = 'by_topic'
                if i + 1 < len(parts):
                    topic_name = parts[i + 1]
                break
        if not folder_type:
            return None
        year_match = re.search(r'20\d{2}', '/'.join(parts[2:]))
        year = int(year_match.group()) if year_match else None
        return find_matching_ms_folder(ms_base, folder_type, topic_name, year)
    
    # Build potential mark scheme paths based on common patterns
    mark_scheme_candidates = []
    
    # Pattern 1: Subject > Mark Schemes > ... (for GCSE/A Level)
    # Extract year level and category/unit
    year_level = None
    unit = None
    category = None
    tier = None
    paper_year = None
    paper_session = None
    
    for part in parts:
        if re.match(r'^Year \d+$', part):
            year_level = part
        if re.match(r'^Unit \d+$', part):
            unit = part
        if part in ['Doubles', 'Separates', 'Singles', 'A Level', 'AS Level']:
            category = part
        if part in ['Higher', 'Foundation', 'FT', 'HT']:
            tier = part
        if not paper_year:
            year_match = re.search(r'(20\d{2})', part)
            if year_match:
                paper_year = int(year_match.group(1))
        if not paper_session:
            session_match = re.search(r'\b([sSwW])(\d{2})\b', part)
            if session_match:
                paper_session = f"{session_match.group(1).upper()}{session_match.group(2)}"
    
    # Check folder type (Whole/Separated/By Topic)
    # Check all parts of the path to detect folder type
    folder_type = None
    topic_name = None
    for part in parts:
        if 'whole' in part.lower():
            folder_type = 'whole'
            break
        elif 'separated' in part.lower():
            folder_type = 'separated'
            break
        elif 'by topic' in part.lower():
            folder_type = 'by_topic'
            break

    # Capture topic name if this is a By Topic path (e.g., .../By Topic/Density)
    for i, part in enumerate(parts):
        if 'by topic' in part.lower():
            if i + 1 < len(parts):
                topic_name = parts[i + 1]
            break
    
    # Build mark scheme paths
    ms_base = os.path.join(base_path, subject, 'Mark Schemes')
    
    if year_level:
        # A Level/AS Level: Subject > Mark Schemes > A Level > Year X > Unit X > Type
        if category in ['A Level', 'AS Level']:
            if unit:
                ms_path = os.path.join(ms_base, category, year_level, unit)
                mark_scheme_candidates.append(ms_path)
            ms_path = os.path.join(ms_base, category, year_level)
            mark_scheme_candidates.append(ms_path)
        else:
            # GCSE: Subject > Mark Schemes > Year X > Category > Type
            if category:
                if tier:
                    # Tier-specific paths (Foundation/Higher/FT/HT) including nested category variant
                    mark_scheme_candidates.append(os.path.join(ms_base, category, year_level, tier))
                    mark_scheme_candidates.append(os.path.join(ms_base, category, category, year_level, tier))
                    mark_scheme_candidates.append(os.path.join(ms_base, year_level, category, tier))

                ms_path = os.path.join(ms_base, year_level, category)
                mark_scheme_candidates.append(ms_path)
                # Some subjects use Category > Year X instead
                ms_path = os.path.join(ms_base, category, year_level)
                mark_scheme_candidates.append(ms_path)

            # A Level fallback without category in path
            if unit:
                ms_path = os.path.join(ms_base, year_level, unit)
                mark_scheme_candidates.append(ms_path)

        # Fallback: Subject > Mark Schemes > Year X
        ms_path = os.path.join(ms_base, year_level)
        mark_scheme_candidates.append(ms_path)
    
    # Pattern 2: Subject > Unit X > Mark Schemes > ... (for Applied)
    if unit and not year_level:
        ms_path = os.path.join(base_path, subject, 'Mark Schemes', unit)
        mark_scheme_candidates.append(ms_path)
    
    # Try each candidate path
    for candidate in mark_scheme_candidates:
        if os.path.exists(candidate):
            # Look for matching folder type
            result = find_matching_ms_folder(candidate, folder_type, topic_name, paper_year, paper_session)
            if result:
                return result
    
    return None

def find_matching_ms_folder(ms_base_path, folder_type, topic_name=None, paper_year=None, paper_session=None):
    """Find the specific mark scheme folder matching the paper type"""
    items = os.listdir(ms_base_path)
    
    dirs = [item for item in items if os.path.isdir(os.path.join(ms_base_path, item))]
    
    # First pass: Match folder type exactly
    for dir_name in dirs:
        dir_lower = dir_name.lower()
        
        if folder_type == 'whole' and 'whole' in dir_lower:
            full_path = os.path.join(ms_base_path, dir_name)
            return mark_scheme_data(full_path)
        elif folder_type == 'separated' and 'separated' in dir_lower:
            full_path = os.path.join(ms_base_path, dir_name)
            if paper_year or paper_session:
                year_match_path = find_year_subfolder(full_path, paper_year, paper_session)
                if year_match_path:
                    return mark_scheme_data(year_match_path)
                return None
            return mark_scheme_data(full_path)
        elif folder_type == 'by_topic' and 'by topic' in dir_lower:
            by_topic_path = os.path.join(ms_base_path, dir_name)
            if topic_name:
                topic_path = os.path.join(by_topic_path, topic_name)
                if os.path.exists(topic_path):
                    return mark_scheme_data(topic_path)
                return None
            return mark_scheme_data(by_topic_path)

    # If the base path itself is the By Topic folder, try to match the topic subfolder
    if folder_type == 'by_topic' and 'by topic' in os.path.basename(ms_base_path).lower():
        if topic_name:
            topic_path = os.path.join(ms_base_path, topic_name)
            if os.path.exists(topic_path):
                return mark_scheme_data(topic_path)
            return None
        return mark_scheme_data(ms_base_path)

    # If base path is already a separated questions folder, try to match year subfolder
    if folder_type == 'separated' and 'separated' in os.path.basename(ms_base_path).lower():
        if paper_year or paper_session:
            year_match_path = find_year_subfolder(ms_base_path, paper_year, paper_session)
            if year_match_path:
                return mark_scheme_data(year_match_path)
            return None
        return mark_scheme_data(ms_base_path)
    
    return None

def mark_scheme_data(path):
    files = list_files(path)
    if not any(file['name'].lower().endswith('.pdf') for file in files):
        return None
    return {'path': format_path(path), 'files': files}

def find_year_subfolder(base_path, year, session=None):
    """Find a subfolder matching the given year (e.g., 2017) or session (e.g., S24/W24)."""
    items = os.listdir(base_path)

    dirs = [item for item in items if os.path.isdir(os.path.join(base_path, item))]
    year_str = str(year) if year else None
    year_short = year_str[-2:] if year_str else None
    session_upper = session.upper() if session else None

    # Prefer exact 4-digit year matches
    if year_str:
        for dir_name in dirs:
            if year_str in dir_name:
                return os.path.join(base_path, dir_name)

    # Match session code like S24/W24
    if session_upper:
        for dir_name in dirs:
            if session_upper.lower() in dir_name.lower():
                return os.path.join(base_path, dir_name)

    # Next, match Sxx style (e.g., S24)
    if year_short:
        for dir_name in dirs:
            if f"s{year_short}" in dir_name.lower() or f"w{year_short}" in dir_name.lower():
                return os.path.join(base_path, dir_name)

    # Final fallback: any occurrence of the 2-digit year
    if year_short:
        for dir_name in dirs:
            if year_short in dir_name:
                return os.path.join(base_path, dir_name)

    return None

def list_files(path):
    """List all files in a directory with their names and extensions"""
    items = os.listdir(path)
    files = []
    for item in sorted(items):
        full_path = os.path.join(path, item)
        if os.path.isfile(full_path):
            size = os.path.getsize(full_path)
            files.append({
                'name': item,
                'size': format_file_size(size),
                'path': format_path(full_path)
            })
    return files

def format_file_size(size):
    """Format file size in human readable format"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024.0:
            return f"{size:.1f} {unit}"
        size /= 1024.0
    return f"{size:.1f} TB"

def main():
    print(f"Building structure for: {base_path}")
    config = build_structure(base_path)
    print(f"Top-level subjects: {list(config.keys())}")
    config_str = json.dumps({'folderStructure': config}, indent=2)
    print(f"Generated JSON size: {len(config_str)} bytes")

    with open(os.path.join(SCRIPT_DIR, 'folder_config.js'), 'w', encoding='utf-8') as f:
        f.write('const configData = ' + config_str + ';\n\n')
        f.write('if (typeof window !== "undefined") {\n')
        f.write('  window.configData = configData;\n')
        f.write('}\n\n')
        f.write('if (typeof module !== "undefined" && module.exports) {\n')
        f.write('  module.exports = configData;\n')
        f.write('}\n')

    print('Generated folder_config.js successfully')


if __name__ == '__main__':
    main()
