import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

interface UiValue {
  language: 'en' | 'es';
  setLanguage: (language: 'en' | 'es') => void;
}

const UiContext = createContext<UiValue | null>(null);

export function UiProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const value = useMemo(() => ({ language, setLanguage }), [language]);
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const value = useContext(UiContext);
  if (!value) throw new Error('useUi must be used within UiProvider');
  return value;
}
