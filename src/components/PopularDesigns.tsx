
import { ChevronLeft, ChevronRight, Share, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

// Sample design data
const initialPopularDesigns = [
  {
    id: 1,
    title: "Modern Minimalist Living Room",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop",
    style: "Modern",
    likes: 245,
    isLiked: false
  },
  {
    id: 2,
    title: "Scandinavian Bedroom",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1000&auto=format&fit=crop",
    style: "Scandinavian",
    likes: 189,
    isLiked: false
  },
  {
    id: 3,
    title: "Industrial Style Office",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
    style: "Industrial",
    likes: 172,
    isLiked: false
  },
  {
    id: 5,
    title: "Contemporary Kitchen",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1000&auto=format&fit=crop",
    style: "Contemporary",
    likes: 143,
    isLiked: false
  }
];

const PopularDesigns = () => {
  const [popularDesigns, setPopularDesigns] = useState(initialPopularDesigns);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
  
  const handleLike = (id: number) => {
    setPopularDesigns(prevDesigns => 
      prevDesigns.map(design => 
        design.id === id 
          ? {
              ...design, 
              likes: design.isLiked ? design.likes - 1 : design.likes + 1,
              isLiked: !design.isLiked
            }
          : design
      )
    );
  };
  
  const handleShare = (design: typeof popularDesigns[0]) => {
    // Simulate sharing
    toast({
      title: "Design Shared Successfully",
      description: "Your design has been shared and added to Popular Designs!",
      duration: 3000,
    });
    
    // Add a new design to the popular designs list
    const newDesign = {
      id: Math.max(...popularDesigns.map(d => d.id)) + 1,
      title: `Shared: ${design.title}`,
      image: design.image,
      style: design.style,
      likes: 0,
      isLiked: false
    };
    
    setPopularDesigns(prev => [newDesign, ...prev]);
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
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <button 
                    onClick={() => handleLike(design.id)}
                    className="bg-white/80 backdrop-blur-sm rounded-full p-2 text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Heart 
                      className={`h-4 w-4 ${design.isLiked ? 'fill-red-500 text-red-500' : ''}`} 
                    />
                    <span>{design.likes}</span>
                  </button>
                  <button 
                    onClick={() => handleShare(design)}
                    className="bg-white/80 backdrop-blur-sm rounded-full p-2 text-xs font-medium"
                  >
                    <Share className="h-4 w-4" />
                  </button>
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
