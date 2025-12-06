import Image from 'next/image';

export default function HomeAbout() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center gap-10">
        
        {/* Image */}
        <div className="flex-1 w-full">
          <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/images/telecom2.jpeg" 
              alt="Rayob Engineering Team"
              fill
              sizes='100%'
              className="object-cover"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            About Lagos State University MBA Students' Association
          </h2>
          <p className="text-gray-600 mb-6">
            The Lagos State University MBA Students' Association (LASU PGSA) is the official body representing postgraduate students at Lagos State University. Established to advocate for the rights and welfare of postgraduate students, LASU MBA plays a pivotal role in enhancing the academic and social experience of its members.
          </p>
          <p className="text-gray-600 mb-6">
            LASU MBA is committed to fostering a supportive community for postgraduate students through various initiatives, including academic workshops, networking events, and social activities. The association works closely with the university administration to address student concerns and promote a conducive learning environment.
          </p>

          <a
            href="/cloth-design"
            className="inline-block bg-blue-900 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-800 transition"
          >
            Order Custom Uniforms
          </a>
        </div>

      </div>
    </section>
  );
}
