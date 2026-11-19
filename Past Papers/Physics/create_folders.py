import os
import sys

def create_subfolders(parent_folder):
    """
    Creates three subfolders in the given parent folder:
    - By Topic
    - Whole Papers
    - Separated Papers
    """
    # Define the folder names
    folders = ["By Topic", "Whole Papers", "Separated Papers"]
    
    # Check if parent folder exists
    if not os.path.exists(parent_folder):
        print(f"Error: The folder '{parent_folder}' does not exist.")
        return False
    
    # Create each subfolder
    created = []
    already_exists = []
    
    for folder in folders:
        folder_path = os.path.join(parent_folder, folder)
        try:
            os.makedirs(folder_path, exist_ok=True)
            if os.path.exists(folder_path):
                if folder_path not in [f for f in os.listdir(parent_folder)]:
                    created.append(folder)
                else:
                    already_exists.append(folder)
        except Exception as e:
            print(f"Error creating folder '{folder}': {e}")
            return False
    
    # Print results
    print(f"Folders created in: {parent_folder}")
    if created:
        print(f"  Created: {', '.join(folders)}")
    if already_exists:
        print(f"  Already existed: {', '.join(already_exists)}")
    
    return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python create_folders.py <folder_path>")
        print("Example: python create_folders.py 'G:\\My Drive\\Past Papers\\Physics\\A Level\\Year 12'")
        sys.exit(1)
    
    folder_path = sys.argv[1]
    create_subfolders(folder_path)
