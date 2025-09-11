import kagglehub
import shutil
import os

# List of datasets to download
datasets = [
    "yellowj4acket/real-estate-georgia",
    "yellowj4acket/real-estate-california"
]

# Move to data folder dynamically
script_dir = os.path.dirname(__file__)
project_dir = os.path.dirname(script_dir)
data_dir = os.path.join(project_dir, 'data')

# Ensure data directory exists
os.makedirs(data_dir, exist_ok=True)

for dataset in datasets:
    # Download latest version
    path = kagglehub.dataset_download(dataset)
    print(f"Path to dataset files for {dataset}:", path)

    # Copy files to data folder, merging if necessary
    for item in os.listdir(path):
        s = os.path.join(path, item)
        d = os.path.join(data_dir, item)
        if os.path.isdir(s):
            if os.path.exists(d):
                shutil.rmtree(d)
            shutil.copytree(s, d)
        else:
            shutil.copy2(s, d)

    print(f"Dataset {dataset} files copied to:", data_dir)

    # Remove the original downloaded files
    shutil.rmtree(path)
    print(f"Original files for {dataset} removed from:", path)

print("All datasets downloaded and merged successfully.")