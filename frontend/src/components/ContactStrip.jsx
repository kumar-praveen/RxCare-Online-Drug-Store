import React from "react";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const contacts = [
  {
    icon: Phone,
    label: "Call Us",
    value: "+1 (800) 123-4567",
    sub: "Mon - Sat, 9am - 8pm",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "support@rxcare.com",
    sub: "We reply within 24 hours",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "123 Health Street, NY",
    sub: "Medical District, NY 10001",
    color: "text-red-400",
    bg: "bg-red-50",
  },
];

const ContactStrip = () => {
  const { navigate } = useAppContext();

  return (
    <div className="mt-20 mb-10 bg-primary/5 border border-primary/10 rounded-2xl px-8 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wide">
          Get In Touch
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-3">
          We're Here to Help
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Have questions about your medicines or orders? Reach out to us
          anytime.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {contacts.map((contact, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className={`${contact.bg} p-3 rounded-full mb-3`}>
              <contact.icon className={`w-5 h-5 ${contact.color}`} />
            </div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
              {contact.label}
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {contact.value}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{contact.sub}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={() => {
            navigate("/contact");
            scrollTo(0, 0);
          }}
          className="group inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dull text-white rounded-full text-sm font-medium transition-all shadow-md"
        >
          Send Us a Message
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ContactStrip;
