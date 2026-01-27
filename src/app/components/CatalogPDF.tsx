import { Document, Page, View, Text, Image, Svg, Path, Font } from '@react-pdf/renderer';
import { tw } from '@/styles/pdfStyles';
import { Product, Category } from '@/app/types';

// 1. REGISTRO DE FUENTES SEGOE UI
Font.register({
  family: 'Segoe UI',
  fonts: [
    { src: '/fonts/segoeui.ttf' },                      
    { src: '/fonts/segoeuib.ttf', fontWeight: 700 },    
    { src: '/fonts/seguisb.ttf', fontWeight: 600 },    
    { src: '/fonts/seguibl.ttf', fontWeight: 900 },    
    { src: '/fonts/segoeuil.ttf', fontWeight: 300 },    
  ]
});

const theme = {
  red: '#DC2626',
  dark: '#1A1A1A',
  gold: '#FBBF24',
  green: '#14943b',
};

const categoryHex: Record<string, string> = {
  Ofertas: theme.red, 
};

interface CatalogPDFProps {
  products: Product[];
  selectedCategory: Category;
}

export const CatalogPDF = ({ products, selectedCategory }: CatalogPDFProps) => {
  
  const IconNumberOne = ({ color }: { color: string }) => (
    <Svg width="12" height="12" viewBox="0 0 24 24">
      <Path fill={color} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h-1v-2h3v8z"/>
    </Svg>
  );

  const IconPackageBox = ({ color }: { color: string }) => (
    <Svg width="12" height="12" viewBox="0 0 24 24">
      <Path fill={color} d="M12,2L2,7l10,5l10-5L12,2z M2,17l10,5v-5L2,12V17z M14,17l10-5v5l-10,5V17z"/>
    </Svg>
  );

  const renderPricePDF = (price: number) => {
    if (!price || price <= 0) return " --- ";
    return "$" + price.toLocaleString('es-AR', { minimumFractionDigits: 0 });
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

  // ===============================================
  //  DISEÑO OFERTAS (3x3)
  // ===============================================
  const RenderOfferPage = ({ group, pageNum }: { group: Product[], pageNum: number }) => (
    <Page key={`ofertas-${pageNum}`} size="A4" style={{ padding: 0, flexDirection: 'column', position: 'relative', fontFamily: 'Segoe UI' }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
        <Image src="/assets/fondoPDF.png" style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
      </View>
      <View style={{ height: 160 }} />
      <View style={{ paddingVertical: 16, paddingLeft: 35, paddingRight: 5, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        {group.map((product) => (
          <View key={product.id} style={{ width: '29.5%', height: '180pt', borderRadius: 12, flexDirection: 'column', overflow: 'hidden', backgroundColor: 'white', position: 'relative', borderWidth: 3, borderColor: theme.green, marginRight: 20, marginBottom: 20 }}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
              <Image src={product.image || "https://via.placeholder.com/150"} style={{ objectFit: 'contain', width: '100%', height: '100%', padding: 5 }} />
            </View>
            <View style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 50, marginTop: 6, marginHorizontal: 6, alignSelf: 'center', width: '90%' }}>
              <Text style={{ fontSize: 9, fontWeight: 900, color: theme.dark, textTransform: 'uppercase', textAlign: 'center' }}>
                {product.name}
              </Text>
            </View>
            <View style={{ marginTop: 'auto', height: '35pt', paddingHorizontal: 10, backgroundColor: 'rgba(255, 255, 255, 0.75)', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Text style={{ color: theme.red, fontSize: 25, fontWeight: 900 }}>
                {renderPricePDF(product.priceOferta!)}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <View style={{ marginTop: 'auto', padding: 15, alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 8, color: 'white', fontWeight: 700 }}>Pág. {pageNum}</Text>
      </View>
    </Page>
  );

  // ==========================================
  //  DISEÑO ESTÁNDAR: CON DISTINCIÓN DE OFERTA
  // ==========================================
  const RenderStandardPage = ({ group, title, color, pageNum }: { group: Product[], title: string, color: string, pageNum: number }) => (
    <Page key={`${title}-${pageNum}`} size="A4" style={{ padding: 0, flexDirection: 'column', backgroundColor: 'white', fontFamily: 'Segoe UI' }}>
      
      <View style={{ paddingVertical: 10, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: theme.green, backgroundColor: theme.green, height: 85 }}>
        <Image src="/assets/logo-pdf.png" style={{ width: 140, height: 75, objectFit: 'contain' }} />
        <Text style={{ fontSize: 24, fontWeight: 900, color: 'white', textTransform: 'uppercase' }}>{title}</Text>
      </View>

      <View style={{ paddingVertical: 10, paddingLeft: 33, paddingRight: 5, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        {group.map((product, index) => {
          const borderColor = index % 2 === 0 ? theme.gold : theme.green;
          const hasOffer = product.priceOferta && product.priceOferta > 0;

          return (
            <View key={product.id} style={{ width: '29.5%', height: '155pt', borderStyle: 'solid', borderRadius: 16, flexDirection: 'column', overflow: 'hidden', position: 'relative', borderColor: hasOffer ? theme.red : borderColor, borderWidth: 4, backgroundColor: 'white', marginRight: 20, marginBottom: 20 }}>
              
              {/* Imagen de fondo del producto */}
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
                <Image src={product.image || "https://via.placeholder.com/150"} style={{ objectFit: 'contain', width: '100%', height: '100%', padding: 5 }} />
              </View>

              {/* Badge de Oferta (Solo si aplica) */}
              {/* {hasOffer && (
                <View style={{ position: 'absolute', top: 35, right: -15, backgroundColor: theme.red, paddingVertical: 2, paddingHorizontal: 20, transform: 'rotate(45deg)' }}>
                   <Text style={{ color: 'white', fontSize: 6, fontWeight: 900 }}>OFERTA</Text>
                </View>
              )} */}

              <View style={{ padding: 6 }}>
                <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', padding: 3, borderRadius: 4 }}>
                  <Text style={{ fontSize: 9, fontWeight: 700, color: '#111', textTransform: 'uppercase', textAlign: 'center' }}>{product.name}</Text>
                </View>
              </View>

              {/* Footer de Precios: Cambia si hay oferta */}
              <View style={{ marginTop: 'auto', height: '35pt', paddingHorizontal: 6, justifyContent: 'center', backgroundColor: hasOffer ? 'rgba(220, 38, 38, 0.1)' : 'transparent' }}>
                {hasOffer ? (
                  // Layout si hay OFERTA
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 }}>
                    <Text style={{ fontSize: 7, color: theme.red, fontWeight: 900 }}>¡OFERTA!</Text>
                    <Text style={{ fontSize: 14, fontWeight: 900, color: theme.red }}>
                      {renderPricePDF(product.priceOferta!)}
                    </Text>
                  </View>
                ) : (
                  // Layout ESTÁNDAR (Unidad + Mayorista)
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <IconNumberOne color={theme.green} />
                      <Text style={{ fontSize: 12, fontWeight: 900, color: '#111' }}>{renderPricePDF(product.priceUnidad)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, paddingVertical: 3, paddingHorizontal: 5, borderRadius: 6, backgroundColor: 'rgba(20, 148, 59)' }}>
                      <IconPackageBox color="white" />
                      <Text style={{ fontSize: 12, color: 'white', fontWeight: 900 }}>{renderPricePDF(product.priceCantidad)}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>

      <View style={{ paddingHorizontal: 24, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTopWidth: 1, borderTopColor: '#f3f4f6' }}>
        <Text style={{ fontSize: 6, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>Distribuidora Mauri - Precios sujetos a cambios</Text>
        <Text style={{ fontSize: 7, color: '#9ca3af', fontWeight: 700 }}>Página {pageNum} • {new Date().toLocaleDateString('es-AR')}</Text>
      </View>
    </Page>
  );

  let globalPageCount = 0;

  return (
    <Document title="Catálogo Mauri">
      {offers.length > 0 && paginate(offers, 9).map((group, idx) => {
        globalPageCount++;
        return <RenderOfferPage key={`offer-page-${idx}`} group={group} pageNum={globalPageCount} />;
      })}

      {categoriesToRender.map((catName) => {
        const pagesOfCategory = paginate(groupedProducts[catName], 12);
        return pagesOfCategory.map((group, pageIdx) => {
          globalPageCount++;
          return <RenderStandardPage key={`${catName}-page-${pageIdx}`} group={group} title={catName} color={categoryHex[catName] || '#64748B'} pageNum={globalPageCount} />;
        });
      })}
    </Document>
  );
};