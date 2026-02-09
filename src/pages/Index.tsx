import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import HeroSection from "@/components/HeroSection";
import TeacherSpotlight from "@/components/TeacherSpotlight";
import OrganizationSection from "@/components/OrganizationSection";
import StudentRoster from "@/components/StudentRoster";
import Footer from "@/components/Footer";

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
        <Footer />
      </div>
    </>
  );
};

export default Index;
