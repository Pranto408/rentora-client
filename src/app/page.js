import Banner from "@/components/homepage/Banner";
import FeaturedProperties from "@/components/homepage/FeaturedProperties";
import TopLocations from "@/components/homepage/TopLocations";
import TrustedOwners from "@/components/homepage/TrustedOwners";
import WhyChooseUs from "@/components/homepage/WhyChooseUs";


export default function Home() {
  return <div>
    <Banner />
    <FeaturedProperties/>
    <WhyChooseUs />
    <TopLocations />
    <TrustedOwners/>
  </div>;
}
