export default function CallToAction() {
  return (
    <section className="relative bg-blue-900 text-white py-16 overflow-hidden">
      {/* Decorative Overlay */}
      <div className="absolute inset-0 bg-blue-900/40"></div>

      <div className="relative container mx-auto px-6 lg:px-20">
        <div className="flex flex-row gap-12 justify-center items-center w-full lg:w-[70%] mx-auto">
          <div className="text-center md:text-center mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Celebrate in Style
            </h2>

            <p className="text-blue-100 mb-8">
              Customize your celebration wear with bespoke LASU postgraduate T-Shirt and branded apparel.
              Perfect for convocations, events, and networking occasions. Make a lasting impression!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/custom-uniforms"
                className="bg-white text-blue-900 font-semibold px-8 py-3 rounded-lg shadow hover:bg-gray-100 transition text-center"
              >
                Order Custom T-Shirt
              </a>
              <a
                href="/gallery"
                className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-blue-900 transition text-center"
              >
                View T-Shirt Designs
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
