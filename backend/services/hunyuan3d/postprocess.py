import sys
import os

# Ensure the cloned official repo is in path
REPO_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "repo"))
if REPO_PATH not in sys.path:
    sys.path.insert(0, REPO_PATH)

def clean_mesh(mesh, max_faces=40000):
    """
    Cleans and simplifies the generated mesh.
    """
    print("Post-processing mesh: removing floaters and simplifying...")
    try:
        from hy3dgen.shapegen import FloaterRemover, DegenerateFaceRemover, FaceReducer
        
        # 1. Remove floaters
        mesh = FloaterRemover()(mesh)
        
        # 2. Remove degenerate faces
        mesh = DegenerateFaceRemover()(mesh)
        
        # 3. Reduce face count to max_faces
        mesh = FaceReducer()(mesh, max_facenum=max_faces)
        
        print("Mesh cleaning completed successfully.")
        return mesh
    except Exception as e:
        print(f"Error during mesh post-processing: {e}. Returning original mesh.")
        return mesh
