import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# Add backend directory to path
BACKEND_DIR = os.path.abspath(os.path.dirname(__file__))
PARENT_DIR = os.path.abspath(os.path.join(BACKEND_DIR, ".."))
if PARENT_DIR not in sys.path:
    sys.path.insert(0, PARENT_DIR)

from backend.routes.generate3d import router as generate3d_router
from backend.services.hunyuan3d.model import load_models

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. On backend startup, load the Hunyuan3D model once and cache it
    print("FastAPI startup: pre-loading Tencent Hunyuan3D-2.1 model pipeline...")
    try:
        load_models()
        print("Tencent Hunyuan3D-2.1 ready for inference!")
    except Exception as e:
        print(f"FastAPI startup warning: Could not pre-load model pipeline: {e}")
        print("Model pipeline will attempt lazy-loading on first request.")
    yield
    print("FastAPI shutdown.")

app = FastAPI(
    title="PropVision AI - Hunyuan3D Backend",
    description="Backend service running Tencent Hunyuan3D-2.1 for 3D asset generation",
    version="1.0.0",
    lifespan=lifespan
)

# 2. CORS configurations for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Mount static generated outputs directory
GENERATED_DIR = os.path.abspath(os.path.join(BACKEND_DIR, "generated"))
os.makedirs(GENERATED_DIR, exist_ok=True)
app.mount("/generated", StaticFiles(directory=GENERATED_DIR), name="generated")

# 4. Include 3D generation router
app.include_router(generate3d_router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "PropVision AI Hunyuan3D Backend",
        "model": "Tencent Hunyuan3D-2.1"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
