import json
import sys

def rgba_to_hex(r, g, b, a=1):
    return f"#{int(r*255):02x}{int(g*255):02x}{int(b*255):02x}"

def traverse(node):
    # Print interesting nodes
    name = node.get("name", "")
    type_ = node.get("type", "")
    
    if type_ == "TEXT":
        chars = node.get("characters", "").replace("\n", " ")
        if "Connect" in chars or "With Us" in chars or "Send a Message" in chars or "hear" in chars:
            style = node.get("style", {})
            fills = node.get("fills", [])
            color = ""
            if fills and fills[0].get("type") == "SOLID":
                c = fills[0].get("color", {})
                color = rgba_to_hex(c.get("r", 0), c.get("g", 0), c.get("b", 0))
            print(f"TEXT [{chars[:40]}]: font={style.get('fontFamily')}, size={style.get('fontSize')}, weight={style.get('fontWeight')}, color={color}")
            
    if name.lower() in ["button", "input", "form background", "card"]:
        fills = node.get("fills", [])
        if fills and fills[0].get("type") == "SOLID":
            c = fills[0].get("color", {})
            color = rgba_to_hex(c.get("r", 0), c.get("g", 0), c.get("b", 0))
            radius = node.get("cornerRadius", 0)
            print(f"SHAPE [{name}]: bg={color}, radius={radius}")

    for child in node.get("children", []):
        traverse(child)

with open("figma_data.json") as f:
    data = json.load(f)

nodes = data.get("nodes", {})
doc = nodes.get("690:357", {}).get("document", {})
traverse(doc)
