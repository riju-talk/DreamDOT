"use client";

import { ReactNode } from "react";

interface ScrollableContentProps {
  children: ReactNode;
  className?: string;
}

export function ScrollableContent({ 
  children, 
  className = "" 
}: ScrollableContentProps) {
  return (
    <div className="flex-1 min-h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden relative">
      {/* 
        Content wrapper with responsive padding
        - Mobile (<768px): 70px bottom padding for fixed mobile nav
        - Tablet/Desktop (>=768px): No bottom padding needed as sidebar takes left space
        
        The pb-[70px] ensures mobile nav doesn't hide content on small screens.
        md:pb-0 removes bottom padding on tablets and up where bottom nav is hidden.
      */}
      <div className={`min-h-full pb-[70px] md:pb-0 ${className}`}>
        {children}
      </div>
    </div>
  );
}
