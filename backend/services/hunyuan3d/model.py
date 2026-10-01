import os
import sys
import torch

# Ensure the cloned official repo is in path
REPO_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "repo"))
if REPO_PATH not in sys.path:
    sys.path.insert(0, REPO_PATH)

# Global instances of pipelines
shape_pipeline = None
paint_pipeline = None
rembg_remover = None
device = "cpu"

def get_device():
    global device
    if torch.cuda.is_available():
        device = "cuda"
    else:
        device = "cpu"
    return device

def load_models():
    global shape_pipeline, paint_pipeline, rembg_remover
    
    if shape_pipeline is not None:
        return
        
    dev = get_device()
    print(f"Loading Tencent Hunyuan3D-2.1 models on device: {dev}")
    
    # 1. Load Background Remover
    u2net_path = os.path.expanduser("~/.u2net/u2net.onnx")
    if os.path.exists(u2net_path):
        try:
            from hy3dgen.rembg import BackgroundRemover
            rembg_remover = BackgroundRemover()
            print("Background remover initialized.")
        except Exception as e:
            print(f"Failed to initialize background remover: {e}")
            rembg_remover = None
    else:
        print("Background remover weights (u2net.onnx) not found locally. Skipping rembg initialization to speed up startup.")
        rembg_remover = None

    # 2. Load Shape Generation Pipeline
    try:
        from hy3dgen.shapegen import Hunyuan3DDiTFlowMatchingPipeline
        model_id = "tencent/Hunyuan3D-2.1"
        subfolder = "hunyuan3d-dit-v2-1"
        
        print(f"Loading shape generator '{model_id}' (subfolder: '{subfolder}')...")
        shape_pipeline = Hunyuan3DDiTFlowMatchingPipeline.from_pretrained(
            model_id,
            subfolder=subfolder,
            use_safetensors=True,
            device=dev,
        )
        shape_pipeline.enable_flashvdm(mc_algo='mc')
        print("Shape generator loaded successfully!")
    except Exception as e:
        print(f"Failed to load shape generation pipeline: {e}")
        import traceback
        traceback.print_exc()
        raise e

    # 3. Load Texture/Paint Pipeline (Optional fallback if compiler/xatlas is missing)
    try:
        from hy3dgen.texgen import Hunyuan3DPaintPipeline
        print("Loading texture generation pipeline...")
        paint_pipeline = Hunyuan3DPaintPipeline.from_pretrained(model_id, subfolder="hunyuan3d-paintpbr-v2-1")
        print("Texture generation pipeline loaded successfully!")
    except Exception as e:
        print(f"Texture generation pipeline loading skipped or failed (likely due to missing compile/xatlas): {e}")
        paint_pipeline = None
