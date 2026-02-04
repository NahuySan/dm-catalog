import pandas as pd
import json
import os

# Configuración de rutas
INPUT_FOLDER = 'data_csv'
OUTPUT_FILE = 'src/app/data/products.ts'

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
    # Limpieza de formato argentino
    limpio = str(valor).replace('$', '').replace('.', '').replace(',', '.').strip()
    try:
        return float(limpio)
    except:
        return 0

todos_los_productos = []
current_id = 1

print("--- Actualizando products.ts (Fix para productos sin imagen) ---")

for item in archivos:
    file_path = os.path.join(INPUT_FOLDER, item['name'])
    
    if not os.path.exists(file_path):
        print(f"⚠️  Archivo no encontrado: {file_path}")
        continue

    try:
        df = pd.read_csv(file_path)
        for _, row in df.iterrows():
            # --- LÓGICA ANTIBUGS PARA LA IMAGEN ---
            img_raw = row.get('@imagen')
            
            # Verificamos si es nulo, si es el string 'nan' o si está vacío
            if pd.isna(img_raw) or str(img_raw).lower() == 'nan' or not str(img_raw).strip():
                img_path = ""
            else:
                img_orig = str(img_raw).strip()
                # Quitamos la barra inicial si la tiene y cambiamos a .jpg
                img_path = os.path.splitext(img_orig)[0].lstrip('/') + ".jpg"

            # --- LÓGICA PARA LA DESCRIPCIÓN (Evita 'nan' en subcategoría) ---
            desc_raw = row.get('subCategoria')
            if pd.isna(desc_raw) or str(desc_raw).lower() == 'nan' or not str(desc_raw).strip():
                description = item['cat']
            else:
                description = str(desc_raw).strip()

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
            
        print(f"✅ {item['name']} procesado correctamente.")

    except Exception as e:
        print(f"❌ Error en {item['name']}: {e}")

# Generar el archivo TypeScript
ts_content = "import { Product } from '../types';\n\n"
ts_content += "export const products: Product[] = "
ts_content += json.dumps(todos_los_productos, indent=2, ensure_ascii=False)
ts_content += ";"

# Guardar con codificación UTF-8 para las tildes
os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("\n--- ¡Listo! El catálogo se actualizó sin errores de 'nan' ---")
print(f"Total de productos en el sistema: {len(todos_los_productos)}")