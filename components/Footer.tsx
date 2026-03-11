
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r text-center from-indigo-950 via-purple-900 to-indigo-950 text-gray-200 py-6 mt-10 border-t border-purple-500/30 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-slate-400 flex items-center justify-center">
          Made by: 
          <a 
            href="https://github.com/Karansri123" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-teal-400 hover:text-teal-300 hover:underline transition-colors mx-1.5 font-semibold"
          >
            Karan 
          </a>
        </p>
        <p className="text-xs text-slate-500 mt-2.5">
          &copy; {new Date().getFullYear()} OpenSource - Navigator AI. Explore with curiosity & innovate with purpose.
        </p>
      </div>
    </footer>
  );
};

export default Footer;