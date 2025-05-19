
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <section className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">About RoomLab</h1>
            <p className="text-xl text-muted-foreground">
              Revolutionizing interior design with AI technology
            </p>
          </div>
          
          <div className="prose prose-lg mx-auto">
            <p>
              Founded in 2023, RoomLab is a pioneering company that combines cutting-edge AI technology with interior design expertise to revolutionize how people visualize and create their dream spaces.
            </p>
            
            <p>
              Our mission is to make professional interior design accessible to everyone. We believe that everyone deserves to live in a space that feels both beautiful and functional, regardless of budget or design experience.
            </p>
            
            <h2>Our Story</h2>
            <p>
              RoomLab was born from a simple observation: traditional interior design services are often expensive and time-consuming, while DIY approaches can be overwhelming without proper guidance.
            </p>
            
            <p>
              Our team of technologists and interior designers worked together to create an AI system that could generate realistic, beautiful interior designs based on user preferences while providing practical implementation guidance.
            </p>
            
            <h2>Our Technology</h2>
            <p>
              At RoomLab, we've developed proprietary AI technology that understands spatial relationships, design principles, and material combinations. Our system can generate photorealistic visualizations of interior spaces complete with detailed specifications for implementation.
            </p>
            
            <p>
              Unlike generic image generators, our AI has been specifically trained on interior design principles, ensuring that the generated designs are not only beautiful but also practical and implementable.
            </p>
            
            <h2>Our Team</h2>
            <p>
              RoomLab brings together experts from technology and design backgrounds. Our team includes software engineers, AI specialists, professional interior designers, and customer experience specialists all working together to create the best possible service for our users.
            </p>
            
            <h2>Our Vision</h2>
            <p>
              We envision a world where everyone can transform their living spaces into personalized sanctuaries that reflect their unique tastes and meet their specific needs. Through continuous innovation and improvement of our AI technology, we aim to make this vision a reality.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
