import React from "react";
import { Mail, Phone, Globe, MapPin, Heart } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="border-t border-gray-150 dark:border-gray-700 bg-white dark:bg-gray-950 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-rose-500 tracking-tight">
              amanbnb
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
              Discover premium stays, seamless bookings, and memorable travel
              experiences built with modern web technologies.
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
              <MapPin size={14} className="text-rose-500" />
              Delhi, India
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Support
            </h3>

            <div className="flex flex-col gap-3 text-sm">
              <button className="text-left text-gray-600 dark:text-gray-400 hover:text-rose-500 transition-colors">
                Help Center
              </button>

              <button className="text-left text-gray-600 dark:text-gray-400 hover:text-rose-500 transition-colors">
                FAQs
              </button>

              <button className="text-left text-gray-600 dark:text-gray-400 hover:text-rose-500 transition-colors">
                Privacy Policy
              </button>

              <button className="text-left text-gray-600 dark:text-gray-400 hover:text-rose-500 transition-colors">
                Terms of Service
              </button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Connect
            </h3>

            <div className="space-y-3">
              {/* Portfolio */}
              <a
                href="https://amankhan.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 transition-colors"
              >
                <Globe size={18} />
                Portfolio
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/amankhan7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 transition-colors"
              >
                <FaLinkedin size={18} />
                LinkedIn
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/amankhan-7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 transition-colors"
              >
                <FaGithub size={18} />
                GitHub
              </a>

              {/* Email */}
              <a
                href="mailto:your@email.com"
                className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 transition-colors"
              >
                <Mail size={18} />
                amankhan280401@email.com
              </a>

              {/* Phone */}
              <a
                href="tel:+919999999999"
                className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 transition-colors"
              >
                <Phone size={18} />
                +91 99999 99999
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-0">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} amanbnb. All rights reserved.
          </p>

          <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
            Built with
            <Heart size={12} className="fill-rose-500 text-rose-500" />
            by Aman
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
