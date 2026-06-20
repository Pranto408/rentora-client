import Banner from "@/components/homepage/Banner";
import TopLocations from "@/components/homepage/TopLocations";
import TrustedOwners from "@/components/homepage/TrustedOwners";
import WhyChooseUs from "@/components/homepage/WhyChooseUs";


export default function Home() {
  return <div>
    <Banner />
    <WhyChooseUs />
    <TopLocations />
    <TrustedOwners/>
  </div>;
}
