import json

with open("figma_data.json") as f:
    data = json.load(f)

nodes = data.get("nodes", {})
doc = nodes.get("690:357", {}).get("document", {})
children = doc.get("children", [])

for child in children:
    name = child.get("name", "")
    nid = child.get("id", "")
    ntype = child.get("type", "")
    bbox = child.get("absoluteBoundingBox", {})
    x = bbox.get("x", 0)
    y = bbox.get("y", 0)
    w = bbox.get("width", 0)
    h = bbox.get("height", 0)
    print(f"ID: {nid}, Name: {name}, Type: {ntype}, X: {x:.0f}, Y: {y:.0f}, W: {w:.0f}, H: {h:.0f}")
