import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StoryboardSceneCard } from '../StoryboardSceneCard';
import { ListeningDownContainer } from '../ListeningDownContainer';
import { ChoukaiExamModal } from '../ChoukaiExamModal';
import { ListeningCinemaPlayer } from '../ListeningCinemaPlayer';
import { ListeningSessionEndModal } from '../ListeningSessionEndModal';
import { getStaticScenariosByLevel } from '../../../data/listening/scenarios';

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
      durationSeconds: 26,
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
          durationSec: 26,
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
    expect(screen.getByText('00:26')).toBeTruthy();

    // Verifies controls
    fireEvent.click(screen.getByTitle('Play video'));
    expect(mockTogglePlay).toHaveBeenCalled();

    // Verifies interactive transcript drawer
    expect(screen.getAllByText(/Transcript/i).length).toBeGreaterThanOrEqual(1);
    fireEvent.click(screen.getByTitle('Listen to this line'));
    expect(mockPlayLine).toHaveBeenCalledWith(0);
  });

  it('ListeningCinemaPlayer renders completion end screen when hasEnded is true', () => {
    const mockRestart = vi.fn();
    const mockOpenExam = vi.fn();

    const sampleScenario = {
      id: 'sc-cinema-test-end',
      level: 'N5' as const,
      category: 'Daily Life',
      titleJa: 'コンビニでのお買い物',
      titleEn: 'Shopping at a Convenience Store',
      descriptionJa: 'レジでの会話',
      descriptionEn: 'Cashier dialogue',
      audioUrl: '/audio/conbini.mp3',
      durationSeconds: 26,
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
          durationSec: 26,
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
        currentTimeSec={26}
        totalDuration={26}
        hasEnded={true}
        onTogglePlay={vi.fn()}
        onRestart={mockRestart}
        onPlayLine={vi.fn()}
        onSelectScene={vi.fn()}
        onSetPlaybackRate={vi.fn()}
        onToggleFurigana={vi.fn()}
        onToggleEnglish={vi.fn()}
        onPlayChime={vi.fn()}
        onOpenExam={mockOpenExam}
      />
    );

    // Verifies completion card is displayed
    expect(screen.getByText('会話が完了しました！')).toBeTruthy();
    expect(screen.getByText(/Dialogue completed! Test your understanding/i)).toBeTruthy();

    // Clicking Replay Video
    fireEvent.click(screen.getByText('Replay Video'));
    expect(mockRestart).toHaveBeenCalled();

    // Clicking Take Choukai Exam
    fireEvent.click(screen.getByText('Take Choukai Exam'));
    expect(mockOpenExam).toHaveBeenCalled();

    // Time stamp says 00:26 / 00:26
    expect(screen.getAllByText('00:26').length).toBe(2);
  });

  it('getStaticScenariosByLevel provides cumulative level filtering', () => {
    const n5List = getStaticScenariosByLevel('N5');
    expect(n5List.every((s) => s.level === 'N5')).toBe(true);

    const n4List = getStaticScenariosByLevel('N4');
    const n4Levels = new Set(n4List.map((s) => s.level));
    expect(n4Levels.has('N5')).toBe(true);
    expect(n4Levels.has('N4')).toBe(true);
    expect(n4Levels.has('N3')).toBe(false);

    const allList = getStaticScenariosByLevel('ALL');
    expect(allList.length).toBeGreaterThanOrEqual(7);
  });

  it('ListeningSessionEndModal renders Duolingo-style celebration, XP tally, streak pill, and continue CTA', () => {
    const mockContinue = vi.fn();
    const mockReplay = vi.fn();
    const mockOpenExam = vi.fn();

    const sampleScenario = {
      id: 'sc-modal-test',
      level: 'N5' as const,
      category: 'Daily Life',
      titleJa: 'コンビニでのお買い物',
      titleEn: 'Shopping at a Convenience Store',
      descriptionJa: 'レジでの会話',
      descriptionEn: 'Cashier dialogue',
      audioUrl: '/audio/conbini.mp3',
      durationSeconds: 26,
      storyboard: [sampleScene],
      dialogue: [],
      vocabulary: sampleVocab,
      examQuestions: sampleQuestions,
    };

    render(
      <ListeningSessionEndModal
        isOpen={true}
        scenario={sampleScenario}
        baseXP={15}
        accuracyBonus={10}
        currentStreak={7}
        dailyGoalTarget={50}
        dailyGoalCurrent={25}
        onContinue={mockContinue}
        onReplay={mockReplay}
        onOpenExam={mockOpenExam}
      />
    );

    expect(screen.getByText('聴解トレーニング完了！')).toBeTruthy();
    expect(screen.getByText('N5 • コンビニでのお買い物')).toBeTruthy();
    expect(screen.getByText('Total XP')).toBeTruthy();
    expect(screen.getByText('Streak')).toBeTruthy();
    expect(screen.getByText(/7/)).toBeTruthy();
    expect(screen.getByText(/Extended for today!/i)).toBeTruthy();

    fireEvent.click(screen.getByText(/Continue \(次へ\)/i));
    expect(mockContinue).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Replay Video'));
    expect(mockReplay).toHaveBeenCalled();

    fireEvent.click(screen.getByText(/Take Exam/i));
    expect(mockOpenExam).toHaveBeenCalled();
  });

  it('ListeningCinemaPlayer renders Duolingo turtle speed toggle and in-dialogue checkpoint overlay', () => {
    const mockRate = vi.fn();
    const mockAnswerCheckpoint = vi.fn();
    const mockSkipCheckpoint = vi.fn();

    const sampleScenario = {
      id: 'sc-checkpoint-test',
      level: 'N5' as const,
      category: 'Daily Life',
      titleJa: 'コンビニでのお買い物',
      titleEn: 'Shopping at a Convenience Store',
      descriptionJa: 'レジでの会話',
      descriptionEn: 'Cashier dialogue',
      audioUrl: '/audio/conbini.mp3',
      durationSeconds: 26,
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
          durationSec: 26,
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
        activeCheckpoint={sampleQuestions[0]}
        onAnswerCheckpoint={mockAnswerCheckpoint}
        onSkipCheckpoint={mockSkipCheckpoint}
        onTogglePlay={vi.fn()}
        onRestart={vi.fn()}
        onPlayLine={vi.fn()}
        onSelectScene={vi.fn()}
        onSetPlaybackRate={mockRate}
        onToggleFurigana={vi.fn()}
        onToggleEnglish={vi.fn()}
        onPlayChime={vi.fn()}
        onOpenExam={vi.fn()}
      />
    );

    // Verifies Duolingo Radio checkpoint overlay
    expect(screen.getByText(/Radio Checkpoint/i)).toBeTruthy();
    expect(screen.getByText('女の人は何をしますか。')).toBeTruthy();
    expect(screen.getByText('エコバッグを出します。')).toBeTruthy();

    // Answering checkpoint
    fireEvent.click(screen.getByText('エコバッグを出します。'));
    expect(mockAnswerCheckpoint).toHaveBeenCalledWith(0);

    // Skipping checkpoint
    fireEvent.click(screen.getByText(/Skip →/i));
    expect(mockSkipCheckpoint).toHaveBeenCalled();

    // Turtle Speed Toggle
    const turtleBtn = screen.getByTitle(/Switch to slow 0.75x turtle speed/i);
    expect(turtleBtn).toBeTruthy();
    fireEvent.click(turtleBtn);
    expect(mockRate).toHaveBeenCalledWith(0.75);
  });
});
