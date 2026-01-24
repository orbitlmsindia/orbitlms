
import os

file_path = r"c:\Users\pragy\Downloads\lms-web-application-ui\app\page.tsx"

# replacements map: garbled -> correct
replacements = {
    'Ã°Å¸â€œÅ¡': '📚',
    'Ã¢Å“Â Ã¯Â¸Â ': '✍️',
    'Ã°Å¸â€ Â¬': '🔬',
    'Ã°Å¸Â â€ ': '🏆',
    'Ã°Å¸â€œÅ ': '📊',
    'Ã°Å¸â€˜Â¤': '👤',
    'Ã¢Å“â€œ': '✓',
    'Ã°Å¸Å½â€œ': '🎓',
    'Ã°Å¸â€œË†': '📈',
    'Ã¢Å¡â„¢Ã¯Â¸Â ': '⚙️',
    'Ã‚Â©': '©'
}

try:
    with open(file_path, 'rb') as f:
        content_bytes = f.read()
    
    # Try decoding as utf-8, if it fails, try other encodings or just treat as binary for replacement if possible
    # But the issue is likely that the file HAS these specific utf-8 byte sequences interpreted as windows-1252 or similar and saved back as utf-8.
    # The simplest way is to read as text (utf-8) and replace the "mojibake" characters.
    
    content = content_bytes.decode('utf-8')
    
    for bad, good in replacements.items():
        content = content.replace(bad, good)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Successfully fixed encoding issues.")

except Exception as e:
    print(f"Error: {e}")
