import pandas as pd
import json
import os

# CONFIGURACIÓN DE RUTAS (Cambiamos a la carpeta public)
INPUT_FOLDER = 'data_csv'
OUTPUT_FILE = 'public/data/products.json' # <--- Cambiado a public

archivos = [
    {'name': '1_Comestibles - 1(0)_Resto.csv', 'cat': 'Comestibles'},
    {'name': '1_Comestibles - 1(1)_Golosinas.csv', 'cat': 'Comestibles'},
    {'name': '1_Comestibles - 1(2)_Frescos.csv', 'cat': 'Comestibles'},
    {'name': '2_Bebidas - 2(0)_Bebidas.csv', 'cat': 'Bebidas'},
    {'name': '3_Higiene - 3(0)_Higiene.csv', 'cat': 'Higiene'},
    {'name': '4_Limpieza - 4(0)_Limpieza.csv', 'cat': 'Limpieza'},
    {'name': '5_Medicamentos - 5(0)_Medicamentos.csv', 'cat': 'Medicamentos'},
    {'name': '6_Otros - 6(0)_Otros.csv', 'cat': 'Otros'}
]

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

print("--- Generando products.json para carga dinámica ---")

for item in archivos:
    file_path = os.path.join(INPUT_FOLDER, item['name'])
    if not os.path.exists(file_path):
        continue

    try:
        df = pd.read_csv(file_path)
        for _, row in df.iterrows():
            img_raw = row.get('@imagen')
            if pd.isna(img_raw) or str(img_raw).lower() == 'nan' or not str(img_raw).strip():
                img_path = ""
            else:
                img_orig = str(img_raw).strip()
                img_path = os.path.splitext(img_orig)[0].lstrip('/') + ".jpg"

            desc_raw = row.get('subCategoria')
            description = str(desc_raw).strip() if not (pd.isna(desc_raw) or str(desc_raw).lower() == 'nan') else item['cat']

            producto = {
                "id": current_id,
                "name": str(row.get('titulo', 'Sin nombre')).strip(),
                "priceUnidad": limpiar_precio(row.get('precioUnitario')),
                "priceCantidad": limpiar_precio(row.get('precioCantidad')),
                "priceOferta": limpiar_precio(row.get('precioOferta')) or None,
                "description": description,
                "image": img_path,
                "category": item['cat'],
                "stock": 0 if str(row.get('stock')).lower() == "sin stock" else 10
            }
            todos_los_productos.append(producto)
            current_id += 1
        print(f"✅ {item['name']} procesado.")
    except Exception as e:
        print(f"❌ Error en {item['name']}: {e}")

# GUARDAR COMO JSON PURO
os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    # Solo el dump del array, sin código JS
    json.dump(todos_los_productos, f, indent=2, ensure_ascii=False)

print(f"\n--- ¡Listo! Archivo generado en: {OUTPUT_FILE} ---")
print(f"Total de productos: {len(todos_los_productos)}")