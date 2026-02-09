import HeroSection from "@/components/HeroSection";
import TeacherSpotlight from "@/components/TeacherSpotlight";
import OrganizationSection from "@/components/OrganizationSection";
import StudentRoster from "@/components/StudentRoster";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <HeroSection />
      <TeacherSpotlight />
      <OrganizationSection />
      <StudentRoster />
      <Footer />
    </div>
  );
};

export default Index;
