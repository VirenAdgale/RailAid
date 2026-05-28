import React from "react";
import { Mail, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h2 className="mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
            RailAid
          </h2>
        </div>

        <div className="mb-6 px-4 text-center">
          <p className="mb-2 text-lg font-semibold text-green-300">
            Making railway travel seamless and accessible
          </p>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-gray-400">
            RailAid helps passengers with luggage transport, assisted mobility,
            and practical station support with a clearer digital experience.
          </p>
        </div>

        <div className="mb-6 border-t border-gray-800 pt-6">
          <h3 className="mb-4 text-center text-sm font-semibold text-gray-300">
            Connect With Us
          </h3>

          <div className="flex flex-col items-center gap-2 text-sm text-gray-400">
            <a
              href="mailto:support@railaid.com"
              className="flex items-center gap-2 transition-colors hover:text-blue-400"
            >
              <Mail className="h-4 w-4" />
              <span>support@railaid.com</span>
            </a>
            <a
              href="tel:+911234567890"
              className="flex items-center gap-2 transition-colors hover:text-blue-400"
            >
              <Phone className="h-4 w-4" />
              <span>+91 123 456 7890</span>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 text-center">
          <p className="text-xs text-gray-500">
            Copyright {currentYear} RailAid. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
