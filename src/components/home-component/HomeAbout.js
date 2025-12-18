import Image from 'next/image';

export default function HomeAbout() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center gap-10">
        
        {/* Image */}
        <div className="flex-1 w-full">
          <div className="relative w-full h-64 md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden lg:shadow-lg">
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
            The LASUMBA Games 2026 will feature a blend of competitive and fun-filled activities such as:
            <ul className="list-disc list-inside mb-6">
            <li>FOOTBALL - The ultimate sport of passion and teamwork.</li>
            <li>AYO OLOPON - Let’s honour our roots with this traditional game of strategy.</li>
            <li>TENNIS - Speed, skill and precision will take the stage.</li>
            <li>CHESS - Where minds clash and kings fall.</li>
            <li>DRAUGHT - A classic battle of wits and patience.</li>
            <li>LUDO - Because no event is complete without the thrill of rolling dice and beating friends.</li>
          </ul>
          </p>

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
