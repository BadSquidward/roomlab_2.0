
const testimonials = [
  {
    quote: "The AI-generated designs were incredibly detailed and matched my style preferences perfectly. The BOQ feature saved me hours of research!",
    author: "Sarah Johnson",
    role: "Homeowner",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    quote: "As an interior designer, this tool has become invaluable for quick concept generation. My clients love seeing multiple design options so quickly.",
    author: "Michael Chen",
    role: "Interior Designer",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg"
  },
  {
    quote: "We were renovating our office and needed inspiration. The designs generated were not only beautiful but practical and within our budget.",
    author: "Emily Rodriguez",
    role: "Business Owner",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg"
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight">What Our Users Say</h2>
          <p className="text-muted-foreground mt-4">
            Join thousands of satisfied users who have transformed their spaces
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <blockquote className="italic text-gray-700">
                "{testimonial.quote}"
              </blockquote>
              <div className="mt-4 flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
