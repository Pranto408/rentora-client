import Banner from "@/components/homepage/Banner";
import CustomerReviews from "@/components/homepage/CustomerReviews";
import FeaturedProperties from "@/components/homepage/FeaturedProperties";
import TopLocations from "@/components/homepage/TopLocations";
import TrustedOwners from "@/components/homepage/TrustedOwners";
import WhyChooseUs from "@/components/homepage/WhyChooseUs";


export default function Home() {
  return <div>
    <Banner />
    <FeaturedProperties/>
    <WhyChooseUs />
    <CustomerReviews/>
    <TopLocations />
    <TrustedOwners/>
  </div>;
}
