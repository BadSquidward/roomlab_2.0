
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SignUpForm from "@/components/auth/SignUpForm";

const SignUpPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12">
        <SignUpForm />
      </main>
      <Footer />
    </div>
  );
};

export default SignUpPage;
