import pandas as pd
import json
import os

# ==========================================
# CONFIGURACIÓN FINAL DE ARCHIVOS Y HOJAS
# ==========================================
config_hojas = [
    # COMESTIBLES (Mismo archivo, diferentes GIDs)
    {'file_id': '1pfUU_MJoPUGhE-NUkgEDiqOblolCAX4e2a6URBeaFMs', 'gid': '82111512', 'cat': 'Comestibles', 'name': 'Resto'},
    {'file_id': '1pfUU_MJoPUGhE-NUkgEDiqOblolCAX4e2a6URBeaFMs', 'gid': '690038982', 'cat': 'Comestibles', 'name': 'Golosinas'},
    {'file_id': '1pfUU_MJoPUGhE-NUkgEDiqOblolCAX4e2a6URBeaFMs', 'gid': '1593622508', 'cat': 'Comestibles', 'name': 'Frescos'},

    # BEBIDAS
    {'file_id': '1R5eSEW4hZI4IHUUnQbjFcLSZ2TE5nRDA5poiGKXq6lE', 'gid': '577267747', 'cat': 'Bebidas', 'name': 'Bebidas'},

    # HIGIENE
    {'file_id': '1XTYHhAt_zqNkt2L5HIsx7obQgpc1jS2fSy8caa1btcQ', 'gid': '1161367578', 'cat': 'Higiene', 'name': 'Higiene'},

    # LIMPIEZA
    {'file_id': '1oZOzgcB_a6yzGWXzYDZbSKktj8daYxh1iUJIJNMD94I', 'gid': '1017642377', 'cat': 'Limpieza', 'name': 'Limpieza'},

    # MEDICAMENTOS
    {'file_id': '1m-3bnBMPbvmWw9hw5avacHcEcNfqA1vOfrdcLDxU-BA', 'gid': '1452568486', 'cat': 'Medicamentos', 'name': 'Medicamentos'},

    # OTROS
    {'file_id': '1W_2g2QuynjJQQmO6Ol5M9x696FPLF2tky5wMnDzuXnM', 'gid': '1956494593', 'cat': 'Otros', 'name': 'Otros'}
]

OUTPUT_FILE = 'public/data/products.json'

def limpiar_precio(valor):
    if pd.isna(valor) or str(valor).strip() in ['', '0', '0.0', '0,0']: 
        return 0
    limpio = str(valor).replace('$', '').replace('.', '').replace(',', '.').strip()
    try:
        return float(limpio)
    except:
        return 0

todos_los_productos = []
current_id = 1

print("--- 🚀 INICIANDO SINCRONIZACIÓN DESDE GOOGLE DRIVE ---")

for hoja in config_hojas:
    # URL de exportación como CSV directo
    url = f'https://docs.google.com/spreadsheets/d/{hoja["file_id"]}/export?format=csv&gid={hoja["gid"]}'
    
    try:
        df = pd.read_csv(url)
        
        # Validación de nombres para la consola
        nombres_prueba = df['titulo'].dropna().head(2).tolist()
        print(f"\n📂 Procesando: [{hoja['name'].upper()}]")
        print(f"   🔍 Primeros items: {nombres_prueba}")

        for _, row in df.iterrows():
            nombre = str(row.get('titulo', '')).strip()
            if not nombre or nombre.lower() in ['nan', 'sin nombre', '']:
                continue

            # Procesamiento de Imagen
            img_raw = row.get('@imagen')
            img_path = os.path.splitext(str(img_raw).strip())[0].lstrip('/') + ".jpg" if not pd.isna(img_raw) else ""

            # Procesamiento de Descripción (subCategoría)
            desc_raw = row.get('subCategoria')
            description = str(desc_raw).strip() if not pd.isna(desc_raw) else hoja['cat']

            producto = {
                "id": current_id,
                "name": nombre,
                "priceUnidad": limpiar_precio(row.get('precioUnitario')),
                "priceCantidad": limpiar_precio(row.get('precioCantidad')),
                "priceOferta": limpiar_precio(row.get('precioOferta')) or None,
                "description": description,
                "image": img_path,
                "category": hoja['cat'],
                "stock": 0 if str(row.get('stock')).lower() == "sin stock" else 10
            }
            todos_los_productos.append(producto)
            current_id += 1
            
        print(f"   ✅ OK: {len(df)} filas procesadas.")

    except Exception as e:
        print(f"   ❌ ERROR en '{hoja['name']}': {e}")

# GUARDADO FINAL DEL JSON
os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    json.dump(todos_los_productos, f, indent=2, ensure_ascii=False)

print(f"\n==========================================")
print(f"✅ SINCRONIZACIÓN EXITOSA")
print(f"Total de productos en el catálogo: {len(todos_los_productos)}")
print(f"==========================================")