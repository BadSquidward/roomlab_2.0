
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-16 bg-brand-50">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-muted-foreground mb-8">
            Get started today with 3 free design tokens when you create an account
          </p>
          <Button size="lg" asChild className="gap-1">
            <Link to="/signup">
              Create Your Free Account <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
