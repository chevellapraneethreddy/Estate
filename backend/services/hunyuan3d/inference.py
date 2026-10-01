import os
import torch
import time
from PIL import Image
from . import model
from . import preprocess
from . import postprocess
from . import utils

def generate_3d_asset(image_input: Image.Image, project_name: str) -> dict:
    """
    Runs the Hunyuan3D-2.1 generation pipeline.
    """
    # 1. Ensure models are loaded
    model.load_models()
    
    start_time = time.time()
    print(f"Starting 3D asset generation for project '{project_name}'...")
    
    # 2. Preprocess: remove background
    preprocessed_image = preprocess.remove_background(image_input)
    
    # 3. Shape Generation
    print("Running shape generation pipeline...")
    dev = model.get_device()
    
    # Set up generator seed
    seed = 1234
    generator = torch.Generator(device=dev).manual_seed(seed)
    
    # Run the official shape pipeline
    # We use low steps and resolution on CPU to avoid crashes, higher on GPU
    num_steps = 5 if dev == "cpu" else 30
    octree_res = 128 if dev == "cpu" else 384
    
    try:
        pipeline_args = {
            "image": preprocessed_image,
            "num_inference_steps": num_steps,
            "octree_resolution": octree_res,
            "guidance_scale": 5.0,
            "generator": generator,
            "mc_algo": "mc"
        }
        
        # Run inference
        with torch.inference_mode():
            mesh_list = model.shape_pipeline(**pipeline_args)
            mesh = mesh_list[0]
            
        print("Shape generation completed.")
    except Exception as e:
        print(f"Error during shape generation: {e}")
        raise RuntimeError(f"Shape generation failed: {e}")

    # 4. Post-processing: clean and reduce mesh size
    mesh = postprocess.clean_mesh(mesh, max_faces=40000)

    # 5. Texture Generation (If model loaded and GPU/CUDA is active)
    if model.paint_pipeline is not None:
        print("Running texture paint pipeline...")
        try:
            with torch.inference_mode():
                mesh = model.paint_pipeline(mesh, image=preprocessed_image)
            print("Texture painting completed.")
        except Exception as e:
            print(f"Texture paint pipeline failed: {e}. Proceeding with untextured shape.")

    # 6. Save assets
    # Format safe names
    safe_project_name = "".join([c if c.isalnum() else "_" for c in project_name]).strip("_")
    if not safe_project_name:
        safe_project_name = "property"
        
    model_filename = f"{safe_project_name}_{int(time.time())}.glb"
    preview_filename = f"{safe_project_name}_{int(time.time())}_render.png"
    
    saved_model_file = utils.export_mesh_to_glb(mesh, model_filename)
    saved_preview_file = utils.save_preview_image(preprocessed_image, preview_filename)
    
    total_time = time.time() - start_time
    print(f"Generation completed in {total_time:.2f} seconds.")
    
    return {
        "success": True,
        "previewImage": f"/generated/{saved_preview_file}",
        "modelUrl": f"/generated/{saved_model_file}"
    }
