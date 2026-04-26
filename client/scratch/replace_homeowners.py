import os
import re

def replace_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace homeowners with property owners (preserving case if possible, but the user specifically asked for "property owners")
    # Let's try to be smart about it:
    # homeowners -> property owners
    # Homeowners -> Property Owners (common for titles)
    # HOMEOWNERS -> PROPERTY OWNERS
    
    new_content = re.sub(r'homeowners', 'property owners', content)
    new_content = re.sub(r'Homeowners', 'Property Owners', new_content)
    new_content = re.sub(r'HOMEOWNERS', 'PROPERTY OWNERS', new_content)
    
    if content != new_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    root_dir = r'd:\apps\nextjs apps\homs\client\src'
    count = 0
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.js', '.jsx', '.md', '.css')):
                file_path = os.path.join(root, file)
                if replace_in_file(file_path):
                    print(f"Updated: {file_path}")
                    count += 1
    print(f"Total files updated: {count}")

if __name__ == "__main__":
    main()
