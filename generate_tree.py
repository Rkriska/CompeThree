from pathlib import Path

def print_tree(directory, max_depth=2, current_depth=0, prefix=""):
    # Berhenti jika sudah mencapai batas kedalaman (depth)
    if current_depth > max_depth:
        return
        
    path = Path(directory)
    try:
        # Ambil semua item, abaikan folder/file tertentu agar hasil lebih bersih
        ignore_list = ['.git', 'node_modules', '__pycache__', '.venv']
        items = list(path.iterdir())
        items = [i for i in items if i.name not in ignore_list]
        
        # Urutkan: Folder di atas, File di bawah
        items.sort(key=lambda x: (not x.is_dir(), x.name.lower())) 
    except PermissionError:
        return

    for index, item in enumerate(items):
        is_last = index == (len(items) - 1)
        connector = "└── " if is_last else "├── "
        
        # Cetak nama file/folder
        icon = "📁 " if item.is_dir() else "📄 "
        print(f"{prefix}{connector}{icon}{item.name}")
        
        # Jika itu folder, jalankan fungsi ini lagi (rekursif)
        if item.is_dir():
            extension = "    " if is_last else "│   "
            print_tree(item, max_depth, current_depth + 1, prefix + extension)

# ==========================================
# CARA PENGGUNAAN:
# ==========================================
print("📁 ROOT_PROJECT")

# Ganti angka max_depth di bawah ini sesuai kebutuhanmu
# 0 = Hanya tampilkan isi folder root
# 1 = Tampilkan sampai 1 level folder ke dalam
# 2 = Tampilkan sampai 2 level folder ke dalam, dst.
print_tree(".", max_depth=3)