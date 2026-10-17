import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { STORAGE_KEYS } from '@/constants';
import i18n from '@/i18n';

export type SupportedLanguage = 'en' | 'es';

interface UiValue {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
}

const UiContext = createContext<UiValue | null>(null);

function readPersistedLanguage(): SupportedLanguage {
  if (typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      if (saved === 'en' || saved === 'es') {
        return saved;
      }
    } catch {
      // Ignore storage errors
    }
  }
  return i18n.language?.startsWith('es') ? 'es' : 'en';
}

export function UiProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<SupportedLanguage>(
    readPersistedLanguage,
  );

  const setLanguage = useCallback((nextLanguage: SupportedLanguage) => {
    setLanguageState(nextLanguage);
    try {
      window.localStorage.setItem(STORAGE_KEYS.LANGUAGE, nextLanguage);
    } catch {
      // Ignore storage errors
    }
    void i18n.changeLanguage(nextLanguage);
  }, []);

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage }),
    [language, setLanguage],
  );
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const value = useContext(UiContext);
  if (!value) throw new Error('useUi must be used within UiProvider');
  return value;
}
