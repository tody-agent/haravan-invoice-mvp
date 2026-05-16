import re
import os
import concurrent.futures
import subprocess
import urllib.parse
import urllib.request

# 1. Read the markdown file to extract PDF links
md_path = "/Users/todyle/.gemini/antigravity/brain/31fefa59-1e9c-4cc6-8f89-884b6438aa97/.system_generated/steps/5/content.md"
with open(md_path, "r") as f:
    content = f.read()

# Extract links: [Title](https://hddt78.hilo.com.vn/Account/GetPDF?docName=...)
pattern = r'\[([^\]]+)\]\((https://hddt78\.hilo\.com\.vn/Account/GetPDF\?docName=[^\)]+)\)'
links = re.findall(pattern, content)

# Remove duplicates
unique_links = {}
for title, url in links:
    if url not in unique_links:
        unique_links[url] = title

os.makedirs("docs", exist_ok=True)

def download_pdf(url, title):
    # Sanitize title for filename
    filename = re.sub(r'[^\w\s-]', '', title).strip().replace(' ', '_') + ".pdf"
    filepath = os.path.join("docs", filename)
    
    if not os.path.exists(filepath):
        print(f"Downloading {filename}...")
        parsed_url = urllib.parse.urlparse(url)

        # We need to unquote the url to properly download if requests doesn't handle it
        # Actually requests handles URLs well
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response, open(filepath, 'wb') as out_file:
                out_file.write(response.read())
            print(f"Saved {filename}")
        except Exception as e:
            print(f"Failed to download {url}: {e}")
            return None
    return filepath, title

def analyze_pdf(filepath, title):
    md_filename = filepath.replace(".pdf", ".md")
    if os.path.exists(md_filename):
        print(f"Skipping analysis for {title}, {md_filename} already exists.")
        return md_filename
        
    print(f"Analyzing {filepath}...")
    prompt = f"Hãy đóng vai chuyên gia phân tích nghiệp vụ. Đọc kỹ file PDF tại đường dẫn {filepath} (tên tài liệu: {title}). Phân tích và trình bày lại dưới dạng Markdown chi tiết các tính năng, luồng nghiệp vụ (user flow), dữ liệu cần thiết. Việc này dùng để clone và refactor lại UX cho sản phẩm. KHÔNG TỰ Ý THÊM THẮT, CHỈ DỰA VÀO TÀI LIỆU."
    
    # Run gemini cli
    try:
        # We use -o text to avoid json output wrapping
        result = subprocess.run(
            ["gemini", "-y", "-p", prompt],
            capture_output=True,
            text=True,
            cwd=os.getcwd()
        )
        
        with open(md_filename, "w") as f:
            f.write(result.stdout)
            
        print(f"Completed analysis for {title} -> {md_filename}")
        return md_filename
    except Exception as e:
        print(f"Error analyzing {title}: {e}")
        return None

if __name__ == "__main__":
    downloaded_files = []
    
    # 1. Download sequentially or parallel
    for url, title in unique_links.items():
        res = download_pdf(url, title)
        if res:
            downloaded_files.append(res)
            
    # 2. Analyze in parallel
    print(f"Starting multi-threaded analysis for {len(downloaded_files)} files...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        futures = []
        for filepath, title in downloaded_files:
            futures.append(executor.submit(analyze_pdf, filepath, title))
            
        for future in concurrent.futures.as_completed(futures):
            future.result()
            
    print("All done!")
