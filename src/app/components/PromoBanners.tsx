export function PromoBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-8 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="overflow-hidden rounded-2xl shadow-md bg-white">
          <img
            src="/img/promo-tionico.jpg"
            alt="Representación Tío Nico - Variedad de fideos"
            className="w-full h-auto object-cover block"
            loading="lazy"
          />
        </div>

        <div className="overflow-hidden rounded-2xl shadow-md bg-white">
          <img
            src="/img/promo-borso.jpg"
            alt="Sabores disponibles Borso - Menta y Piña Colada"
            className="w-full h-auto object-cover block"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}