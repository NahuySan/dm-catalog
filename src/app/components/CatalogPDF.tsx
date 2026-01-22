import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { tw } from '@/styles/pdfStyles';
import { Product, Category } from '@/app/types';

const categoryHex: Record<string, string> = {
  Comestibles: '#FDBA74',
  Bebidas: '#93C5FD',
  Higiene: '#5EEAD4',
  Limpieza: '#D8B4FE',
  Medicamentos: '#FCA5A5',
  Otros: '#CBD5A0',
  Ofertas: '#EF4444', 
};

interface CatalogPDFProps {
  products: Product[];
  selectedCategory: Category;
}

export const CatalogPDF = ({ products, selectedCategory }: CatalogPDFProps) => {
  
  const renderPricePDF = (price: number) => {
    if (!price || price <= 0) return " --- ";
    return "$" + price.toLocaleString('es-AR', { minimumFractionDigits: 2 });
  };

  const offers = products.filter(p => p.priceOferta && p.priceOferta > 0);
  const groupedProducts = products.reduce((acc: any, product) => {
    const cat = product.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  const paginate = (array: Product[], size: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const categoriesToRender = Object.keys(groupedProducts).filter(cat => groupedProducts[cat].length > 0);

  const renderCatalogPage = (group: Product[], title: string, color: string, pageNum: number, isOfferSection: boolean = false) => (
    <Page key={`${title}-${pageNum}`} size="A4" style={tw("p-0 flex-col bg-white")}>
      
      {/* Header - Un toque más compacto */}
      <View style={[tw("p-5 flex-row justify-between items-center border-b-2"), { borderBottomColor: color, backgroundColor: isOfferSection ? '#FEF2F2' : 'transparent' }]}>
        <View style={tw("flex-row items-center gap-4")}>
          <Image src="/assets/logo.png" style={tw("w-16 h-10 object-contain")} />
          <View>
            <View style={tw("flex-row items-baseline")}>
              <Text style={{ fontSize: 16, fontWeight: 400, color: '#111' }}>Distribuidora</Text>
              <Text style={{ fontSize: 16, fontWeight: 900, color: '#111', marginLeft: 4 }}>Mauri</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {isOfferSection ? "SUPER OFERTAS" : title}
            </Text>
          </View>
        </View>
        
        <View style={tw("items-end")}>
          <Text style={tw("text-gray-400 text-[7pt] font-bold uppercase")}>Página {pageNum}</Text>
          <Text style={tw("text-gray-300 text-[6pt]")}>{new Date().toLocaleDateString('es-AR')}</Text>
        </View>
      </View>

      {/* Grilla de Cards - Reducida para evitar saltos de página */}
      <View style={tw("p-4 flex-row flex-wrap justify-start gap-5")}>
        {group.map((product) => {
          const isOffer = product.priceOferta && product.priceOferta > 0;
          return (
            <View 
              key={product.id} 
              style={[
                // ALTURA REDUCIDA A 155pt
                tw("w-[31%] h-[165pt] border rounded-lg flex-col bg-white overflow-hidden"), 
                { position: 'relative', borderColor: (isOfferSection || isOffer) ? '#FECACA' : '#F3F4F6' }
              ]}
            >
              {/* CAPA 1: IMAGEN DE FONDO (Ocupa hasta los 40pt del footer) */}
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '40pt' }}>
                <Image 
                  src={product.image || "https://via.placeholder.com/150"} 
                  style={{ objectFit: 'contain', width: '100%', height: '100%', padding: 4 }} 
                />
              </View>

              {/* CAPA 2: TEXTO SUPERPUESTO */}
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '40pt', padding: 5, justifyContent: 'space-between' }}>
                {product.description && (
                  <View style={[tw("px-1 rounded"), { border: `0.5pt solid ${(isOfferSection || isOffer) ? '#EF4444' : 'green'}`, backgroundColor: 'rgba(255, 255, 255, 0.85)', alignSelf: 'flex-start' }]}>
                    <Text style={{ fontSize: 4.5, color: (isOfferSection || isOffer) ? '#EF4444' : 'green', fontWeight: 700, textTransform: 'uppercase' }}>
                      {product.description}
                    </Text>
                  </View>
                )}

                <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', padding: 2, borderRadius: 2, marginTop: 'auto' }}>
                  <Text style={{ fontSize: 6.5, fontWeight: 900, color: '#111', textTransform: 'uppercase', textAlign: 'center' }}>
                    {product.name}
                  </Text>
                </View>
              </View>
              
              {/* CAPA 3: FOOTER DE PRECIO (Altura fija de 40pt) */}
              <View style={{ marginTop: 'auto', height: '45pt', padding: 3, borderTop: '0.5pt solid #f9fafb', backgroundColor: 'white', justifyContent: 'center' }}>
                {isOffer ? (
                  <View style={tw("bg-red-600 p-1 rounded")}>
                    <Text style={{ color: 'white', fontSize: 9, fontWeight: 900, textAlign: 'center' }}>
                      OFERTA: {renderPricePDF(product.priceOferta!)}
                    </Text>
                  </View>
                ) : (
                  <View style={tw("gap-0.5")}>
                    <View style={tw("flex-row justify-between items-center px-1")}>
                      <Text style={{ fontSize: 5.5, color: '#9ca3af', fontWeight: 700 }}>UNIDAD</Text>
                      <Text style={{ fontSize: 8.5, fontWeight: 900, color: '#111' }}>
                        {renderPricePDF(product.priceUnidad)}
                      </Text>
                    </View>
                    <View style={[tw("flex-row justify-between items-center p-1 rounded"), { backgroundColor: `${color}15` }]}>
                      <Text style={{ fontSize: 5.5, color: color, fontWeight: 700 }}>MAYORISTA</Text>
                      <Text style={{ fontSize: 8.5, color: color, fontWeight: 900 }}>
                        {renderPricePDF(product.priceCantidad)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Footer de Página más fino */}
      <View style={tw("px-6 py-3 flex-row justify-between items-center mt-auto border-t border-gray-50")}>
        <Text style={{ fontSize: 5.5, color: '#d1d5db', fontWeight: 700, textTransform: 'uppercase' }}>
          Distribuidora Mauri - Precios sujetos a cambios
        </Text>
        <Text style={{ fontSize: 6, color: '#9ca3af', fontWeight: 700 }}>
          www.distribuidoramauri.com.ar
        </Text>
      </View>
    </Page>
  );

  let globalPageCount = 0;

  return (
    <Document title="Catálogo Mauri">
      {offers.length > 0 && paginate(offers, 12).map((group, idx) => {
        globalPageCount++;
        return renderCatalogPage(group, "Ofertas", categoryHex.Ofertas, globalPageCount, true);
      })}

      {categoriesToRender.map((catName) => {
        const pagesOfCategory = paginate(groupedProducts[catName], 12);
        const headerColor = categoryHex[catName] || '#64748B';
        
        return pagesOfCategory.map((group, pageIdx) => {
          globalPageCount++;
          return renderCatalogPage(group, catName, headerColor, globalPageCount);
        });
      })}
    </Document>
  );
};