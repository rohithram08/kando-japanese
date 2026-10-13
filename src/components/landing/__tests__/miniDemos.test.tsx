import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import KanaMiniDemo from '../demos/KanaMiniDemo';
import ReaderMiniDemo from '../demos/ReaderMiniDemo';
import DojoMiniDemo from '../demos/DojoMiniDemo';
import SRSMiniDemo from '../demos/SRSMiniDemo';
import SparkMiniDemo from '../demos/SparkMiniDemo';

describe('Phase C: 5 Tappable Mini-Demos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.speechSynthesis = {
      cancel: vi.fn(),
      speak: vi.fn(),
      getVoices: vi.fn(() => []),
    } as any;
  });

  describe('Demo 1: KanaMiniDemo', () => {
    it('renders 5 vowel sound tiles and switches character on click', () => {
      render(<KanaMiniDemo />);

      expect(screen.getByText('あ')).toBeDefined();
      expect(screen.getByText('い')).toBeDefined();
      expect(screen.getByText('う')).toBeDefined();
      expect(screen.getByText('え')).toBeDefined();
      expect(screen.getByText('お')).toBeDefined();

      const tileI = screen.getByRole('button', { name: /Practice Kana い/i });
      fireEvent.click(tileI);

      expect(window.speechSynthesis.speak).toHaveBeenCalled();
      expect(screen.getByText('+10 XP')).toBeDefined();
    });
  });

  describe('Demo 2: ReaderMiniDemo', () => {
    it('supports furigana toggling and interactive word lookup', () => {
      render(<ReaderMiniDemo />);

      expect(screen.getByText(/学生の一日/i)).toBeDefined();

      // Furigana toggle button
      const toggleBtn = screen.getByRole('button', { name: /Hide Furigana/i });
      fireEvent.click(toggleBtn);
      expect(screen.getByRole('button', { name: /Show Furigana/i })).toBeDefined();

      // Click word 電車 to inspect vocabulary
      const denshaWord = screen.getByTestId('word-densha');
      fireEvent.click(denshaWord);

      expect(screen.getByText(/train \/ electric train/i)).toBeDefined();
      expect(screen.getByText(/Heiban \(0\)/i)).toBeDefined();
    });

    it('adds selected word to SRS and shows success feedback', async () => {
      render(<ReaderMiniDemo />);

      const addBtn = screen.getByRole('button', { name: /Add to SRS/i });
      fireEvent.click(addBtn);

      expect(screen.getByText(/In SRS Deck/i)).toBeDefined();
    });
  });

  describe('Demo 3: DojoMiniDemo', () => {
    it('shows retry feedback on Option B and celebrates on Option A', () => {
      render(<DojoMiniDemo />);

      expect(screen.getByText(/「いらっしゃいませ！何名様ですか？」/i)).toBeDefined();

      // Click Option B (Ramen food order instead of party size)
      const optB = screen.getByRole('button', { name: /ラーメンを一つください。/i });
      fireEvent.click(optB);

      expect(screen.getByText(/The host asked how many people\. Answer that first!/i)).toBeDefined();

      // Retry with Option A
      const optA = screen.getByRole('button', { name: /一人です。カウンター席は空いていますか？/i });
      fireEvent.click(optA);

      expect(screen.getByText(/✓ Natural polite phrasing/i)).toBeDefined();
      expect(screen.getByText(/「かしこまりました！カウンター席へどうぞ！」/i)).toBeDefined();
    });
  });

  describe('Demo 4: SRSMiniDemo', () => {
    it('toggles 3D card flip and changes memory scheduling interval', () => {
      render(<SRSMiniDemo />);

      expect(screen.getByText('食べる')).toBeDefined();
      expect(screen.getByText(/Click to reveal answer/i)).toBeDefined();

      // Flip card
      const flipBtn = screen.getByRole('button', { name: /Tap to Flip/i });
      fireEvent.click(flipBtn);
      expect(screen.getByText(/To eat \/ have a meal/i)).toBeDefined();

      // Select Mastered 30d interval
      const masteredBtn = screen.getByRole('button', { name: /30d Mastered/i });
      fireEvent.click(masteredBtn);
      expect(screen.getByText(/Next: 30d/i)).toBeDefined();
    });
  });

  describe('Demo 5: SparkMiniDemo', () => {
    it('cycles through daily sparks and plays voice encouragement', () => {
      render(<SparkMiniDemo />);

      expect(screen.getByText(/毎日の小さな積み重ねが、大きな力になります！/i)).toBeDefined();

      const nextBtn = screen.getByRole('button', { name: /Next Spark/i });
      fireEvent.click(nextBtn);

      expect(screen.getByText(/こんにちは！一緒に日本語を勉強しましょう！/i)).toBeDefined();

      const listenBtns = screen.getAllByRole('button', { name: /Listen to Hana-sensei/i });
      fireEvent.click(listenBtns[0]);
      expect(window.speechSynthesis.speak).toHaveBeenCalled();
    });
  });
});
