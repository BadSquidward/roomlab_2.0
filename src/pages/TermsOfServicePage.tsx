
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfServicePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-12">
        <div className="max-w-3xl mx-auto prose">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-6">Last updated: May 19th, 2025</p>
          
          <p>
            Welcome to RoomLab, a service provided by RoomLab Co., Ltd. ("RoomLab", "we", "us", or "our"). 
            RoomLab is a Software-as-a-Service (SaaS) platform that allows users to generate interior design 
            images using artificial intelligence. By accessing and using our services, you ("user", "you", or "your") 
            agree to be bound by these Terms of Service ("Terms"), which govern your access to and use of RoomLab.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Scope of Services</h2>
          <p>
            RoomLab provides a platform for generating AI-powered interior design images. Our services are 
            designed for both personal and commercial use, subject to the limitations outlined in these Terms 
            and according to the subscription plan you are enrolled in.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Subscription Plans and Usage Rights</h2>
          <p>
            RoomLab offers multiple subscription plans, each with specific usage rights. These rights, including 
            the extent to which generated images may be used for personal or commercial purposes, depend on 
            your current plan. It is your responsibility to ensure your chosen plan matches your intended usage. 
            Details on each subscription and usage rights are available on our pricing page. We reserve the right 
            to modify plans and pricing at any time. If prices change, we will provide advance notice where possible, 
            and you will have the option to cancel if you do not agree to the new terms.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Authorized Access and Use</h2>
          <p>
            You are allowed to access RoomLab only via our official website and in accordance with its intended purpose. 
            You may not use bots, browser extensions, or any form of automation that places excessive load on our system 
            or infrastructure. Additionally, you may not use the generated images to train other AI models or to create 
            competing services.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Copyright and Intellectual Property</h2>
          <p>
            The legal context around copyright and AI-generated content is evolving and may vary by jurisdiction. 
            To the extent permitted by law, we grant you rights to use images created through RoomLab in accordance 
            with your subscription. However, we make no guarantees regarding the uniqueness or originality of 
            generated images.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">User-Provided Content</h2>
          <p>
            When you upload images to RoomLab, you retain full ownership of your content. However, you grant us a 
            non-exclusive, royalty-free, worldwide license to use, reproduce, and adapt those images for service delivery, 
            quality assurance, and platform improvement. This may involve using anonymized and aggregated versions of your 
            content to enhance our AI systems. You confirm that you have the legal rights to upload and use the images you provide.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Data Storage and Deletion</h2>
          <p>
            While we work to ensure secure storage of your generated data, we cannot be held liable for any data loss. 
            Upon cancellation of your subscription, we may delete all associated data and images from our servers. 
            We strongly encourage users to back up their designs regularly.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless RoomLab Co., Ltd., its affiliates, directors, officers, employees, 
            and agents against any claims, damages, or expenses (including legal fees) resulting from your use of RoomLab, 
            including but not limited to claims involving intellectual property or copyright violations.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Refunds</h2>
          <p>
            Due to the computational costs associated with generating images, our default policy is no refunds. 
            However, we may review refund requests on a case-by-case basis at our sole discretion. 
            Refund decisions are final and made by RoomLab Co., Ltd.
          </p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Acceptable Use</h2>
          <p>
            You agree to use RoomLab only for lawful and appropriate purposes. You may not create or distribute images that:
          </p>
          <div className="pl-4 border-l-2 border-brand-100 my-4">
            <p>a. Are sexually explicit or pornographic in nature;</p>
            <p>b. Promote violence, discrimination, or hatred based on race, religion, gender, disability, or any protected class;</p>
            <p>c. Violate any laws or infringe intellectual property rights;</p>
            <p>d. Are otherwise deemed inappropriate by RoomLab Co., Ltd.</p>
          </div>
          <p>We reserve the right to remove such content and to suspend or terminate access for violations.</p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Governing Law and Jurisdiction</h2>
          <p>
            These Terms and your use of RoomLab are governed by the laws of Thailand. You agree to submit to the 
            exclusive jurisdiction of the courts located in Thailand to resolve any disputes related to these Terms.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
