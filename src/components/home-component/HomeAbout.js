import Image from 'next/image';

export default function HomeAbout() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center gap-10">
        
        {/* Image */}
        <div className="flex-1 w-full">
          <div className="relative w-full h-[400px] md:h-[400px] lg:h-[550px] rounded-lg overflow-hidden lg:shadow-lg">
            <Image
              src="/images/lasu4.jpeg" 
              alt="Rayob Engineering Team"
              fill
              sizes='100%'
              className="object-contain"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            About LASUMBA Games
          </h2>
          <p className="text-gray-600 mb-6">
            The Lagos State University MBA Students' Association (LASUMBA) is the official body representing postgraduate students at Lagos State University. Established to advocate for the rights and welfare of postgraduate students, LASUMBA plays a pivotal role in enhancing the academic and social experience of its members.
          </p>
          <p className="text-gray-600 mb-6">
            The LASUMBA Games will feature a blend of competitive and fun-filled activities such as:
          </p>
          
          {/* Sports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Football */}
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200 hover:shadow-md transition">
              <span className="text-3xl">⚽</span>
              <div>
                <h3 className="font-bold text-green-900">FOOTBALL</h3>
                <p className="text-green-800 text-sm">The ultimate sport of passion and teamwork.</p>
              </div>
            </div>

            {/* Ayo Olopon */}
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border-2 border-amber-200 hover:shadow-md transition">
              <span className="text-3xl">🪶</span>
              <div>
                <h3 className="font-bold text-amber-900">AYO OLOPON</h3>
                <p className="text-amber-800 text-sm">Let's honour our roots with this traditional game of strategy.</p>
              </div>
            </div>

            {/* Tennis */}
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-200 hover:shadow-md transition">
              <span className="text-3xl">🎾</span>
              <div>
                <h3 className="font-bold text-yellow-900">TENNIS</h3>
                <p className="text-yellow-800 text-sm">Speed, skill and precision will take the stage.</p>
              </div>
            </div>

            {/* Chess */}
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200 hover:shadow-md transition">
              <span className="text-3xl">♟️</span>
              <div>
                <h3 className="font-bold text-purple-900">CHESS</h3>
                <p className="text-purple-800 text-sm">Where minds clash and kings fall.</p>
              </div>
            </div>

            {/* Draught */}
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border-2 border-red-200 hover:shadow-md transition">
              <span className="text-3xl">🔴</span>
              <div>
                <h3 className="font-bold text-red-900">DRAUGHT</h3>
                <p className="text-red-800 text-sm">A classic battle of wits and patience.</p>
              </div>
            </div>

            {/* Ludo */}
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 hover:shadow-md transition">
              <span className="text-3xl">🎲</span>
              <div>
                <h3 className="font-bold text-blue-900">LUDO</h3>
                <p className="text-blue-800 text-sm">Because no event is complete without the thrill of rolling dice and beating friends.</p>
              </div>
            </div>
          </div>

          <a
            href="/about-us"
            className="inline-block bg-blue-900 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-800 transition"
          >
            Read More About LASUMBA Games
          </a>
        </div>

      </div>
    </section>
  );
}
