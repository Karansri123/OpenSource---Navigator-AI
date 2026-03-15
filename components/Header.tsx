import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-5 border-b border-purple-500/30 shadow-lg bg-indigo-950/70 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span role="img" aria-label="compass" className="text-3xl md:text-4xl mr-3 filter drop-shadow-lg">🧭</span>
            <h1 
              className="text-2xl md:text-3xl font-bold text-pink-400 hover:text-pink-300 transition-colors duration-300"
              style={{ textShadow: '0 1px 3px rgba(236, 72, 153, 0.4)' }}
            >
              OpenSource - Navigator  <span className="text-purple-400">AI</span>
            </h1>
          </div>
          <p className="text-sm text-purple-200 hidden md:block">
            Your Compass to Open Source Innovation.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;