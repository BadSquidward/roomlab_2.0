
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Star } from "lucide-react";

interface FurnitureItem {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  dimensions?: string;
  isTopSeller?: boolean;
  rating?: number;
}

interface FurnitureRecommendationsProps {
  roomType: string;
  style: string;
  furnitureList: string[];
  onSelectFurniture: (furniture: FurnitureItem) => void;
  isBoqGenerated: boolean;
  budget?: string;
}

const FurnitureRecommendations = ({ 
  roomType, 
  style, 
  furnitureList, 
  onSelectFurniture,
  isBoqGenerated,
  budget
}: FurnitureRecommendationsProps) => {
  const { toast } = useToast();
  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<FurnitureItem[]>([]);

  // IKEA furniture catalog data - expanded with the items from the provided images
  const ikeaCatalog: FurnitureItem[] = [
    // Sofas and sofa-beds
    {
      id: "vimle-3-seat-sofa",
      name: "VIMLE 3-seat sofa",
      imageUrl: "https://www.ikea.com/th/en/images/products/vimle-3-seat-sofa-gunnared-beige__0514366_pe639438_s5.jpg",
      description: "3-seat sofa, Gunnared beige",
      dimensions: "Standard",
      price: 16990
    },
    {
      id: "vimle-4-seat-sofa",
      name: "VIMLE 4-seat sofa",
      imageUrl: "https://www.ikea.com/th/en/images/products/vimle-4-seat-sofa-with-chaise-longue-gunnared-beige__0915986_pe785027_s5.jpg",
      description: "4-seat sofa with chaise longue, Gunnared beige",
      dimensions: "Standard",
      price: 27590
    },
    {
      id: "linanas-3-seat-sofa",
      name: "LINANÄS 3-seat sofa",
      imageUrl: "https://www.ikea.com/th/en/images/products/linanas-3-seat-sofa-vissle-beige__0999620_pe823371_s5.jpg",
      description: "3-seat sofa, Vissle beige",
      dimensions: "Standard",
      price: 6990,
      rating: 4
    },
    {
      id: "fridhult-sofa-bed",
      name: "FRIDHULT Sofa-bed",
      imageUrl: "https://www.ikea.com/th/en/images/products/fridhult-sofa-bed-knisa-light-grey__1059223_pe849519_s5.jpg",
      description: "Sofa-bed, Knisa light grey",
      dimensions: "Standard",
      price: 4990,
      rating: 4
    },
    {
      id: "friheten-corner-sofa-bed",
      name: "FRIHETEN Corner sofa-bed",
      imageUrl: "https://www.ikea.com/th/en/images/products/friheten-corner-sofa-bed-with-storage-skiftebo-dark-grey__0175610_pe328883_s5.jpg",
      description: "Corner sofa-bed with storage, Skiftebo dark grey",
      dimensions: "Standard",
      price: 15990,
      isTopSeller: true,
      rating: 5
    },
    {
      id: "hemlingby-2-seat-sofa",
      name: "HEMLINGBY 2-seat sofa",
      imageUrl: "https://www.ikea.com/th/en/images/products/hemlingby-2-seat-sofa-knisa-dark-grey__0724693_pe734590_s5.jpg",
      description: "2-seat sofa, Knisa dark grey",
      dimensions: "Standard",
      price: 3290,
      rating: 5
    },
    {
      id: "soderhamn-3-seat-section",
      name: "SÖDERHAMN 3-seat section",
      imageUrl: "https://www.ikea.com/th/en/images/products/soderhamn-3-seat-section-viarp-beige-brown__0802813_pe768605_s5.jpg",
      description: "3-seat section, Viarp beige/brown",
      dimensions: "Standard",
      price: 11990,
      rating: 4,
      isTopSeller: true
    },
    {
      id: "glostad-2-seat-sofa",
      name: "GLOSTAD 2-seat sofa",
      imageUrl: "https://www.ikea.com/th/en/images/products/glostad-2-seat-sofa-knisa-dark-grey__0950864_pe800736_s5.jpg",
      description: "2-seat sofa, Knisa dark grey",
      dimensions: "Standard",
      price: 2590,
      rating: 5
    },
    
    // Coffee Tables
    {
      id: "holmerud-coffee-table",
      name: "HOLMERUD Coffee Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/holmerud-coffee-table-oak-effect__1113125_pe871179_s5.jpg",
      description: "Coffee table, oak effect, 90x55 cm",
      dimensions: "90x55 cm",
      price: 1290
    },
    {
      id: "jattesta-coffee-table",
      name: "JÄTTESTA Coffee Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/jaettesta-coffee-table-black__1109454_pe869713_s5.jpg",
      description: "Coffee table, black, 80x80 cm",
      dimensions: "80x80 cm",
      price: 3590
    },
    {
      id: "moxboda-coffee-table",
      name: "MOXBODA Coffee Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/moxboda-coffee-table-foldable-brown__0959940_pe807593_s5.jpg",
      description: "Coffee table, foldable/brown, 70 cm",
      dimensions: "70 cm",
      price: 1990,
      rating: 4
    },
    {
      id: "krokholmen-coffee-table",
      name: "KROKHOLMEN Coffee Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/krokholmen-coffee-table-outdoor-beige__0736123_pe740373_s5.jpg",
      description: "Coffee table, outdoor, beige, 73 cm",
      dimensions: "73 cm",
      price: 1990,
      isTopSeller: true,
      rating: 5
    },
    {
      id: "vittsjo-nest-tables",
      name: "VITTSJÖ Nest of Tables",
      imageUrl: "https://www.ikea.com/th/en/images/products/vittsjo-nest-of-tables-set-of-2-black-brown-glass__0452609_pe601390_s5.jpg",
      description: "Nest of tables, set of 2, black-brown/glass, 90x50 cm",
      dimensions: "90x50 cm",
      price: 1990
    },
    
    // Side Tables
    {
      id: "kvistbro-storage-table",
      name: "KVISTBRO Storage Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/kvistbro-storage-table-white__0276622_pe415559_s5.jpg",
      description: "Storage table, white, 44 cm",
      dimensions: "44 cm",
      price: 790
    },
    {
      id: "guttane-side-table",
      name: "GUTTANË Side Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/guttane-side-table-oak-light-stained-oak__1168953_pe892157_s5.jpg",
      description: "Side table, oak, 58x39 cm",
      dimensions: "58x39 cm",
      price: 3590,
      isTopSeller: true
    },
    {
      id: "jattesta-side-table",
      name: "JÄTTESTA Side Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/jaettesta-side-table-black__1109453_pe869712_s5.jpg",
      description: "Side table, black, 95x30 cm",
      dimensions: "95x30 cm",
      price: 2990
    },
    {
      id: "gladom-tray-table",
      name: "GLADOM Tray Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/gladom-tray-table-dark-grey-beige__0997173_pe822569_s5.jpg",
      description: "Tray table, dark grey-beige, 45x53 cm",
      dimensions: "45x53 cm",
      price: 499,
      isTopSeller: true,
      rating: 5
    },
    {
      id: "lack-coffee-table-white",
      name: "LACK Coffee Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/lack-coffee-table-white__0702219_pe724342_s5.jpg",
      description: "Coffee table, white, 90x55 cm",
      dimensions: "90x55 cm",
      price: 790,
      isTopSeller: true,
      rating: 5
    },
    
    // Bedside Tables
    {
      id: "grafjallet-bedside-table",
      name: "GRÄFJÄLLET Bedside Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/graefjaellet-bedside-table-anthracite__1061361_pe849936_s5.jpg",
      description: "Bedside table, anthracite, 45x36x59 cm",
      dimensions: "45x36x59 cm",
      price: 1790
    },
    {
      id: "tonstad-bedside-table",
      name: "TONSTAD Bedside Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/tonstad-bedside-table-off-white__1186615_pe899852_s5.jpg",
      description: "Bedside table, off-white, 40x40x59 cm",
      dimensions: "40x40x59 cm",
      price: 2990,
      rating: 4
    },
    {
      id: "vikhammer-bedside-table",
      name: "VIKHAMMER Bedside Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/vikhammer-bedside-table-white__0640723_pe699998_s5.jpg",
      description: "Bedside table, white, 40x39 cm",
      dimensions: "40x39 cm",
      price: 2490
    },
    {
      id: "vihals-bedside-table",
      name: "VIHALS Bedside Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/vihals-bedside-table-white__1127587_pe876457_s5.jpg",
      description: "Bedside table, white, 37x37 cm",
      dimensions: "37x37 cm",
      price: 990,
      rating: 5
    },
    {
      id: "hattasen-bedside-table",
      name: "HATTÅSEN Bedside Table/Shelf Unit",
      imageUrl: "https://www.ikea.com/th/en/images/products/hattsen-bedside-table-shelf-unit-black__0955642_pe804123_s5.jpg",
      description: "Bedside table/shelf unit, black",
      dimensions: "Various",
      price: 790,
      rating: 5,
      isTopSeller: true
    },
    {
      id: "sorudden-bedside-table",
      name: "SÖRUDDEN Bedside Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/sorudden-bedside-table-bamboo__1010407_pe828066_s5.jpg",
      description: "Bedside table, bamboo, 50x30 cm",
      dimensions: "50x30 cm",
      price: 1290,
      rating: 5
    },
    {
      id: "tyssedal-bedside-table",
      name: "TYSSEDAL Bedside Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/tyssedal-bedside-table-white__0637796_pe698584_s5.jpg",
      description: "Bedside table, white, 51x40 cm",
      dimensions: "51x40 cm",
      price: 3990,
      rating: 5
    },
    {
      id: "olderdalen-bedside-table",
      name: "OLDERDALEN Bedside Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/olderdalen-bedside-table-grey-green-pine__1171837_pe893634_s5.jpg",
      description: "Bedside table, grey-green/pine, 47x43 cm",
      dimensions: "47x43 cm",
      price: 4990,
      rating: 4
    },
    {
      id: "musken-bedside-table",
      name: "MUSKEN Bedside Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/musken-bedside-table-brown__1215595_pe912199_s5.jpg",
      description: "Bedside table, brown, 45x58 cm",
      dimensions: "45x58 cm",
      price: 1790,
      rating: 1
    },
    {
      id: "smussla-bedside-table",
      name: "SMUSSLA Bedside Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/smussla-bedside-table-shelf-unit-white__0943588_pe796902_s5.jpg",
      description: "Bedside table/shelf unit, white",
      dimensions: "Various",
      price: 1890,
      rating: 4
    },
    {
      id: "burvik-side-table",
      name: "BURVIK Side Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/burvik-side-table-white__0624932_pe692072_s5.jpg",
      description: "Side table, white, 38 cm",
      dimensions: "38 cm",
      price: 790,
      rating: 5
    },
    {
      id: "vihals-bedside-table",
      name: "VIHALS Bedside Table",
      imageUrl: "https://www.ikea.com/th/en/images/products/vihals-bedside-table-white__0948866_pe799246_s5.jpg",
      description: "Bedside table, white, 37x37 cm",
      dimensions: "37x37 cm",
      price: 990,
      rating: 4
    },
    
    // Armchairs
    {
      id: "poang-armchair",
      name: "POÄNG Armchair",
      imageUrl: "https://www.ikea.com/th/en/images/products/poaeng-armchair-birch-veneer-knisa-light-beige__0472285_pe613982_s5.jpg",
      description: "Armchair and footstool, birch veneer/Knisa light beige",
      dimensions: "Standard",
      price: 4380,
      rating: 4
    },
    {
      id: "strandmon-armchair",
      name: "STRANDMON Armchair",
      imageUrl: "https://www.ikea.com/th/en/images/products/strandmon-armchair-nordvalla-dark-grey__0601768_pe680181_s5.jpg",
      description: "Armchair and footstool, Nordvalla dark grey",
      dimensions: "Standard",
      price: 8480,
      isTopSeller: true,
      rating: 5
    },
    {
      id: "sotenas-armchair",
      name: "SOTENÄS Armchair",
      imageUrl: "https://www.ikea.com/th/en/images/products/sotenas-armchair-hakebo-red__1137845_pe879968_s5.jpg",
      description: "Armchair, Hakebo red",
      dimensions: "Standard",
      price: 6990
    },
    {
      id: "ektorp-armchair",
      name: "EKTORP Armchair",
      imageUrl: "https://www.ikea.com/th/en/images/products/ektorp-armchair-hallarp-beige__1053461_pe846938_s5.jpg",
      description: "Armchair, Kilanda light beige",
      dimensions: "Standard",
      price: 6990,
      rating: 3
    },
    {
      id: "landskrona-armchair",
      name: "LANDSKRONA Armchair",
      imageUrl: "https://www.ikea.com/th/en/images/products/landskrona-armchair-gunnared-dark-grey-wood__0602085_pe680154_s5.jpg",
      description: "Armchair, Gunnared dark grey/wood",
      dimensions: "Standard",
      price: 10990
    },
    
    // Dressers and Chests of Drawers
    {
      id: "bjorksnas-chest-5-drawers",
      name: "BJÖRKSNÄS Chest of 5 drawers",
      imageUrl: "https://www.ikea.com/th/en/images/products/bjorksnas-chest-of-5-drawers-birch__0598653_pe677670_s5.jpg",
      description: "Chest of 5 drawers, birch, 90x90 cm",
      dimensions: "90x90 cm",
      price: 12990
    },
    {
      id: "malm-dressing-table",
      name: "MALM Dressing table",
      imageUrl: "https://www.ikea.com/th/en/images/products/malm-dressing-table-white__0627100_pe693162_s5.jpg",
      description: "Dressing table, white, 120x41 cm",
      dimensions: "120x41 cm",
      price: 2990,
      isTopSeller: true,
      rating: 5
    },
    {
      id: "malm-chest-6-drawers",
      name: "MALM Chest of 6 drawers",
      imageUrl: "https://www.ikea.com/th/en/images/products/malm-chest-of-6-drawers-white-mirror-glass__0627422_pe693299_s5.jpg",
      description: "Chest of 6 drawers, white/mirror glass, 40x123 cm",
      dimensions: "40x123 cm",
      price: 4990,
      rating: 5
    },
    {
      id: "songesand-chest-3-drawers",
      name: "SONGESAND Chest of 3 drawers",
      imageUrl: "https://www.ikea.com/th/en/images/products/songesand-chest-of-3-drawers-brown__0628112_pe693692_s5.jpg",
      description: "Chest of 3 drawers, brown, 82x81 cm",
      dimensions: "82x81 cm",
      price: 5990,
      rating: 5
    },
    {
      id: "songesand-chest-4-drawers",
      name: "SONGESAND Chest of 4 drawers",
      imageUrl: "https://www.ikea.com/th/en/images/products/songesand-chest-of-4-drawers-brown__0628123_pe693702_s5.jpg",
      description: "Chest of 4 drawers, brown, 82x104 cm",
      dimensions: "82x104 cm",
      price: 6990,
      rating: 5
    },
    {
      id: "smastad-platsa-chest-3-drawers",
      name: "SMÅSTAD / PLATSA Chest of 3 drawers",
      imageUrl: "https://www.ikea.com/th/en/images/products/smastad-platsa-chest-of-3-drawers-white-white__0972301_pe811551_s5.jpg",
      description: "Chest of 3 drawers, white/white, 60x57x63 cm",
      dimensions: "60x57x63 cm",
      price: 5050,
      rating: 4
    },
    {
      id: "hauga-chest-3-drawers",
      name: "HAUGA Chest of 3 drawers",
      imageUrl: "https://www.ikea.com/th/en/images/products/hauga-chest-of-3-drawers-white__0898314_pe782343_s5.jpg",
      description: "Chest of 3 drawers, white, 70x84 cm",
      dimensions: "70x84 cm",
      price: 3990,
      rating: 5
    },
    {
      id: "malm-chest-6-drawers-white",
      name: "MALM Chest of 6 drawers",
      imageUrl: "https://www.ikea.com/th/en/images/products/malm-chest-of-6-drawers-white__0484884_pe621348_s5.jpg",
      description: "Chest of 6 drawers, white, 80x123 cm",
      dimensions: "80x123 cm",
      price: 4990,
      rating: 5
    },
    {
      id: "vihals-chest-4-drawers",
      name: "VIHALS Chest of 4 drawers",
      imageUrl: "https://www.ikea.com/th/en/images/products/vihals-chest-of-4-drawers-white-anchor-unlock-function__0948875_pe799256_s5.jpg",
      description: "Chest of 4 drawers, white/anchor/unlock-function, 70x47x90 cm",
      dimensions: "70x47x90 cm",
      price: 3990,
      rating: 5
    },
    {
      id: "brimnes-dressing-table",
      name: "BRIMNES Dressing table",
      imageUrl: "https://www.ikea.com/th/en/images/products/brimnes-dressing-table-white__0627060_pe693140_s5.jpg",
      description: "Dressing table, white, 70x42 cm",
      dimensions: "70x42 cm",
      price: 3990,
      rating: 3
    },
    {
      id: "gursken-chest-3-drawers",
      name: "GURSKEN Chest of 3 drawers",
      imageUrl: "https://www.ikea.com/th/en/images/products/gursken-chest-of-3-drawers-light-beige__0919948_pe787172_s5.jpg",
      description: "Chest of 3 drawers, light beige, 69x67 cm",
      dimensions: "69x67 cm",
      price: 1490,
      rating: 5
    },
    {
      id: "malm-chest-3-drawers",
      name: "MALM Chest of 3 drawers",
      imageUrl: "https://www.ikea.com/th/en/images/products/malm-chest-of-3-drawers-white__0484879_pe621335_s5.jpg",
      description: "Chest of 3 drawers, white, 80x78 cm",
      dimensions: "80x78 cm",
      price: 3290,
      rating: 5
    },
    {
      id: "malm-chest-6-drawers-white",
      name: "MALM Chest of 6 drawers",
      imageUrl: "https://www.ikea.com/th/en/images/products/malm-chest-of-6-drawers-white__0484888_pe621358_s5.jpg",
      description: "Chest of 6 drawers, white, 160x78 cm",
      dimensions: "160x78 cm",
      price: 6290,
      isTopSeller: true,
      rating: 5
    },
    {
      id: "malm-chest-4-drawers",
      name: "MALM Chest of 4 drawers",
      imageUrl: "https://www.ikea.com/th/en/images/products/malm-chest-of-4-drawers-white__0484894_pe621346_s5.jpg",
      description: "Chest of 4 drawers, white, 80x100 cm",
      dimensions: "80x100 cm",
      price: 4290,
      isTopSeller: true,
      rating: 5
    },
    
    // Mirrors and Tables
    {
      id: "lindbyn-table-mirror",
      name: "LINDBYN Table mirror",
      imageUrl: "https://www.ikea.com/th/en/images/products/lindbyn-table-mirror-black__0776226_pe757970_s5.jpg",
      description: "Table mirror, black, 14x27 cm",
      dimensions: "14x27 cm",
      price: 790,
      rating: 5
    },
    {
      id: "karmsund-table-mirror",
      name: "KARMSUND Table mirror",
      imageUrl: "https://www.ikea.com/th/en/images/products/karmsund-table-mirror-black__0417581_pe574533_s5.jpg",
      description: "Table mirror, black, 27x43 cm",
      dimensions: "27x43 cm",
      price: 590,
      rating: 4
    },
    {
      id: "ikornnes-table-mirror",
      name: "IKORNNES Table mirror",
      imageUrl: "https://www.ikea.com/th/en/images/products/ikornnes-table-mirror-ash__0552322_pe659099_s5.jpg",
      description: "Table mirror, ash, 27x40 cm",
      dimensions: "27x40 cm",
      price: 1290,
      rating: 5
    },
    {
      id: "hemnes-dressing-table",
      name: "HEMNES Dressing table",
      imageUrl: "https://www.ikea.com/th/en/images/products/hemnes-dressing-table-with-mirror-white__0627090_pe693149_s5.jpg",
      description: "Dressing table, white, 100x50 cm",
      dimensions: "100x50 cm",
      price: 9990,
      rating: 5
    },
    {
      id: "vittsjo-laptop-table",
      name: "VITTSJÖ Laptop table",
      imageUrl: "https://www.ikea.com/th/en/images/products/vittsjo-laptop-table-white-glass__0736386_pe740514_s5.jpg",
      description: "Laptop table, white/glass, 100x36 cm",
      dimensions: "100x36 cm",
      price: 990,
      rating: 5
    },
    {
      id: "granvag-table-mirror",
      name: "GRANVÅG Table mirror",
      imageUrl: "https://www.ikea.com/th/en/images/products/granvag-table-mirror-pink__1134163_pe878301_s5.jpg",
      description: "Table mirror, pink, 23x33 cm",
      dimensions: "23x33 cm",
      price: 499,
      rating: 5
    },
    {
      id: "lassbyn-table-mirror",
      name: "LASSBYN Table mirror",
      imageUrl: "https://www.ikea.com/th/en/images/products/lassbyn-table-mirror-gold-colour__0817861_pe774210_s5.jpg",
      description: "Table mirror, gold-colour, 17 cm",
      dimensions: "17 cm",
      price: 399,
      rating: 4
    },
    {
      id: "kullaskog-plant-stand",
      name: "KULTURSKOG Plant stand",
      imageUrl: "https://www.ikea.com/th/en/images/products/kulturskog-plant-stand-black__1158993_pe887629_s5.jpg",
      description: "Plant stand, black, 58 cm",
      dimensions: "58 cm",
      price: 1490
    },
    {
      id: "idanas-side-table",
      name: "IDANÄS Side table",
      imageUrl: "https://www.ikea.com/th/en/images/products/idanas-side-table-white__1160553_pe888443_s5.jpg",
      description: "Side table, white, 46x36 cm",
      dimensions: "46x36 cm",
      price: 3590,
      rating: 5
    },
    {
      id: "stomso-wall-bedside-table",
      name: "STOMSÖ Wall-mounted bedside table",
      imageUrl: "https://www.ikea.com/th/en/images/products/stomso-wall-mounted-bedside-table-birch-effect-white-blue__1158332_pe887407_s5.jpg",
      description: "Wall-mounted bedside table, birch effect white/blue, 36x29x20 cm",
      dimensions: "36x29x20 cm",
      price: 990,
      rating: 4
    },
    {
      id: "kullen-chest-2-drawers",
      name: "KULLEN Chest of 2 drawers",
      imageUrl: "https://www.ikea.com/th/en/images/products/kullen-chest-of-2-drawers-white__0651488_pe706981_s5.jpg",
      description: "Chest of 2 drawers, white, 35x49 cm",
      dimensions: "35x49 cm",
      price: 990,
      rating: 4
    },
    {
      id: "gullaberg-bedside-table",
      name: "GULLABERG Bedside table",
      imageUrl: "https://www.ikea.com/th/en/images/products/gullaberg-bedside-table-with-1-drawer-with-shelf-white__1217831_pe913243_s5.jpg",
      description: "Bedside table, with 1 drawer with shelf/white, 53x43x69 cm",
      dimensions: "53x43x69 cm",
      price: 2990,
      isTopSeller: true
    }
  ];

  // Get budget range for filtering
  const getBudgetRange = () => {
    if (!budget) return { min: 0, max: Infinity };
    
    // Extract the range from budget string (format: "฿X - ฿Y")
    const match = budget.match(/฿([\d,]+) - ฿([\d,]+)/);
    if (!match) return { min: 0, max: Infinity };
    
    const min = parseInt(match[1].replace(/,/g, ''), 10);
    const max = parseInt(match[2].replace(/,/g, ''), 10);
    
    return { min, max };
  };

  // Generate furniture recommendations based on room type, style, and existing furniture
  useEffect(() => {
    const generateRecommendations = () => {
      if (!isBoqGenerated) return;
      
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        const { min, max } = getBudgetRange();
        
        // Filter catalog items based on budget constraints
        let filteredItems = ikeaCatalog.filter(item => 
          item.price >= min && item.price <= max
        );
        
        // Filter by furniture type based on room
        if (roomType === 'bedroom') {
          filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes('bedside') || 
            item.name.toLowerCase().includes('chest') ||
            item.name.toLowerCase().includes('dresser') ||
            item.name.toLowerCase().includes('mirror')
          );
        } else if (roomType === 'living-room') {
          filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes('coffee') || 
            item.name.toLowerCase().includes('side') ||
            item.name.toLowerCase().includes('sofa') ||
            item.name.toLowerCase().includes('armchair') ||
            item.name.toLowerCase().includes('nest')
          );
        }
        
        // Prioritize items that match the style preference
        filteredItems.sort((a, b) => {
          const aMatchesStyle = a.description.toLowerCase().includes(style.toLowerCase());
          const bMatchesStyle = b.description.toLowerCase().includes(style.toLowerCase());
          
          if (aMatchesStyle && !bMatchesStyle) return -1;
          if (!aMatchesStyle && bMatchesStyle) return 1;
          
          // If both match or don't match style, prioritize top sellers
          if (a.isTopSeller && !b.isTopSeller) return -1;
          if (!a.isTopSeller && b.isTopSeller) return 1;
          
          // Finally sort by price (lower first)
          return a.price - b.price;
        });
        
        // Limit to 5 items
        const finalRecommendations = filteredItems.slice(0, 5);
        
        setRecommendations(finalRecommendations);
        setIsLoading(false);
      }, 1000);
    };
    
    generateRecommendations();
  }, [roomType, style, furnitureList, isBoqGenerated, budget]);

  const handleSelectFurniture = (furniture: FurnitureItem) => {
    setSelectedFurniture(furniture);
    toast({
      title: "Furniture Selected",
      description: "If you want this furniture in your design, please click 'Regenerate Design'",
    });
    onSelectFurniture(furniture);
  };

  if (!isBoqGenerated) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Furniture Recommendations</h3>
        <p className="text-muted-foreground">IKEA furniture that matches your design style and budget</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Finding perfect furniture matches...</p>
          </div>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {recommendations.map((furniture) => (
              <Card key={furniture.id} className={`overflow-hidden transition-all ${selectedFurniture?.id === furniture.id ? 'ring-2 ring-brand-500' : ''}`}>
                <div className="flex flex-row h-28">
                  <div className="w-28 h-28 relative overflow-hidden">
                    {furniture.isTopSeller && (
                      <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-1 py-0.5 z-10">
                        Top seller
                      </div>
                    )}
                    <img 
                      src={furniture.imageUrl} 
                      alt={furniture.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium line-clamp-1">{furniture.name}</h4>
                        {furniture.rating && (
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`h-3 w-3 ${i < furniture.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{furniture.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium">฿{furniture.price.toLocaleString()}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSelectFurniture(furniture)}
                        className={selectedFurniture?.id === furniture.id ? 'bg-brand-500 text-white hover:bg-brand-600' : ''}
                      >
                        {selectedFurniture?.id === furniture.id ? 'Selected' : 'Select'}
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
          
          {selectedFurniture && (
            <div className="bg-muted p-4 rounded-md text-center text-sm">
              <p>If you want the {selectedFurniture.name} in your design, please click 'Regenerate Design'</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-muted rounded-md p-4 text-center">
          <p className="text-muted-foreground">No recommendations available within your selected budget range. Consider adjusting your budget or contact our sales team.</p>
        </div>
      )}
    </div>
  );
};

export default FurnitureRecommendations;
