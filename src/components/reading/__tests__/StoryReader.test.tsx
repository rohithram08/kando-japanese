import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import StoryReader from '../StoryReader';
import { n5Stories } from '../../../data/reading/n5_stories';
import { audioService } from '../../../services/audioService';

// Mock stores & audio service
vi.mock('../../../store/authStore', () => {
  const mockFn = () => ({
    user: { id: 'test-user', email: 'test@example.com' },
  });
  (mockFn as any).getState = () => ({
    user: { id: 'test-user', email: 'test@example.com' },
  });
  return {
    useAuthStore: mockFn,
  };
});

const mockSaveProgress = vi.fn().mockResolvedValue({ progress: {}, xpAwarded: 50 });

vi.mock('../../../store/readingStore', () => ({
  useReadingStore: () => ({
    saveProgress: mockSaveProgress,
  }),
}));

vi.mock('../../../services/audioService', () => ({
  audioService: {
    speak: vi.fn(),
    stop: vi.fn(),
    isSupported: vi.fn().mockReturnValue(true),
    hasJapaneseVoice: vi.fn().mockReturnValue(true),
  },
}));

describe('StoryReader Component', () => {
  const story = n5Stories[0]; // story_n5_01: 学生の一日
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders story title, level badge, and first sentence initially', () => {
    render(
      <StoryReader
        story={story}
        initialProgress={{
          storyId: story.id,
          status: 'not_started',
          lastSentenceIndex: 0,
        }}
        onBack={mockOnBack}
      />
    );

    // Level badge
    expect(screen.getByText('N5')).toBeDefined();

    // English title
    expect(screen.getByText(/A Student's Day/i)).toBeDefined();

    // First sentence indicator
    expect(screen.getByText(/Sentence 1 of 10/i)).toBeDefined();

    // First sentence translation
    expect(screen.getByText('My name is Ken.')).toBeDefined();
  });

  it('toggles English translation visibility when clicking translation button', () => {
    render(
      <StoryReader
        story={story}
        initialProgress={{
          storyId: story.id,
          status: 'not_started',
          lastSentenceIndex: 0,
        }}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText('My name is Ken.')).toBeDefined();

    // Find translation toggle button by title
    const toggleBtn = screen.getByTitle('Hide translations');
    fireEvent.click(toggleBtn);

    // Translation should now be hidden
    expect(screen.queryByText('My name is Ken.')).toBeNull();
  });

  it('navigates to next sentence when clicking Next button', () => {
    render(
      <StoryReader
        story={story}
        initialProgress={{
          storyId: story.id,
          status: 'not_started',
          lastSentenceIndex: 0,
        }}
        onBack={mockOnBack}
      />
    );

    const nextBtn = screen.getByRole('button', { name: /^Next$/i });
    fireEvent.click(nextBtn);

    // Should now show sentence 2
    expect(screen.getByText(/Sentence 2 of 10/i)).toBeDefined();
    expect(screen.getByText(/I am an international student/i)).toBeDefined();
  });

  it('opens and closes the vocabulary notes drawer', () => {
    render(
      <StoryReader
        story={story}
        initialProgress={{
          storyId: story.id,
          status: 'not_started',
          lastSentenceIndex: 0,
        }}
        onBack={mockOnBack}
      />
    );

    const vocabBtn = screen.getByRole('button', { name: /Vocabulary/i });
    fireEvent.click(vocabBtn);

    // Drawer header should be visible
    expect(screen.getByText('Vocabulary Notes')).toBeDefined();
    expect(screen.getByText('学生')).toBeDefined();

    // Close drawer
    const closeBtn = screen.getByText('Close');
    fireEvent.click(closeBtn);

    expect(screen.queryByText('Vocabulary Notes')).toBeNull();
  });

  it('navigates to quiz at the final sentence and completes the quiz', async () => {
    render(
      <StoryReader
        story={story}
        initialProgress={{
          storyId: story.id,
          status: 'in_progress',
          lastSentenceIndex: 9, // Last sentence
        }}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText(/Sentence 10 of 10/i)).toBeDefined();

    // Click Take Quiz
    const quizBtn = screen.getByRole('button', { name: /Take Quiz/i });
    fireEvent.click(quizBtn);

    // Quiz header should appear
    expect(screen.getByText(/Comprehension Question 1/i)).toBeDefined();

    // Select correct option for Q1 (七時 (7:00))
    const optionBtn = screen.getByText('七時 (7:00)');
    fireEvent.click(optionBtn);

    // Explanation should appear
    expect(screen.getByText(/Explanation|Correct!/i)).toBeDefined();

    // Click Next Question
    const nextQBtn = screen.getByRole('button', { name: /Next Question/i });
    fireEvent.click(nextQBtn);

    // Should now be at Question 2
    expect(screen.getByText(/Comprehension Question 2/i)).toBeDefined();
  });

  it('opens vocabulary lookup modal when clicking an annotated word without advancing the sentence', () => {
    render(
      <StoryReader
        story={story}
        initialProgress={{
          storyId: story.id,
          status: 'not_started',
          lastSentenceIndex: 0,
        }}
        onBack={mockOnBack}
      />
    );

    // Sentence 1 has annotated word "私" (I / me)
    const wordBtn = screen.getByRole('button', { name: /Look up 私/i });
    expect(wordBtn).toBeDefined();

    // Click the word
    fireEvent.click(wordBtn);

    // Vocab lookup modal should open
    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText('I / me')).toBeDefined();

    // Sentence position must NOT have advanced (remains Sentence 1 of 10)
    expect(screen.getByText(/Sentence 1 of 10/i)).toBeDefined();

    // Close modal
    const closeBtn = screen.getByLabelText('Close vocabulary details');
    fireEvent.click(closeBtn);

    expect(screen.queryByText('I / me')).toBeNull();
    // Still at sentence 1
    expect(screen.getByText(/Sentence 1 of 10/i)).toBeDefined();
  });

  it('supports keyboard Enter to trigger vocabulary lookup', () => {
    render(
      <StoryReader
        story={story}
        initialProgress={{
          storyId: story.id,
          status: 'not_started',
          lastSentenceIndex: 0,
        }}
        onBack={mockOnBack}
      />
    );

    const wordBtn = screen.getByRole('button', { name: /Look up 名前/i });
    fireEvent.keyDown(wordBtn, { key: 'Enter' });

    // Vocab lookup modal should open showing "name"
    expect(screen.getByText('name')).toBeDefined();
  });

  it('triggers audio playback for the current sentence when clicking Listen', () => {
    render(
      <StoryReader
        story={story}
        initialProgress={{
          storyId: story.id,
          status: 'not_started',
          lastSentenceIndex: 0,
        }}
        onBack={mockOnBack}
      />
    );

    const playBtn = screen.getByRole('button', { name: /Play sentence audio/i });
    fireEvent.click(playBtn);

    expect(audioService.speak).toHaveBeenCalledWith(
      story.sentences[0].japanese,
      expect.objectContaining({
        lang: 'ja-JP',
        rate: 1.0,
      })
    );
  });

  it('pauses ongoing audio when opening vocabulary lookup modal', () => {
    render(
      <StoryReader
        story={story}
        initialProgress={{
          storyId: story.id,
          status: 'not_started',
          lastSentenceIndex: 0,
        }}
        onBack={mockOnBack}
      />
    );

    // Start playing
    const playBtn = screen.getByRole('button', { name: /Play sentence audio/i });
    fireEvent.click(playBtn);

    // Click vocabulary word "私"
    const wordBtn = screen.getByRole('button', { name: /Look up 私/i });
    fireEvent.click(wordBtn);

    // Audio should be stopped/paused
    expect(audioService.stop).toHaveBeenCalled();
  });

  it('renders audio player and sentence controls in passage mode', () => {
    render(
      <StoryReader
        story={story}
        initialProgress={{
          storyId: story.id,
          status: 'not_started',
          lastSentenceIndex: 0,
        }}
        onBack={mockOnBack}
      />
    );

    // Switch to passage mode
    const passageModeBtn = screen.getByTitle('Continuous passage mode');
    fireEvent.click(passageModeBtn);

    // Sentence 1 audio button in passage mode
    const sentencePlayBtn = screen.getByLabelText('Play sentence 1');
    expect(sentencePlayBtn).toBeDefined();

    fireEvent.click(sentencePlayBtn);
    expect(audioService.speak).toHaveBeenCalledWith(
      story.sentences[0].japanese,
      expect.objectContaining({
        lang: 'ja-JP',
      })
    );
  });

  it('restores initial progress position without calling saveProgress on mount', () => {
    mockSaveProgress.mockClear();
    render(
      <StoryReader
        story={story}
        initialProgress={{
          storyId: story.id,
          status: 'in_progress',
          lastSentenceIndex: 3,
        }}
        onBack={mockOnBack}
      />
    );

    // Sentence 4 of 10 should be displayed immediately (0-indexed 3)
    expect(screen.getByText(/Sentence 4 of 10/i)).toBeDefined();
    // Mount should NOT have called saveProgress (prevents overwriting saved progress)
    expect(mockSaveProgress).not.toHaveBeenCalled();
  });

  it('calls saveProgress only when the user advances the sentence', () => {
    mockSaveProgress.mockClear();
    render(
      <StoryReader
        story={story}
        initialProgress={{
          storyId: story.id,
          status: 'in_progress',
          lastSentenceIndex: 3,
        }}
        onBack={mockOnBack}
      />
    );

    expect(mockSaveProgress).not.toHaveBeenCalled();

    // User advances to next sentence
    const nextBtn = screen.getByRole('button', { name: /^Next$/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText(/Sentence 5 of 10/i)).toBeDefined();
    expect(mockSaveProgress).toHaveBeenCalledWith(
      expect.objectContaining({
        storyId: story.id,
        lastSentenceIndex: 4,
        status: 'in_progress',
      }),
      true
    );
  });
});

