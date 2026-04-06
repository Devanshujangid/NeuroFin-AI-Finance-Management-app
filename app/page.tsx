import HeroSection from "@/components/landing/HeroSection"
import StatsSection from "@/components/landing/StatsSection";
import KeyFeatures from "@/components/landing/KeyFeatures";
import HowItWorks from "@/components/landing/HowitWorks";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/footer";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// connect your landing page componenets in this file!
export default async function Home() {
  // const { userId } = await auth();
  // if (userId ) {
  //   redirect("/dashboard");
  // }
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
