import Heading from "@/components/heading/heading";
import FeaturedCard from "@/components/cards/featured/featured-card";
import { featuredData } from "@/data";
import ExpendableFeatured from "@/components/expendables/expendable-featured";

const MainFeatured = featuredData[0];

export default function FeaturedSection() {
  return (
    <div className="pt-24 px-3 lg:px-8">
      <Heading number="01" title_1="Featured" title_2="Section"/>

      {/* Main Featured Card */}
      <FeaturedCard
        active
        title={MainFeatured.title}
        tag={MainFeatured.tag}
        video={MainFeatured.video}  // Pass the local video path
      />

      <div className="mt-24">
        <ExpendableFeatured />
      </div>
    </div>
  );
}
