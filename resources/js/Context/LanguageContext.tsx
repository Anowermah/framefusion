import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations, Language } from '@/lib/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        const saved = localStorage.getItem('framefusion_lang') as Language;
        if (saved && (saved === 'en' || saved === 'bn')) {
            setLanguageState(saved);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('framefusion_lang', lang);
    };

    const t = (key: keyof typeof translations['en']): string => {
        const currentTranslations = translations[language] || translations.en;
        return currentTranslations[key] || translations.en[key] || (key as string);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        return {
            language: 'en' as Language,
            setLanguage: () => {},
            t: (key: keyof typeof translations['en']) => translations.en[key] || (key as string),
        };
    }
    return context;
};

