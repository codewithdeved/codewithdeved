import os
import re
from datetime import datetime, timezone

def sync():
    now_utc = datetime.now(timezone.utc).strftime("%Y.%m.%d // %H:%M UTC")
    readme_path = "README.md"
    
    if not os.path.exists(readme_path):
        return
        
    with open(readme_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Pattern to update telemetry sync badge if present
    badge_pattern = r'(https://img\.shields\.io/badge/TELEMETRY%20SYNC-[^"?]+)'
    new_badge = f'https://img.shields.io/badge/TELEMETRY%20SYNC-{now_utc.replace(" ", "%20").replace("/", "%2F")}-0B1426'
    
    if re.search(badge_pattern, content):
        updated_content = re.sub(badge_pattern, new_badge, content)
        if updated_content != content:
            with open(readme_path, "w", encoding="utf-8") as f:
                f.write(updated_content)
            print(f"Synced telemetry timestamp to: {now_utc}")
    else:
        print(f"Telemetry check executed at: {now_utc}")

if __name__ == "__main__":
    sync()
