import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ className, ...props }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Explore Courses", href: "/" },
    { name: "My Learning", href: "/dashboard" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header 
      className={cn(
        "bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50",
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">LearnFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors duration-200",
                  isActive(item.href)
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-700 hover:text-purple-600"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar placeholder="Search courses..." />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <ApperIcon name={isMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {/* Search Bar - Mobile */}
              <div className="px-2">
                <SearchBar placeholder="Search courses..." />
              </div>
              
              {/* Navigation Links */}
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200",
                      isActive(item.href)
                        ? "text-purple-600 bg-purple-50"
                        : "text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;