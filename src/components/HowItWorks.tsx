
import { CheckCircle, LayoutDashboard, ListChecks, Image } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <LayoutDashboard className="h-10 w-10 text-brand-500" />,
      title: "Select Room Type & Preferences",
      description: "Choose your room type and input your preferences including dimensions, style, and color scheme."
    },
    {
      icon: <Image className="h-10 w-10 text-brand-500" />,
      title: "Generate Design",
      description: "Our AI will create a custom interior design based on your specifications and preferences."
    },
    {
      icon: <ListChecks className="h-10 w-10 text-brand-500" />,
      title: "Receive Bill of Quantities",
      description: "Get a detailed list of furniture and decor items used in your design with cost estimates."
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-brand-500" />,
      title: "Finalize Your Design",
      description: "Export your design and BOQ or regenerate the design until you're satisfied."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="text-muted-foreground mt-4">
            Transform your space in four simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="mb-4">{step.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
