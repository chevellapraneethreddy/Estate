import os
from PIL import Image
from . import model

def remove_background(image: Image.Image) -> Image.Image:
    """
    Remove background from PIL Image using Hunyuan3D rembg module.
    """
    if model.rembg_remover is None:
        print("Warning: BackgroundRemover not loaded. Skipping background removal.")
        return image.convert("RGBA")
        
    print("Removing background from input image...")
    # Convert to RGBA
    if image.mode != 'RGBA':
        image = image.convert("RGBA")
    
    # Run the background remover
    try:
        processed_image = model.rembg_remover(image)
        return processed_image
    except Exception as e:
        print(f"Error during background removal: {e}")
        return image
