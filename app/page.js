import HeroSlider from "./components/HeroSlider";
import FeaturedStudios from "./components/FeaturedStudios";
import CategorySection from "./components/CategorySection";
import HowBookingWorks from "./components/HowBookingWorks";
import HostGuarantee from "./components/HostGuarantee";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <FeaturedStudios />
      <CategorySection />
      <HowBookingWorks />
      <HostGuarantee />
    </>
  );
}