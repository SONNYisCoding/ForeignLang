import os
import re

directory = r"j:\ForeignLang\ForeignLang\src\main\java\com\foreignlang\backend"

def process_file(filepath):
    print(f"Processing {filepath}")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # We also want to refactor if we find @RequiredArgsConstructor or // @RequiredArgsConstructor
    if 'RequiredArgsConstructor' not in content:
        return

    # Remove import
    content = re.sub(r'import\s+lombok\.RequiredArgsConstructor;\s*\n', '', content)
    
    # Remove annotation (even if commented out)
    content = re.sub(r'//\s*@RequiredArgsConstructor\s*\n', '', content)
    content = re.sub(r'@RequiredArgsConstructor\s*\n', '', content)
    
    # Find class name
    class_match = re.search(r'public\s+class\s+(\w+)', content)
    if not class_match:
        return
    class_name = class_match.group(1)
    
    # Regex updated to include `.` in types for package names like com.foreignlang.backend.service.CustomOidcUserService
    field_pattern = re.compile(r'((?:@\w+(?:\([^)]*\))?\s*)*)private\s+final\s+([A-Za-z0-9_<>,\s?.]+?)\s+([A-Za-z0-9_]+)\s*;')
    
    fields = []
    
    for match in field_pattern.finditer(content):
        annotations = match.group(1).strip()
        type_name = match.group(2).strip()
        var_name = match.group(3).strip()
        
        value_match = re.search(r'@Value\([^)]*\)', annotations)
        value_annotation = value_match.group(0) if value_match else None
        
        fields.append({
            'type': type_name,
            'name': var_name,
            'value_annotation': value_annotation,
            'full_match': match.group(0)
        })
        
    if not fields:
        print(f"No private final fields found in {class_name}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return
        
    constructor_params = []
    assignments = []
    
    need_value_import = False
    for f in fields:
        if f['value_annotation']:
            need_value_import = True
            param = f"\n            {f['value_annotation']} {f['type']} {f['name']}"
            new_field = f['full_match'].replace(f['value_annotation'], '').strip()
            content = content.replace(f['full_match'], f"    {new_field}")
        else:
            param = f"\n            {f['type']} {f['name']}"
            
        constructor_params.append(param)
        assignments.append(f"        this.{f['name']} = {f['name']};")
        
    if need_value_import and 'import org.springframework.beans.factory.annotation.Value;' not in content:
        content = re.sub(r'(package [A-Za-z0-9_.]+;\s*\n)', r'\1import org.springframework.beans.factory.annotation.Value;\n', content, count=1)
        
    constructor_code = f"\n\n    public {class_name}({','.join(constructor_params)}) {{\n"
    constructor_code += "\n".join(assignments)
    constructor_code += "\n    }\n"
    
    # Locate last field inserting position
    new_field_pattern = re.compile(r'private\s+final\s+[A-Za-z0-9_<>,\s?.]+?\s+[A-Za-z0-9_]+\s*;')
    last_insert_pos = -1
    for match in new_field_pattern.finditer(content):
        last_insert_pos = match.end()
        
    if last_insert_pos != -1:
        content = content[:last_insert_pos] + constructor_code + content[last_insert_pos:]
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Refactored {class_name}")

for root, dirs, files in os.walk(directory):
    for filename in files:
        if filename.endswith(".java"):
            process_file(os.path.join(root, filename))
