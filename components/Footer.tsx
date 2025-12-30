import React from 'react';
import { Heart, Facebook, Twitter, Instagram, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-serif font-bold text-white mb-4">Hello2026</h3>
            <p className="text-gray-400 max-w-xs leading-relaxed">
              Celebrating new beginnings, shared moments, and a future bright with possibility. Join us as we welcome the New Year with hope and joy.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Resources & Giving</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                  <a href="#" className="hover:text-yellow-400 transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2 group-hover:bg-yellow-400 transition-colors"></span>
                    Local NYE Events Guide
                  </a>
              </li>
              <li>
                  <a href="#" className="hover:text-yellow-400 transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2 group-hover:bg-yellow-400 transition-colors"></span>
                    Global Countdown Stream
                  </a>
              </li>
              <li>
                  <a href="#" className="hover:text-yellow-400 transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2 group-hover:bg-yellow-400 transition-colors"></span>
                    Donate to Education Charities
                    <ExternalLink size={12} className="ml-1 opacity-50" />
                  </a>
              </li>
              <li>
                  <a href="#" className="hover:text-yellow-400 transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2 group-hover:bg-yellow-400 transition-colors"></span>
                    Support Food Banks
                    <ExternalLink size={12} className="ml-1 opacity-50" />
                  </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Connect</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="p-3 bg-gray-900 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-all transform hover:scale-110">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-3 bg-gray-900 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-all transform hover:scale-110">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-3 bg-gray-900 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-all transform hover:scale-110">
                <Instagram size={20} />
              </a>
            </div>
            <p className="text-gray-500 text-sm">
              Share your moments with <span className="text-yellow-500 font-bold">#Hello2026NYE</span>
            </p>
          </div>
        </div>
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; 2025 Hello2026 Celebration. All rights reserved.</p>
          <div className="flex items-center mt-4 md:mt-0">
            <span>Created by</span>
            <span className="mx-1 font-bold text-yellow-500 hover:text-yellow-400 transition-colors">codewithahmadb1</span>
            <Heart size={14} className="ml-1 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;