// src/content/hooks.ts
import { useMemo } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { contentProvider } from './provider';
import type { JLPTLevel, SupportedLanguage } from './types';

export function useExplanationLanguage(): SupportedLanguage {
  const explanationLanguage = useSettingsStore((s: any) => s.explanationLanguage);
  if (explanationLanguage === 'ta' || explanationLanguage === 'hi') {
    return explanationLanguage;
  }
  return 'en';
}

export function useVocabulary(level: JLPTLevel = 'N5') {
  const lang = useExplanationLanguage();
  return useMemo(() => {
    return contentProvider.getVocabulary(level, lang);
  }, [level, lang]);
}

export function useKanji(level: JLPTLevel = 'N5') {
  const lang = useExplanationLanguage();
  return useMemo(() => {
    return contentProvider.getKanji(level, lang);
  }, [level, lang]);
}

export function useGrammar(level: JLPTLevel = 'N5') {
  const lang = useExplanationLanguage();
  return useMemo(() => {
    return contentProvider.getGrammar(level, lang);
  }, [level, lang]);
}

export function useLessons(level: JLPTLevel = 'N5') {
  const lang = useExplanationLanguage();
  return useMemo(() => {
    return contentProvider.getLessons(level, lang);
  }, [level, lang]);
}

export function useLesson(id: string) {
  const lang = useExplanationLanguage();
  return useMemo(() => {
    return contentProvider.getLessonById(id, lang);
  }, [id, lang]);
}

export function useContentSearch(query: string) {
  const lang = useExplanationLanguage();
  return useMemo(() => {
    return contentProvider.search(query, lang);
  }, [query, lang]);
}

export function useContentCounts() {
  return useMemo(() => {
    return contentProvider.getCounts();
  }, []);
}
