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
    # Limpieza de formato argentino: quita $, quita punto de mil, cambia coma por punto
    limpio = str(valor).replace('$', '').replace('.', '').replace(',', '.').strip()
    try:
        return float(limpio)
    except:
        return 0

todos_los_productos = []
current_id = 1

print("--- Iniciando actualización COMPLETA de catálogo ---")

for item in archivos:
    file_path = os.path.join(INPUT_FOLDER, item['name'])
    
    if not os.path.exists(file_path):
        print(f"⚠️  Archivo no encontrado: {file_path}")
        continue

    try:
        # Leemos el CSV completo
        df = pd.read_csv(file_path)
        productos_archivo = 0

            # Tomamos solo los primeros 10 para la versión de prueba
            # df_limitado = df.head(10)
        
        # Iteramos sobre todos los registros del CSV sin límites
        for _, row in df.iterrows():
            p_oferta = limpiar_precio(row.get('precioOferta'))
            
            producto = {
                "id": current_id,
                "name": str(row.get('titulo', 'Sin nombre')).strip(),
                "priceUnidad": limpiar_precio(row.get('precioUnitario')),
                "priceCantidad": limpiar_precio(row.get('precioCantidad')),
                "priceOferta": p_oferta if p_oferta > 0 else None,
                "description": str(row.get('subCategoria', item['cat'])).strip(),
                "image": str(row.get('@imagen', '')).strip(),
                "category": item['cat'],
                "stock": 0 if str(row.get('stock')).lower() == "sin stock" else 10
            }
            todos_los_productos.append(producto)
            current_id += 1
            productos_archivo += 1
            
        print(f"✅ {item['name']}: {productos_archivo} productos procesados.")

    except Exception as e:
        print(f"❌ Error procesando {item['name']}: {e}")

# Generar el archivo TypeScript
ts_content = "import { Product } from '../types';\n\n"
ts_content += "export const products: Product[] = "
ts_content += json.dumps(todos_los_productos, indent=2, ensure_ascii=False)
ts_content += ";"

# Asegurarse de que la carpeta de salida exista
os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("\n--- Proceso terminado ---")
print(f"Total de productos exportados: {len(todos_los_productos)}")
print(f"Archivo generado en: {OUTPUT_FILE}")