import urllib.request
import json

token = "figd_Eb9EXZOqFr7H5ymN82Jj7T1Zy8xJ2ecJ56kuouTv"
file_key = "0hviIohen6TXnKK8wK6mnn"

# Download each separately at scale 1 (they might be too large for scale 2)
pages = {
    "1008:10": "client/src/assets/figma-homepage-v1.png",
    "1242:10": "client/src/assets/figma-homepage-v2.png"
}

for node_id, fname in pages.items():
    url = f"https://api.figma.com/v1/images/{file_key}?ids={node_id}&format=png&scale=1"
    req = urllib.request.Request(url)
    req.add_header("X-Figma-Token", token)
    
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            images = data.get("images", {})
            img_url = images.get(node_id)
            if img_url:
                urllib.request.urlretrieve(img_url, fname)
                print(f"Downloaded {fname}")
            else:
                print(f"No image for {node_id}")
    except Exception as e:
        print(f"Error for {node_id}: {e}")
