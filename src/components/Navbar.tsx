import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-50 h-screen w-screen flex flex-col">
      <header className="relative z-10 py-4 md:py-6">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="#" title="" className="flex rounded outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2">
                <h2 className="text-2xl font-semibold">Advance IDE</h2>
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                aria-expanded={isOpen ? 'true' : 'false'}
                aria-label="Toggle navigation"
              >
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                  />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <div className={`md:flex md:items-center md:justify-center md:space-x-10 md:absolute md:inset-y-0 md:left-1/2 md:-translate-x-1/2 lg:space-x-16 ${isOpen ? 'block' : 'hidden'} md:block`}>
              <Link to="/">
                <a title="" className="block text-lg font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2">
                  Home
                </a>
              </Link>

              <Link to="/event-tracker">
                <a title="" className="block text-lg font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2">
                  Event Tracker
                </a>
              </Link>

              <Link to="/code">
                <a title="" className="block text-lg font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2">
                  Code Editor
                </a>
              </Link>
            </div>

            {/* Demo Button (always visible on desktop) */}
            <div className="hidden md:flex">
              <a
                href="https://drive.google.com/file/d/1q6cs_bOna6zD4aUsrZDDQEtRB4mC_NRP/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                title="View Demo"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-bold leading-7 text-white transition-all duration-200 bg-gray-900 border border-transparent rounded hover:bg-gray-600 font-pj focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                role="button"
              >
                View Demo
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu (visible when hamburger is clicked) */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-1">
          <Link to="/">
            <a className="block text-lg font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2">
              Home
            </a>
          </Link>

          <Link to="/event-tracker">
            <a className="block text-lg font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2">
              Event Tracker
            </a>
          </Link>

          <Link to="/code">
            <a className="block text-lg font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2">
              Code Editor
            </a>
          </Link>

          <a
            href="https://drive.google.com/file/d/1q6cs_bOna6zD4aUsrZDDQEtRB4mC_NRP/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-lg font-bold text-white bg-gray-900 rounded py-3 px-4 transition-all duration-200 hover:bg-gray-600"
          >
            View Demo
          </a>
        </div>
      )}
    </div>
  );
};
