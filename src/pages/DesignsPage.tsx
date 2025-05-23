
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Heart, Share } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Sample design data
const initialDesignsData = [
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
  },
  {
    id: 6,
    title: "Luxurious Master Bedroom",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1000&auto=format&fit=crop",
    style: "Luxury",
    likes: 130,
    isLiked: false
  },
  {
    id: 7,
    title: "Mid-Century Modern Dining Room",
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=1000&auto=format&fit=crop",
    style: "Mid-Century",
    likes: 124,
    isLiked: false
  },
  {
    id: 8,
    title: "Rustic Home Office",
    image: "https://images.unsplash.com/photo-1511389026070-a14ae610a1be?q=80&w=1000&auto=format&fit=crop",
    style: "Rustic",
    likes: 115,
    isLiked: false
  },
];

const styleFilters = ["All", "Modern", "Scandinavian", "Industrial", "Contemporary", "Luxury", "Mid-Century", "Rustic"];

const DesignsPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [designsData, setDesignsData] = useState(initialDesignsData);
  const { toast } = useToast();
  
  // Filter designs based on selected style
  const filteredDesigns = activeFilter === "All" 
    ? designsData 
    : designsData.filter(design => design.style === activeFilter);

  const handleLike = (id: number) => {
    setDesignsData(prevDesigns => 
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
  
  const handleShare = (design: typeof designsData[0]) => {
    toast({
      title: "Design Shared Successfully",
      description: "Your design has been shared and added to Popular Designs!",
      duration: 3000,
    });
    
    // Add a new design to the designs list
    const newDesign = {
      id: Math.max(...designsData.map(d => d.id)) + 1,
      title: `Shared: ${design.title}`,
      image: design.image,
      style: design.style,
      likes: 0,
      isLiked: false
    };
    
    setDesignsData(prev => [newDesign, ...prev]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Popular Designs
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore our most popular interior designs for inspiration
          </p>
        </div>
        
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2">
            {styleFilters.map(style => (
              <Button
                key={style}
                variant={activeFilter === style ? "default" : "outline"}
                className={`rounded-full ${
                  activeFilter === style 
                    ? "bg-brand-500 hover:bg-brand-600" 
                    : ""
                }`}
                onClick={() => setActiveFilter(style)}
              >
                {style}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDesigns.map((design) => (
            <Card key={design.id} className="overflow-hidden">
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
                <h3 className="font-semibold mb-2">{design.title}</h3>
                <Button variant="link" className="p-0 h-auto text-brand-500">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DesignsPage;
