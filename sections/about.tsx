import Heading from "@/components/heading/heading";
import Card from "@/components/ui/card";

const aboutData = [
  {
    title: "About Us",
    content:
      "JengaSafi is at the forefront of integrating green and sustainable practices into the construction industry. We aim to shape a future where construction not only meets societal needs but also protects the environment.",
  },
  {
    title: "Our Project",
    content:
      "We focus on developing eco-friendly construction solutions, emphasizing sustainable materials, energy-efficient processes, and waste reduction strategies for long-lasting structures.",
  },
  {
    title: "Our Vision",
    content:
      "To lead the construction industry toward sustainability with innovative methods that reduce environmental impact while enhancing productivity and quality.",
  },
  {
    title: "Our Approach",
    content:
      "We combine cutting-edge technology with green building practices to create environmentally responsible and resource-efficient buildings.",
  },
  {
    title: "Future Plans",
    content:
      "JengaSafi will expand sustainability initiatives by collaborating with industry leaders, advocating for policy changes, and innovating in green building technologies.",
  },
];

export default function AboutSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black text-white px-4 lg:px-12 py-20">
      {/* Grain Overlay for Depth */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('/textures/grain.png')] mix-blend-overlay"></div>

      {/* Section Heading */}
      <Heading
        number="02"
        title_1="About"
        title_2="Us"
        textColor="text-white"
      />

      {/* Cards */}
      <div className="relative z-10 py-12 grid gap-8 md:grid-cols-2 2xl:grid-cols-3">
        {aboutData.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-green-100 shadow-md hover:shadow-xl hover:border-green-300 transition-all duration-300 ease-out"
          >
            {/* Decorative Gradient Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-lime-500 opacity-70"></div>

            {/* Content */}
            <div className="p-6 space-y-3">
              <h3 className="font-oswald text-xl font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed font-main">
                {item.content}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
