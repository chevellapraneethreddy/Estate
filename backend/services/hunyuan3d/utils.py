import os
import uuid
from PIL import Image

# Ensure directories exist
GENERATED_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "generated"))
os.makedirs(GENERATED_DIR, exist_ok=True)

def get_generated_path(filename: str) -> str:
    """
    Returns absolute path for generated files.
    """
    return os.path.join(GENERATED_DIR, filename)

def save_preview_image(image: Image.Image, filename: str = None) -> str:
    """
    Saves image as a preview render.
    """
    if filename is None:
        filename = f"{uuid.uuid4()}_render.png"
    
    filepath = get_generated_path(filename)
    image.save(filepath, "PNG")
    print(f"Preview render saved to {filepath}")
    return filename

def export_mesh_to_glb(mesh, filename: str = None) -> str:
    """
    Exports Trimesh object to GLB.
    """
    if filename is None:
        filename = f"{uuid.uuid4()}_model.glb"
        
    filepath = get_generated_path(filename)
    
    # Export using trimesh export
    mesh.export(filepath, file_type='glb')
    print(f"GLB model exported to {filepath}")
    return filename
