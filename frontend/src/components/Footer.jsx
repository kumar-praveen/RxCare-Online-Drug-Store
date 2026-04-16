import React from "react";
import footerLinks from "../assets/footerLinks";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-20 bg-primary/5 border-t border-primary/10">
      {/* Main Footer Content */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-primary">Rx</span>Care
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Your trusted online pharmacy delivering quality medicines and
              healthcare products right to your doorstep. Your health is our
              priority.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col gap-2.5 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+1 (800) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>support@rxcare.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>123 Health Street, Medical District, NY 10001</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map(({ icon: Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary hover:text-white text-primary flex items-center justify-center transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-800 mb-4">
                  {section.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.url}
                        className="text-sm text-gray-500 hover:text-primary transition-colors duration-200"
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-primary/10 px-6 md:px-16 lg:px-24 xl:px-32 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            {[
              "✅ 100% Genuine Medicines",
              "🚚 Fast Delivery",
              "🔒 Secure Payments",
              "💊 Licensed Pharmacy",
            ].map((badge, idx) => (
              <span
                key={idx}
                className="text-xs text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm font-medium"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Payment Icons */}
          <div className="flex items-center gap-2">
            {["VISA", "MC", "UPI", "COD"].map((method, idx) => (
              <span
                key={idx}
                className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-2.5 py-1 rounded-md shadow-sm"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary/10 px-6 md:px-16 lg:px-24 xl:px-32 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} RxCare. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
