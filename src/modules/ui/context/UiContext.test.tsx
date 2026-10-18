import { act, renderHook } from '@testing-library/react';
import { STORAGE_KEYS } from '@/constants';
import i18n from '@/i18n';
import { UiProvider, useUi } from '@/modules/ui/context/UiContext';

describe('UiProvider', () => {
  beforeEach(async () => {
    localStorage.removeItem(STORAGE_KEYS.LANGUAGE);
    await i18n.changeLanguage('en');
  });
  afterEach(async () => {
    jest.restoreAllMocks();
    localStorage.removeItem(STORAGE_KEYS.LANGUAGE);
    await i18n.changeLanguage('en');
    document.documentElement.lang = 'en';
  });

  it('restores a saved language and synchronizes translations and document language', () => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, 'es');
    const { result } = renderHook(useUi, { wrapper: UiProvider });
    expect(result.current.language).toBe('es');
    expect(i18n.language).toBe('es');
    expect(document.documentElement.lang).toBe('es');
  });

  it('persists changes and restores them after remounting', () => {
    const first = renderHook(useUi, { wrapper: UiProvider });
    act(() => first.result.current.setLanguage('es'));
    expect(localStorage.getItem(STORAGE_KEYS.LANGUAGE)).toBe('es');
    expect(document.documentElement.lang).toBe('es');
    first.unmount();
    const second = renderHook(useUi, { wrapper: UiProvider });
    expect(second.result.current.language).toBe('es');
  });

  it('ignores unsupported persisted values and falls back to the current language', async () => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, 'fr');
    await i18n.changeLanguage('es-AR');
    const { result } = renderHook(useUi, { wrapper: UiProvider });
    expect(result.current.language).toBe('es');
    expect(document.documentElement.lang).toBe('es');
  });

  it('still changes language when localStorage is unavailable', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage unavailable');
    });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage unavailable');
    });
    const { result } = renderHook(useUi, { wrapper: UiProvider });
    expect(result.current.language).toBe('en');
    act(() => result.current.setLanguage('es'));
    expect(result.current.language).toBe('es');
    expect(i18n.language).toBe('es');
    expect(document.documentElement.lang).toBe('es');
  });

  it('requires a UiProvider', () => {
    expect(() => renderHook(useUi)).toThrow(
      'useUi must be used within UiProvider',
    );
  });
});
