
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Sample popular designs data
const popularDesigns = [
  {
    id: 1,
    title: "Modern Minimalist Living Room",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop",
    style: "modern",
    likes: 245
  },
  {
    id: 2,
    title: "Scandinavian Bedroom",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1000&auto=format&fit=crop",
    style: "scandinavian",
    likes: 189
  },
  {
    id: 3,
    title: "Industrial Style Office",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
    style: "industrial",
    likes: 172
  },
  {
    id: 4,
    title: "Bohemian Living Space",
    image: "https://images.unsplash.com/photo-1585128903994-9788298ef4b3?q=80&w=1000&auto=format&fit=crop",
    style: "bohemian",
    likes: 156
  },
  {
    id: 5,
    title: "Contemporary Kitchen",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1000&auto=format&fit=crop",
    style: "contemporary",
    likes: 143
  }
];

type PopularDesignsCarouselProps = {
  onSelectDesign: (style: string) => void;
};

const PopularDesignsCarousel = ({ onSelectDesign }: PopularDesignsCarouselProps) => {
  const navigate = useNavigate();

  // Handle viewing design result directly
  const handleViewDesignResult = (style: string) => {
    // Check if user has tokens
    const userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;
    
    if (!userInfo || userInfo.tokens < 1) {
      // Redirect to tokens page if no tokens
      navigate("/tokens");
      return;
    }
    
    // Save style preference to localStorage for the results page to use
    localStorage.setItem('selectedDesign', JSON.stringify({
      style: style,
      useDirectResult: true
    }));
    
    // Deduct token
    const updatedTokens = userInfo.tokens - 1;
    localStorage.setItem('user', JSON.stringify({
      ...userInfo,
      tokens: updatedTokens
    }));
    
    // Get the current path to extract room type
    const path = window.location.pathname;
    const roomType = path.split('/').pop() || "living-room";
    
    // Navigate to result page
    navigate(`/design-generation/${roomType}/result`);
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-xl">Top 5 Popular Designs</h3>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent>
          {popularDesigns.map((design) => (
            <CarouselItem key={design.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="overflow-hidden">
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
                  <div className="flex space-x-2 mt-2">
                    <Button variant="link" className="p-0 h-auto text-brand-500" onClick={() => onSelectDesign(design.style)}>
                      Use This Style
                    </Button>
                    <Button variant="link" className="p-0 h-auto text-brand-500" onClick={() => handleViewDesignResult(design.style)}>
                      View Design Result
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-end gap-2 mt-2">
          <CarouselPrevious className="static transform-none mx-0 relative" />
          <CarouselNext className="static transform-none mx-0 relative" />
        </div>
      </Carousel>
    </div>
  );
};

export default PopularDesignsCarousel;
