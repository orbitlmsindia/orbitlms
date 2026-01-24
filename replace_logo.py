import os

search_dir = r"c:\Users\pragy\Downloads\lms-web-application-ui\app"

search_patterns = [
    '<div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center text-sidebar-primary-foreground font-bold">O</div>',
    '<div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center text-sidebar-primary-foreground font-bold shrink-0">O</div>'
]

replacement = '<img src="/logo.png" alt="Orbit" className="w-8 h-8 rounded-lg object-contain bg-sidebar-primary" />'

count = 0

for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".js"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            
            new_content = content
            replaced = False
            for pattern in search_patterns:
                if pattern in new_content:
                    new_content = new_content.replace(pattern, replacement)
                    replaced = True
            
            if replaced:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Updated {path}")
                count += 1

print(f"Total files updated: {count}")
