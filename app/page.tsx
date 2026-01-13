import HeroSection from "@/components/landing/HeroSection"
import StatsSection from "@/components/landing/StatsSection";
import KeyFeatures from "@/components/landing/KeyFeatures";
import HowItWorks from "@/components/landing/HowitWorks";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/footer";
// connect your landing page componenets in this file!
export default function Home() {
  return (
    <div>
      <HeroSection/>
      <StatsSection/>
      <KeyFeatures />
      <HowItWorks  />
      <FinalCTA    />
      <Footer />
    </div>
  );
}
