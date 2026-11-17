import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StoryboardSceneCard } from '../StoryboardSceneCard';
import { ListeningDownContainer } from '../ListeningDownContainer';
import { ChoukaiExamModal } from '../ChoukaiExamModal';
import { ListeningCinemaPlayer } from '../ListeningCinemaPlayer';

describe('Listening Components', () => {
  const sampleScene = {
    id: 's1',
    order: 1,
    title: 'Convenience Store Counter',
    description: 'Customer ordering bento at the counter.',
    sceneTheme: 'convenience_store' as const,
    captionJa: 'お弁当を温めてもらいます。',
    captionEn: 'Having the bento heated up.',
  };

  const sampleVocab = [
    {
      id: 'w1',
      word: 'お弁当',
      reading: 'おべんとう',
      romaji: 'o-bentou',
      meaning: 'Japanese boxed lunch',
      partOfSpeech: 'noun',
      pitchAccent: '◎ 平板 (Heiban)',
      exampleSentenceJa: 'お弁当を買います。',
      exampleSentenceEn: 'I buy a bento.',
    },
    {
      id: 'w2',
      word: '温める',
      reading: 'あたためる',
      romaji: 'atatamemasu',
      meaning: 'to heat up',
      partOfSpeech: 'verb',
      pitchAccent: '④ 中高 (Nakadaka)',
      exampleSentenceJa: 'レンジで温めます。',
      exampleSentenceEn: 'Heat in microwave.',
    },
  ];

  const sampleQuestions = [
    {
      id: 'q1',
      mondaiType: 1 as const,
      mondaiLabel: '第1部分: 課題理解',
      instructionJa: '女の人はこのあとどうしますか。',
      instructionEn: 'What will the woman do next?',
      questionJa: '女の人は何をしますか。',
      questionEn: 'What does she do?',
      options: [
        { id: 1, textJa: 'エコバッグを出します。', textEn: 'Take out eco bag.' },
        { id: 2, textJa: '袋を買います。', textEn: 'Buy plastic bag.' },
      ],
      correctIndex: 0,
      explanation: '女の人はエコバッグを使うと答えました。',
    },
  ];

  it('StoryboardSceneCard renders scene title, theme svg, and badges', () => {
    const onSelect = vi.fn();
    render(
      <StoryboardSceneCard
        scene={sampleScene}
        isActive={true}
        totalScenes={3}
        currentSceneIndex={0}
        onSelectScene={onSelect}
      />
    );

    expect(screen.getByText('Scene 1 of 3')).toBeTruthy();
    expect(screen.getByText('Convenience Store Counter')).toBeTruthy();
    expect(screen.getByText('お弁当を温めてもらいます。')).toBeTruthy();

    fireEvent.click(screen.getByText('Convenience Store Counter'));
    expect(onSelect).toHaveBeenCalledWith(0);
  });

  it('ListeningDownContainer toggles between Ear Test and Vocab Bank mode', () => {
    const onVerified = vi.fn();
    render(<ListeningDownContainer vocabulary={sampleVocab} onWordVerified={onVerified} />);

    expect(screen.getByText(/Listening Words & Hearing Check/i)).toBeTruthy();

    // Default is Ear Test mode: word text is masked
    expect(screen.getAllByText('Tap to check').length).toBe(2);

    // Click to reveal first word
    fireEvent.click(screen.getAllByText('Tap to check')[0]);
    expect(screen.getByText('お弁当')).toBeTruthy();
    expect(screen.getByText('◎ 平板 (Heiban)')).toBeTruthy();

    // Switch to Vocab Bank mode
    fireEvent.click(screen.getByText('📖 Vocab Bank'));
    expect(screen.getByText('温める')).toBeTruthy();
    expect(screen.getByText('④ 中高 (Nakadaka)')).toBeTruthy();
  });

  it('ChoukaiExamModal renders questions, selection, and submission review', () => {
    const onComplete = vi.fn();
    render(
      <ChoukaiExamModal
        level="N5"
        scenarioTitle="Convenience Store"
        questions={sampleQuestions}
        isOpen={true}
        onClose={vi.fn()}
        onCompleteExam={onComplete}
      />
    );

    expect(screen.getByText('JLPT N5 聴解')).toBeTruthy();
    expect(screen.getByText('第1部分: 課題理解')).toBeTruthy();
    expect(screen.getByText('エコバッグを出します。')).toBeTruthy();

    // Select option 1
    fireEvent.click(screen.getByText('エコバッグを出します。'));
    fireEvent.click(screen.getByText('Confirm Answer'));

    // Shows explanation
    expect(screen.getByText(/Explanation & Script Review/i)).toBeTruthy();
    expect(screen.getByText('女の人はエコバッグを使うと答えました。')).toBeTruthy();

    // Next -> Results
    fireEvent.click(screen.getByText('View Results'));
    expect(screen.getByText('100% Correct')).toBeTruthy();
    expect(screen.getByText('PASSED')).toBeTruthy();
    expect(onComplete).toHaveBeenCalledWith(100);
  });

  it('ListeningCinemaPlayer renders 16:9 cinema screen, subtitles, controls and transcript', () => {
    const mockTogglePlay = vi.fn();
    const mockPlayLine = vi.fn();
    const mockOpenExam = vi.fn();

    const sampleScenario = {
      id: 'sc-cinema-test',
      level: 'N5' as const,
      category: 'Daily Life',
      titleJa: 'コンビニでのお買い物',
      titleEn: 'Shopping at a Convenience Store',
      descriptionJa: 'レジでの会話',
      descriptionEn: 'Cashier dialogue',
      audioUrl: '/audio/conbini.mp3',
      durationSeconds: 48,
      storyboard: [sampleScene],
      dialogue: [
        {
          id: 'd1',
          speaker: '店員',
          text: 'いらっしゃいませ！温めますか？',
          hiragana: 'いらっしゃいませ！あたためますか？',
          romaji: 'Irasshaimase! Atatamemasu ka?',
          en: 'Welcome! Would you like this heated up?',
          voiceGender: 'female' as const,
          timeOffsetSec: 0,
          sceneIndex: 0,
        },
      ],
      vocabulary: sampleVocab,
      examQuestions: sampleQuestions,
    };

    render(
      <ListeningCinemaPlayer
        scenario={sampleScenario}
        isPlaying={false}
        currentLineIndex={0}
        activeSceneIndex={0}
        playbackRate={0.85}
        showFurigana={true}
        showEnglishSubtitle={true}
        onTogglePlay={mockTogglePlay}
        onRestart={vi.fn()}
        onPlayLine={mockPlayLine}
        onSelectScene={vi.fn()}
        onSetPlaybackRate={vi.fn()}
        onToggleFurigana={vi.fn()}
        onToggleEnglish={vi.fn()}
        onPlayChime={vi.fn()}
        onOpenExam={mockOpenExam}
      />
    );

    // Verifies subtitle in video screen & transcript drawer (both show the line)
    expect(screen.getAllByText('いらっしゃいませ！温めますか？').length).toBe(2);
    expect(screen.getAllByText('いらっしゃいませ！あたためますか？').length).toBe(2);
    expect(screen.getAllByText('Welcome! Would you like this heated up?').length).toBe(2);

    // Verifies time stamp
    expect(screen.getAllByText('00:00').length).toBe(2);
    expect(screen.getByText('00:48')).toBeTruthy();

    // Verifies controls
    fireEvent.click(screen.getByTitle('Play video'));
    expect(mockTogglePlay).toHaveBeenCalled();

    // Verifies interactive transcript drawer
    expect(screen.getByText(/Transcript/i)).toBeTruthy();
    fireEvent.click(screen.getByTitle('Listen to this line'));
    expect(mockPlayLine).toHaveBeenCalledWith(0);
  });
});
