import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, Phone, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-200 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center mb-2">
              <img 
                src="https://res.cloudinary.com/dada5hjp3/image/upload/v1748081363/Rashmi-logo-dark_mzwfr8.png" 
                alt="Rashmi Metaliks" 
                className="h-16 mb-2"
              />
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              World's 2nd largest DI pipe manufacturer with 770,000 MT annual capacity.
            </p>
            <div className="flex items-center gap-2 text-sm text-neutral-400 hover:text-rashmi-red transition-colors pt-2">
              <MapPin size={16} className="text-rashmi-red" />
              <span>Kharagpur, West Bengal, India</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-400 hover:text-rashmi-red transition-colors">
              <Phone size={16} className="text-rashmi-red" />
              <a href="tel:+913322624971">+91-33-2262-4971</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-400 hover:text-rashmi-red transition-colors">
              <Mail size={16} className="text-rashmi-red" />
              <a href="mailto:info@rashmimetaliks.com">info@rashmimetaliks.com</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['About Us', 'Products', 'Certifications', 'CSR', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a 
                    href={`https://www.rashmigroup.com/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-neutral-400 hover:text-rashmi-red transition-colors flex items-center gap-1.5 text-sm"
                  >
                    <ChevronRight size={14} />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              {['DI Pipes', 'DI Fittings', 'Pig Iron', 'Coke', 'Billets', 'TMT Bars'].map((item) => (
                <li key={item}>
                  <a 
                    href={`https://www.rashmigroup.com/products/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-neutral-400 hover:text-rashmi-red transition-colors flex items-center gap-1.5 text-sm"
                  >
                    <ChevronRight size={14} />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Business Hours</h3>
            <div className="space-y-2 text-sm text-neutral-400">
              <div className="flex items-start gap-2">
                <Clock size={16} className="text-rashmi-red shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-neutral-300">Our offices are open:</p>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 1:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
              <p className="pt-2">
                For vendor registration inquiries, please submit your profile through our online form.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-800 mt-12 pt-6 text-sm text-neutral-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Rashmi Metaliks Ltd. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="https://www.rashmigroup.com/privacy-policy" className="hover:text-rashmi-red transition-colors">Privacy Policy</a>
            <a href="https://www.rashmigroup.com/terms-and-conditions" className="hover:text-rashmi-red transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 