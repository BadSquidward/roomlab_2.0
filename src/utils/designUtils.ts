
// Helper function to get budget text from slider value
export const getBudgetText = (value: number) => {
  if (value <= 33) {
    return "฿10,000 - ฿300,000";
  } else if (value <= 66) {
    return "฿300,001 - ฿600,000";
  } else {
    return "฿600,001 - ฿1,000,000";
  }
};

// Sample BOQ data for the design result page
export const sampleBOQ = [
  { name: "Modern Gray Sofa", dimensions: "220 × 85 × 80 cm", quantity: 1, price: 29990 },
  { name: "Coffee Table - Oak", dimensions: "120 × 60 × 45 cm", quantity: 1, price: 15490 },
  { name: "Side Table", dimensions: "45 × 45 × 55 cm", quantity: 2, price: 4990 },
  { name: "Floor Lamp", dimensions: "35 × 35 × 165 cm", quantity: 1, price: 6890 },
  { name: "Area Rug - Light Gray", dimensions: "200 × 300 cm", quantity: 1, price: 12990 },
  { name: "Wall Art Set", dimensions: "50 × 70 cm", quantity: 3, price: 2990 },
  { name: "Decorative Cushions", dimensions: "45 × 45 cm", quantity: 4, price: 1290 },
  { name: "Bookshelf", dimensions: "90 × 30 × 180 cm", quantity: 1, price: 18990 },
];

// Sample design data
export const sampleDesign = {
  imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000&auto=format&fit=crop",
  roomType: "living-room",
  style: "Modern",
  colorScheme: "Neutral",
  dimensions: "4m × 3m × 2.5m",
};
