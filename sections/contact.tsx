import { useState } from "react";
import ContactCard from "@/components/cards/contact";
import SelectInput from "@/components/ui/select-input";
import Heading from "@/components/heading/heading";
import Card from "@/components/ui/card";
import { FcPhone } from "react-icons/fc";
import { AiTwotoneTool } from "react-icons/ai";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
export default function ContactSection() {
  const [services, setServices] = useState<string[]>([]);
  console.log("services", services);
  return (
    <div className="pt-24 px-3 lg:px-8">
      <Heading number="04" title_1="Contact " title_2="Us" />
      <Card>
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          <div className="flex flex-col gap-8">
            <ContactCard
              title="Call us directly at"
              icon={<FcPhone className="fill-[#333] text-lg" />}
              text="+254-110-179-220"
              btnText="Call Us"
            />
            <ContactCard
              title="Chat with us"
              icon={<AiTwotoneTool className="fill-[#333] text-lg" />}
              text="andikamichael163@gmal.com"
              btnText="Email Us"
            />
          </div>
          {/*Contact Form */}
          <div className="lg:col-span-2 bg-secondary-background border border-border rounded-lg space-y-6 relative overflow-hidden py-5 px-[25px] shadow-md">
            <div className="flex flex-col lg:flex-row items-center justify-between mb-4 gap-8">
              <Input type="text" placeholder="Full Name" />
              <Input
                type="email"
                placeholder="Email Address"
                icon={<AiTwotoneTool />}
              />
            </div>
            <div className="flex items-center justify-between mb-4 gap-8">
              <Input type="text" placeholder="Subject" />
            </div>
            {/*Multiple select Wrapper */}
            <div className="flex flex-col gap-6">
              <div className="space-y-6">
                <h1 className="font-bold text-lg">What interests you?</h1>
                <div className="flex flex-wrap items-center justify-between mb-4 gap-8">
                  {/*Services */}
                  {serviceOptions.map((service) => (
                    <SelectInput 
                    key={service.id}
                    type="checkbox"
                    id={service.id}
                    text={service.text}
                    selectedOptions = {services}
                    setSelectedOptions={setServices}
                    allowMultiple
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end">
              <Button className="!w-74 !py-3 text-xl">Send</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

const serviceOptions = [
  {
    id: "sustainable",
    text: "Sustainable architectural design with energy-efficient solutions."
  },
  {
    id: "eco-friendly",
    text: "Use of eco-friendly materials to reduce environmental impact."
  },
  {
    id: "energyManagement",
    text: "Integration of renewable energy sources into building projects."
  },
  {
    id: "wasteReduction",
    text: "Innovative strategies to minimize construction waste."
  },
  {
    id: "smartTechnology",
    text: "Smart construction solutions for resource optimization and efficiency."
  }
];
