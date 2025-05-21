import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRef } from "react";

// Sample design data
const popularDesigns = [
  {
    id: 1,
    title: "Modern Minimalist Living Room",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop",
    style: "Modern",
    likes: 245
  },
  {
    id: 2,
    title: "Scandinavian Bedroom",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1000&auto=format&fit=crop",
    style: "Scandinavian",
    likes: 189
  },
  {
    id: 3,
    title: "Industrial Style Office",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
    style: "Industrial",
    likes: 172
  },
  {
    id: 5,
    title: "Contemporary Kitchen",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1000&auto=format&fit=crop",
    style: "Contemporary",
    likes: 143
  }
];

const PopularDesigns = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Popular Designs</h2>
            <p className="text-muted-foreground mt-2">
              Get inspired by our most popular interior designs
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={scrollLeft}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={scrollRight}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div 
          ref={scrollContainerRef} 
          className="flex space-x-4 overflow-x-auto pb-4 design-scrollbar"
        >
          {popularDesigns.map((design) => (
            <Card key={design.id} className="min-w-[300px] overflow-hidden">
              <div className="aspect-[4/3] relative">
                <img
                  src={design.image}
                  alt={design.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
                  {design.style}
                </div>
                <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {design.likes}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{design.title}</h3>
                <Button variant="link" className="p-0 h-auto mt-2 text-brand-500">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDesigns;
