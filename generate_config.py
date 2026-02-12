import os
import json
import re

base_path = '/workspaces/doormat1.github.io/Past Paper'
# Output modes: 'local' for file:// paths, 'github' for repo-relative URLs
OUTPUT_MODE = 'github'
# Repo subfolder for GitHub Pages output (no leading slash needed)
REPO_ROOT = 'Past Paper'
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

def build_structure(path, max_depth=7, current_depth=0):
    if current_depth >= max_depth:
        result = {'path': format_path(path), 'files': list_files(path)}
        # Try to find mark scheme folder for this papers folder
        mark_scheme_path = find_mark_scheme_folder(path)
        if mark_scheme_path:
            result['markSchemeFolder'] = mark_scheme_path
        return result
    
    try:
        items = os.listdir(path)
    except:
        result = {'path': format_path(path), 'files': list_files(path)}
        mark_scheme_path = find_mark_scheme_folder(path)
        if mark_scheme_path:
            result['markSchemeFolder'] = mark_scheme_path
        return result
    
    dirs = [item for item in items if os.path.isdir(os.path.join(path, item))]
    dirs = [item for item in dirs if not is_ignored_dir(item)]
    
    if not dirs:
        result = {'path': format_path(path), 'files': list_files(path)}
        mark_scheme_path = find_mark_scheme_folder(path)
        if mark_scheme_path:
            result['markSchemeFolder'] = mark_scheme_path
        return result
    
    if len(dirs) == 1 and current_depth < max_depth - 1:
        subdir = os.path.join(path, dirs[0])
        return build_structure(subdir, max_depth, current_depth + 1)
    
    result = {}
    for dir_name in sorted(dirs):
        subdir = os.path.join(path, dir_name)
        result[dir_name] = build_structure(subdir, max_depth, current_depth + 1)
    
    return result

def find_mark_scheme_folder(papers_path):
    """Find the corresponding mark scheme folder for a papers folder"""
    # Only look for mark schemes if this is a papers/questions folder
    path_lower = papers_path.lower()
    if not ('paper' in path_lower or 'question' in path_lower):
        return None
    
    # Don't link mark schemes to other mark schemes
    if 'mark scheme' in path_lower:
        return None
    
    # Parse the path
    rel_path = papers_path.replace(base_path, '').replace('\\', '/').strip('/')
    parts = rel_path.split('/')
    
    if len(parts) < 2:
        return None
    
    subject = parts[0]
    
    # Build potential mark scheme paths based on common patterns
    mark_scheme_candidates = []
    
    # Pattern 1: Subject > Mark Schemes > ... (for GCSE/A Level)
    # Extract year level and category/unit
    year_level = None
    unit = None
    category = None
    
    for part in parts:
        if re.match(r'^Year \d+$', part):
            year_level = part
        if re.match(r'^Unit \d+$', part):
            unit = part
        if part in ['Doubles', 'Separates', 'Singles', 'A Level', 'AS Level']:
            category = part
    
    # Check folder type (Whole/Separated/By Topic)
    # Check all parts of the path to detect folder type
    folder_type = None
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
            result = find_matching_ms_folder(candidate, folder_type)
            if result:
                return result
    
    return None

def find_matching_ms_folder(ms_base_path, folder_type):
    """Find the specific mark scheme folder matching the paper type"""
    try:
        items = os.listdir(ms_base_path)
    except:
        return None
    
    dirs = [item for item in items if os.path.isdir(os.path.join(ms_base_path, item))]
    
    # First pass: Match folder type exactly
    for dir_name in dirs:
        dir_lower = dir_name.lower()
        
        if folder_type == 'whole' and 'whole' in dir_lower:
            full_path = os.path.join(ms_base_path, dir_name)
            return {'path': format_path(full_path), 'files': list_files(full_path)}
        elif folder_type == 'separated' and 'separated' in dir_lower:
            full_path = os.path.join(ms_base_path, dir_name)
            return {'path': format_path(full_path), 'files': list_files(full_path)}
        elif folder_type == 'by_topic' and 'by topic' in dir_lower:
            full_path = os.path.join(ms_base_path, dir_name)
            return {'path': format_path(full_path), 'files': list_files(full_path)}
    
    # Fallback: return first available mark scheme folder (only if no exact type match found)
    if dirs:
        full_path = os.path.join(ms_base_path, dirs[0])
        return {'path': format_path(full_path), 'files': list_files(full_path)}
    
    return None

def list_files(path):
    """List all files in a directory with their names and extensions"""
    try:
        items = os.listdir(path)
        files = []
        for item in sorted(items):
            full_path = os.path.join(path, item)
            if os.path.isfile(full_path):
                # Get file size
                size = os.path.getsize(full_path)
                size_str = format_file_size(size)
                
                files.append({
                    'name': item,
                    'size': size_str,
                    'path': format_path(full_path)
                })
        return files
    except:
        return []

def format_file_size(size):
    """Format file size in human readable format"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024.0:
            return f"{size:.1f} {unit}"
        size /= 1024.0
    return f"{size:.1f} TB"

config = build_structure(base_path)
config_str = json.dumps({'folderStructure': config}, indent=2)

with open('folder_config.js', 'w') as f:
    f.write('const configData = ' + config_str + ';\n\n')
    f.write('if (typeof window !== "undefined") {\n')
    f.write('  window.configData = configData;\n')
    f.write('}\n\n')
    f.write('if (typeof module !== "undefined" && module.exports) {\n')
    f.write('  module.exports = configData;\n')
    f.write('}\n')

print('Generated folder_config.js successfully')
