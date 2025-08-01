'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera, Menu, X, Phone, AtSign } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl sm:text-2xl font-bold text-wedding-gold flex items-center gap-2">
            <Camera className="w-6 h-6 sm:w-7 sm:h-7" />
            <span className="hidden xs:inline">HafiPortrait</span>
            <span className="xs:hidden">Hafi</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-wedding-gold transition-colors">
              Beranda
            </Link>
            <Link href="/#gallery" className="text-gray-600 hover:text-wedding-gold transition-colors">
              Galeri
            </Link>
            <Link href="/#pricing" className="text-gray-600 hover:text-wedding-gold transition-colors">
              Harga
            </Link>
            <Link href="/#contact" className="text-gray-600 hover:text-wedding-gold transition-colors">
              Kontak
            </Link>
          </nav>

          {/* Desktop Admin Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              asChild
              className="bg-wedding-gold hover:bg-wedding-gold/90 mobile-button"
            >
              <Link href="/admin">
                Admin
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button 
              asChild
              size="sm"
              className="bg-wedding-gold hover:bg-wedding-gold/90 text-xs px-3"
            >
              <Link href="/admin">
                Admin
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="touch-target"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            <Link 
              href="/" 
              className="block px-4 py-3 text-gray-600 hover:text-wedding-gold hover:bg-gray-50 transition-colors touch-target"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link 
              href="/#gallery" 
              className="block px-4 py-3 text-gray-600 hover:text-wedding-gold hover:bg-gray-50 transition-colors touch-target"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Galeri
            </Link>
            <Link 
              href="/#pricing" 
              className="block px-4 py-3 text-gray-600 hover:text-wedding-gold hover:bg-gray-50 transition-colors touch-target"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Harga
            </Link>
            <Link 
              href="/#contact" 
              className="block px-4 py-3 text-gray-600 hover:text-wedding-gold hover:bg-gray-50 transition-colors touch-target"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kontak
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}