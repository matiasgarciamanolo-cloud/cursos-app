import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

export const Header: React.FC<{ reset: () => void }> = ({ reset }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={reset}
        >
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <BookOpen size={20} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            CursoAPP
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <span className="hidden sm:flex items-center gap-1">
            <Sparkles size={16} className="text-yellow-500" />
            AI Mentor
          </span>
        </div>
      </div>
    </header>
  );
};