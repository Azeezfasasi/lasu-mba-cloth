import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "John Adewale",
    position: "PGDE Student, LASU",
    message:
      "The support and resources provided have been instrumental in my academic journey. The committee is responsive and truly cares about student success.",
  },
  {
    id: 2,
    name: "Maria Okafor",
    position: "MSc Student, LASU",
    message:
      "I appreciate the dedication of the postgraduate committee in addressing our concerns and enhancing our learning experience. Their efforts have made a significant difference.",
  },
  {
    id: 3,
    name: "Engr. David Uche",
    position: "Alumnus, LASU",
    message:
      "The postgraduate committee provided me with invaluable support during my studies. Their initiatives helped me balance academic and professional commitments effectively.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            What Our Students Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from our satisfied students about their experiences with our support and how we've helped them achieve their goals.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition"
            >
              {/* Stars */}
              <div className="flex gap-1 text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>

              {/* Message */}
              <p className="text-gray-600 mb-6 italic">
                “{testimonial.message}”
              </p>

              {/* Author */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-gray-500">{testimonial.position}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        {/* <div className="text-center mt-12">
          <a
            href="/contact-us"
            className="inline-block bg-blue-900 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-800 transition"
          >
            Work With Us
          </a>
        </div> */}
      </div>
    </section>
  );
}
