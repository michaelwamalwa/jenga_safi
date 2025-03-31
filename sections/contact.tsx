import { useState } from "react";
import axios, { AxiosError } from "axios";
import ContactCard from "@/components/cards/contact";
import Heading from "@/components/heading/heading";
import Card from "@/components/ui/card";
import { FcPhone } from "react-icons/fc";
import { AiTwotoneTool } from "react-icons/ai";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");
  
    try {
      const response = await axios.post("/api/contact", formData);
  
      if (response.status === 200) {
        setResponseMessage("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setResponseMessage("Failed to send message. Please try again.");
      }
    } catch (error) {
      setResponseMessage("An error occurred. Try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="pt-16 px-4 sm:px-6 lg:px-12 xl:px-16">
      <Heading number="04" title_1="Contact " title_2="Us" />
      <Card className="w-full max-w-5xl mx-auto">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Contact Cards */}
          <div className="flex flex-col gap-6">
            <ContactCard
              title="Call us directly at"
              icon={<FcPhone className="text-3xl" />}
              text="+254-110-179-220"
              btnText="Call Us"
            />
            <ContactCard
              title="Chat with us"
              icon={<AiTwotoneTool className="text-3xl text-gray-800" />}
              text="andikamichael163@gmail.com"
              btnText="Email Us"
            />
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-secondary-background border border-border rounded-lg p-6 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                <Input type="email" name="email" placeholder="Email Address" icon={<AiTwotoneTool />} value={formData.email} onChange={handleChange} required />
              </div>

              <Input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />

              <textarea
                name="message"
                placeholder="Your message..."
                value={formData.message}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 text-gray-800 resize-none focus:ring-2 focus:ring-primary"
                rows={5}
                required
              />

              <div className="flex justify-end">
                <Button type="submit" className="w-full sm:w-40 py-3 text-lg" disabled={loading}>
                  {loading ? "Sending..." : "Send"}
                </Button>
              </div>

              {responseMessage && (
                <p className={`mt-4 text-center ${responseMessage.includes("Failed") ? "text-red-500" : "text-green-500"}`}>
                  {responseMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}
