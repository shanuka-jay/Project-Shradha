import json

with open("figma_data.json") as f:
    data = json.load(f)

nodes = data.get("nodes", {})
doc = nodes.get("690:357", {}).get("document", {})

# Find the "home page" frame (ID 1008:10)
def find_node(node, target_id):
    if node.get("id") == target_id:
        return node
    for child in node.get("children", []):
        result = find_node(child, target_id)
        if result:
            return result
    return None

homepage = find_node(doc, "1008:10")
if homepage:
    print(f"Found: {homepage.get('name')}")
    
    def extract_all(node, depth=0):
        name = node.get("name", "")
        ntype = node.get("type", "")
        
        if ntype == "TEXT":
            chars = node.get("characters", "").replace("\n", "\\n")[:80]
            style = node.get("style", {})
            fills = node.get("fills", [])
            color = ""
            if fills and fills[0].get("type") == "SOLID":
                c = fills[0].get("color", {})
                r = int(c.get("r", 0) * 255)
                g = int(c.get("g", 0) * 255)
                b = int(c.get("b", 0) * 255)
                color = f"#{r:02x}{g:02x}{b:02x}"
            font = style.get("fontFamily", "")
            size = style.get("fontSize", "")
            weight = style.get("fontWeight", "")
            print(f"{'  '*depth}TEXT: [{chars}] font={font} size={size} weight={weight} color={color}")
        elif ntype in ["FRAME", "COMPONENT", "INSTANCE", "GROUP"]:
            bbox = node.get("absoluteBoundingBox", {})
            w = bbox.get("width", 0)
            h = bbox.get("height", 0)
            fills = node.get("fills", [])
            bg = ""
            if fills and fills[0].get("type") == "SOLID" and fills[0].get("visible", True):
                c = fills[0].get("color", {})
                r = int(c.get("r", 0) * 255)
                g = int(c.get("g", 0) * 255)
                b = int(c.get("b", 0) * 255)
                bg = f" bg=#{r:02x}{g:02x}{b:02x}"
            radius = node.get("cornerRadius", "")
            rad_str = f" radius={radius}" if radius else ""
            print(f"{'  '*depth}{ntype}: [{name}] {w:.0f}x{h:.0f}{bg}{rad_str}")
        
        for child in node.get("children", []):
            extract_all(child, depth + 1)
    
    extract_all(homepage)
else:
    print("Home page not found")
