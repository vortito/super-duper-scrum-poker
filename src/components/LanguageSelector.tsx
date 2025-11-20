import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-slate-900/50 backdrop-blur-md p-1 rounded-lg border border-white/10">
            <Globe size={16} className="text-slate-400 ml-2" />
            <div className="flex">
                {(['es', 'en', 'fr'] as const).map((lang) => (
                    <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`
              px-2 py-1 rounded-md text-xs font-bold uppercase transition-all
              ${language === lang
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'}
            `}
                    >
                        {lang}
                    </button>
                ))}
            </div>
        </div>
    );
};
