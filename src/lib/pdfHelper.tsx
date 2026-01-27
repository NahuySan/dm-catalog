import { pdf } from '@react-pdf/renderer';
import { PDFDocument } from 'pdf-lib';
import { CatalogPDF } from '../app/components/CatalogPDF';
import { Product, Category } from '../app/types';

/**
 * Genera el catálogo dinámico y lo fusiona con la folletería estática de Mauri.
 * Orden: Portada -> OfertaVino -> OfertaNico -> Catálogo dinámico.
 */
export const handleDownloadFullCatalog = async (products: Product[], selectedCategory: Category) => {
  try {
    // 1. Generamos el PDF dinámico (los 470 productos)
    const blob = await pdf(
      <CatalogPDF products={products} selectedCategory={selectedCategory} />
    ).toBlob();
    const dynamicPdfBytes = await blob.arrayBuffer();

    // 2. Definimos las rutas de tus archivos estáticos
    const staticPdfUrls = [
      '/assets/Portada.pdf', 
      '/assets/OfertaVino.pdf', 
      '/assets/OfertaNico.pdf'
    ];
    
    const mergedPdf = await PDFDocument.create();

    // Helper para cargar y copiar páginas
    const addPagesFromPdf = async (pdfBuffer: ArrayBuffer) => {
      const doc = await PDFDocument.load(pdfBuffer);
      const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    };

    // --- PROCESO DE FUSIÓN EN ORDEN ---

    // A. Cargamos los 3 PDF estáticos primero
    for (const url of staticPdfUrls) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const bytes = await res.arrayBuffer();
          await addPagesFromPdf(bytes);
        } else {
          console.warn(`No se encontró el archivo en ${url}, saltando...`);
        }
      } catch (e) {
        console.error(`Error cargando ${url}:`, e);
      }
    }

    // B. Agregamos el catálogo dinámico al final de todo
    await addPagesFromPdf(dynamicPdfBytes);

    // 4. Generar el archivo final
    const mergedPdfBytes = await mergedPdf.save();
    
    // El casteo 'as any' es para evitar que TypeScript chille por el buffer
    const finalBlob = new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
    const url = URL.createObjectURL(finalBlob);
    
    const link = document.createElement('a');
    link.href = url;
    
    // Nombre del archivo con la fecha de hoy
    const fileName = `Catalogo_Mauri_${selectedCategory}_${new Date().getDate()}.pdf`;
    link.download = fileName.replace(/\s+/g, '_'); // Limpiamos espacios por las dudas
    
    document.body.appendChild(link);
    link.click();
    
    // Limpieza de recursos
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Error fatal fusionando los PDF:", error);
    alert("Hubo un error al generar el PDF completo. Revisá los nombres de los archivos en assets.");
  }
};