import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-4 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-sm text-gray-400 space-y-2">
          <p>Sorty Master™ - A URL Shortening Service</p>
          <p>© {currentYear} Metatronicx. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}