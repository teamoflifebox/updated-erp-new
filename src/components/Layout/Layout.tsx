import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A]/5 via-white to-[#9333EA]/5">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 p-6 relative ml-20 transition-all duration-300">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#1E3A8A]/10 to-[#9333EA]/10 rounded-full -translate-y-32 translate-x-32 pointer-events-none blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#1E3A8A]/10 to-[#9333EA]/10 rounded-full translate-y-24 -translate-x-24 pointer-events-none blur-2xl"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-[#1E3A8A]/10 py-4 ml-20">
        <div className="container-custom">
          <div className="flex justify-center items-center gap-4 text-xs text-slate-500">
            <span>© 2024 Oxford College</span>
            <span>•</span>
            <a href="#" className="hover:text-primary-600 transition-colors">
              Terms of Service
            </a>
            <span className="text-neutral-400">•</span> 
            <a href="#" className="text-neutral-600 hover:text-[#1E3A8A] transition-colors duration-200 hover:underline">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;