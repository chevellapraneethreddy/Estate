import io
from PIL import Image
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from backend.services.hunyuan3d.inference import generate_3d_asset

router = APIRouter()

@router.post("/api/generate-3d")
async def generate_3d(
    image: UploadFile = File(...),
    projectName: str = Form(...),
    layoutType: str = Form("apartment"),
    area: float = Form(1200.0),
    bedrooms: int = Form(2),
    bathrooms: int = Form(2),
    location: str = Form("Developer Lot 1"),
    salePrice: str = Form("$500,000")
):
    """
    Endpoint to receive uploaded floor plan images and execute Hunyuan3D-2.1.
    """
    print(f"Received generation request: Project={projectName}, Layout={layoutType}, Area={area}, Beds={bedrooms}, Baths={bathrooms}")
    
    # 1. Read uploaded file bytes
    try:
        contents = await image.read()
        pil_image = Image.open(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")
        
    # 2. Run Hunyuan3D generation pipeline
    try:
        result = generate_3d_asset(pil_image, projectName)
        return result
    except Exception as e:
        print(f"Error during 3D generation pipeline execution: {e}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")
