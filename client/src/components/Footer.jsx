import React from 'react';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-slate-950 via-indigo-900 to-slate-800 text-white py-12 px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4 text-green-400">MediCampus</h3>
            <p className="text-slate-300 leading-relaxed mb-4">Smart Healthcare for Smart Students</p>
            <div className="flex gap-4">
              <a href="/" className="text-slate-300 hover:text-green-400 transition-colors duration-300" aria-label="Facebook">
                <Facebook />
              </a>
              <a href="#" className="text-slate-300 hover:text-green-400 transition-colors duration-300" aria-label="Twitter">
                <Twitter />
              </a>
              <a href="#" className="text-slate-300 hover:text-green-400 transition-colors duration-300" aria-label="Instagram">
                <Instagram />
              </a>
              <a href="#" className="text-slate-300 hover:text-green-400 transition-colors duration-300" aria-label="LinkedIn">
                <LinkedIn />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-slate-300 hover:text-green-400 transition-colors duration-300">About Us</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors duration-300">Services</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors duration-300">Contact</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors duration-300">Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors duration-300">Terms of Service</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors duration-300">Cookie Policy</a></li>
              <li><a href="#" className="text-slate-300 hover:text-green-400 transition-colors duration-300">Data Protection</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-slate-300">
              <li>📧 info@medicampus.edu</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>📍 University Campus</li>
              <li>🕒 Mon-Fri: 8AM-6PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-600 pt-4 text-center">
          <p className="text-slate-300 text-sm">&copy; 2024 MediCampus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;