import json
import os
import re

input_file = "/Users/todyle/.gemini/antigravity/brain/d77c689f-f043-43b3-9e06-1e68af6aec60/.system_generated/steps/18/content.md"

with open(input_file, "r") as f:
    content = f.read()

# Find the start of JSON
start_idx = content.find('{')
json_str = content[start_idx:]

try:
    data = json.loads(json_str)
except json.JSONDecodeError as e:
    print(f"Error decoding JSON: {e}")
    exit(1)

def resolve_ref(ref, data):
    parts = ref.split('/')[1:] # Skip #
    current = data
    for part in parts:
        current = current[part]
    return current

def build_schema_markdown(schema_obj, data, indent=0):
    if not schema_obj:
        return ""
    
    if '$ref' in schema_obj:
        schema_obj = resolve_ref(schema_obj['$ref'], data)
        
    out = ""
    props = schema_obj.get('properties', {})
    
    if not props and schema_obj.get('type') == 'array':
        items = schema_obj.get('items', {})
        if '$ref' in items:
            items = resolve_ref(items['$ref'], data)
        out += "Array of:\n" + build_schema_markdown(items, data, indent+2)
        return out
        
    for k, v in props.items():
        if '$ref' in v:
            v = resolve_ref(v['$ref'], data)
            
        t = v.get('type', 'object')
        example = v.get('example', '')
        desc = v.get('description', '')
        
        prefix = "  " * indent
        out += f"{prefix}- **{k}** (`{t}`): {desc}"
        if example:
            out += f" (Ví dụ: `{example}`)"
        out += "\n"
        
        if t == 'object' and 'properties' in v:
            out += build_schema_markdown(v, data, indent+1)
        elif t == 'array':
            items = v.get('items', {})
            if '$ref' in items:
                items = resolve_ref(items['$ref'], data)
            out += build_schema_markdown(items, data, indent+1)
            
    return out

resources = {}

for path, methods in data.get('paths', {}).items():
    for method, details in methods.items():
        tags = details.get('tags', ['General'])
        tag = tags[0].lower()
        if tag not in resources:
            resources[tag] = []
        
        resources[tag].append({
            'path': path,
            'method': method.upper(),
            'details': details
        })

base_url = "https://apitctn.hilo.com.vn"

# Write index.md
with open("docs/api/index.md", "w") as f:
    f.write("---\n")
    f.write("title: \"API Reference\"\n")
    f.write("description: \"Tài liệu tham khảo API TVAN-HILO TCTN\"\n")
    f.write("---\n\n")
    f.write("# API Reference\n\n")
    f.write("> **Quick Reference**\n")
    f.write(f"> - **Base URL**: `{base_url}`\n")
    f.write("> - **Auth Method**: Bearer token\n")
    f.write("> - **Response Format**: JSON\n")
    f.write("> - **API Version**: v1\n\n")
    f.write("## Authentication\n\n")
    f.write("```bash\n# Include this header in all authenticated requests\nAuthorization: Bearer <your_access_token>\n```\n\n")
    f.write(":::warning\nAPI keys should never be exposed in client-side code. Use server-side proxying or environment variables.\n:::\n\n")
    f.write("## Endpoints\n\n")
    f.write("| Resource | Endpoints | Base Path | Auth |\n")
    f.write("|----------|-----------|-----------|------|\n")
    for r_name, eps in resources.items():
        f.write(f"| {r_name.capitalize()} | {len(eps)} | `/api/{r_name}` | ✅ |\n")
    

for resource_name, endpoints in resources.items():
    filename = f"docs/api/{resource_name}.md"
    with open(filename, "w") as f:
        f.write("---\n")
        f.write(f"title: \"{resource_name.capitalize()} API\"\n")
        f.write(f"description: \"API reference for {resource_name.capitalize()}\"\n")
        f.write("---\n\n")
        f.write(f"# {resource_name.capitalize()} API\n\n")
        f.write("> **Quick Reference**\n")
        f.write(f"> - **Base URL**: `{base_url}`\n")
        f.write("> - **Auth**: Bearer Token\n")
        f.write("> - **Content-Type**: `application/json`\n\n")
        
        f.write("## Endpoints Overview\n\n")
        f.write("| Method | Endpoint | Description | Auth |\n")
        f.write("|--------|----------|-------------|------|\n")
        for ep in endpoints:
            f.write(f"| {ep['method']} | `{ep['path']}` | {ep['details'].get('summary', '')} | ✅ |\n")
        
        f.write("\n---\n\n")
        
        for ep in endpoints:
            f.write(f"## {ep['method']} {ep['path']}\n\n")
            f.write(f"{ep['details'].get('summary', '')}\n\n")
            
            # Parameters
            params = ep['details'].get('parameters', [])
            if params:
                f.write("### Parameters\n\n")
                f.write("| Name | Location | Type | Required | Default | Description |\n")
                f.write("|------|----------|------|----------|---------|-------------|\n")
                for p in params:
                    name = p.get('name', '')
                    loc = p.get('in', '')
                    schema = p.get('schema', {})
                    ptype = schema.get('type', 'string')
                    req = "✅" if p.get('required') else "❌"
                    desc = p.get('description', '')
                    f.write(f"| {name} | {loc} | {ptype} | {req} | | {desc} |\n")
                f.write("\n")
                
            # Request Body
            req_body = ep['details'].get('requestBody', {})
            if req_body:
                content = req_body.get('content', {}).get('application/json', {})
                schema = content.get('schema', {})
                if schema:
                    f.write("### Request Body\n\n")
                    markdown_schema = build_schema_markdown(schema, data)
                    f.write(markdown_schema + "\n")
            
            # Responses
            responses = ep['details'].get('responses', {})
            if responses:
                f.write("### Responses\n\n")
                for code, res in responses.items():
                    f.write(f"**{code} {res.get('description', '')}**\n")
                    content = res.get('content', {}).get('application/json', {})
                    schema = content.get('schema', {})
                    if schema:
                        f.write("\n")
                        markdown_schema = build_schema_markdown(schema, data)
                        f.write(markdown_schema + "\n")
                        
            # Examples
            f.write("### Examples\n\n")
            f.write("<details>\n<summary>cURL</summary>\n\n")
            f.write("```bash\n")
            f.write(f"curl -X {ep['method']} \"{base_url}{ep['path']}\" \\\n")
            f.write("  -H \"Authorization: Bearer <token>\" \\\n")
            f.write("  -H \"Content-Type: application/json\"\n")
            f.write("```\n\n</details>\n\n")
            f.write("---\n\n")
            
print("Done writing API docs.")
