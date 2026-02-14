import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/layout/LoadingScreen";
import HeroSection from "@/components/features/HeroSection";
import TeacherSpotlight from "@/components/features/TeacherSpotlight";
import OrganizationSection from "@/components/features/OrganizationSection";
import StudentRoster from "@/components/features/StudentRoster";
import GallerySection from "@/components/features/GallerySection";
import ChatSection from "@/components/features/ChatSection";
import Footer from "@/components/layout/Footer";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <div className={`min-h-screen bg-background overflow-x-hidden ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
        <HeroSection />
        <TeacherSpotlight />
        <OrganizationSection />
        <StudentRoster />
        <GallerySection />
        <ChatSection />
        <Footer />
      </div>
    </>
  );


};

export default Index;
