import Heading from "@/components/heading/heading";
import Card from "@/components/ui/card";

const aboutData = [
  {
    title: "About Us",
    content:
      "Nexora is at the forefront of integrating green and sustainable practices into the construction industry. We aim to shape a future where construction not only meets societal needs but also protects the environment.",
  },
  {
    title: "Our Project",
    content:
      "Our project focuses on developing eco-friendly construction solutions. We emphasize the use of sustainable materials, energy-efficient processes, and waste reduction strategies to create long-lasting structures.",
  },
  {
    title: "Our Vision",
    content:
      "Our vision is to lead the construction industry toward sustainability by introducing innovative methods that reduce environmental impact while enhancing productivity and quality.",
  },
  {
    title: "Our Approach",
    content:
      "We take a holistic approach by combining cutting-edge technology with green building practices to create environmentally responsible and resource-efficient buildings.",
  },
  {
    title: "Future Plans",
    content:
      "Nexora plans to expand its sustainability initiatives by collaborating with industry leaders, advocating for policy changes, and driving innovations in sustainable building technologies.",
  },
];

export default function AboutSection() {
  return (
    <div className="pt-24 px-3 lg:px-8">
      <Heading number="02" title_1="About" title_2="Us" />
      <div className="space-y-4 py-8">
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-8 md:space-y-0 2xl:grid-cols-3">
          {aboutData.map((item, index) => (
            <Card
              key={index}
              title={item.title}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-6 rounded-lg"
            >
              <p className="text-gray-600 text-lg leading-relaxed">{item.content}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
