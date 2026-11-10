import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSenseiStore } from '../senseiStore';
import * as senseiApi from '../../api/sensei';

vi.mock('../../api/sensei', () => ({
  getHistory: vi.fn(),
  clearHistory: vi.fn(),
  chat: vi.fn(),
  getLearnerMemory: vi.fn(),
  getTourProgress: vi.fn(),
  completeTour: vi.fn(),
  skipTour: vi.fn(),
  getDailyGuidance: vi.fn(),
}));

vi.mock('../../services/audioService', () => ({
  audioService: {
    speak: vi.fn(),
    stop: vi.fn(),
  },
  localeToTtsLang: vi.fn(() => 'en-US'),
}));

describe('useSenseiStore - Fresh Session & Hidden Memory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSenseiStore.setState({
      messages: [],
      historyArchive: [],
      learnerMemory: null,
      isTyping: false,
      speechEnabled: false,
    });
  });

  it('starts with a fresh session greeting without dumping historical chat into active screen', async () => {
    vi.mocked(senseiApi.getLearnerMemory).mockResolvedValueOnce({
      memory: {
        userName: 'Rohith Ram',
        jlptLevel: 'N3',
        studyLevel: 'N3',
        nativeLanguage: 'English',
        streak: 7,
        totalXP: 928,
        recentLessons: [{ id: 'n3l001', title: 'N3 Passive Forms', type: 'lesson' }],
        recentGrammar: [],
        recentVocab: ['感動'],
        weakSpots: [{ id: 'particle_ni', title: 'Particle に vs で', type: 'vocab' }],
        dueReviewsCount: 3,
        pastConversationSummary: 'Discussed particle differences.',
        hoursSinceLastChat: 5,
        isReturningStudent: true,
      },
      freshGreeting: 'こんにちは！(Konnichiwa!) Welcome back, Rohith Ram-san! 🌸',
    });

    await useSenseiStore.getState().startFreshSession({ speak: false });

    const state = useSenseiStore.getState();
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0].content).toContain('Welcome back, Rohith Ram-san!');
    expect(state.learnerMemory?.streak).toBe(7);
    expect(state.learnerMemory?.userName).toBe('Rohith Ram');
  });

  it('fetchHistory populates historyArchive while maintaining a fresh active session', async () => {
    const mockDbHistory = [
      { id: '1', role: 'user', content: 'What is wa vs ga?' },
      { id: '2', role: 'assistant', content: 'Wa marks topic, ga marks subject.' },
      { id: '3', role: 'user', content: 'Thanks sensei!' },
    ];
    vi.mocked(senseiApi.getHistory).mockResolvedValueOnce(mockDbHistory);
    vi.mocked(senseiApi.getLearnerMemory).mockResolvedValueOnce({
      memory: {
        userName: 'Rohith Ram',
        jlptLevel: 'N3',
        studyLevel: 'N3',
        nativeLanguage: 'English',
        streak: 7,
        totalXP: 928,
        recentLessons: [],
        recentGrammar: [],
        recentVocab: [],
        weakSpots: [],
        dueReviewsCount: 0,
        pastConversationSummary: '',
        hoursSinceLastChat: 24,
        isReturningStudent: true,
      },
      freshGreeting: 'Welcome back, Rohith Ram-san! Ready for today?',
    });

    await useSenseiStore.getState().fetchHistory();

    const state = useSenseiStore.getState();
    // historyArchive contains the past chat records for drawer review
    expect(state.historyArchive).toHaveLength(3);
    // Active messages does NOT dump all 3 old messages onto the main stage; it starts fresh!
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0].content).toContain('Welcome back, Rohith Ram-san!');
  });

  it('sendMessage appends to active session and keeps historyArchive updated', async () => {
    vi.mocked(senseiApi.chat).mockResolvedValueOnce({
      message: 'Sure! Let us practice N3 grammar.',
      emotion: 'happy',
    });

    useSenseiStore.setState({
      messages: [{ id: 'init', role: 'assistant', content: 'Welcome back!' }],
      historyArchive: [{ id: 'init', role: 'assistant', content: 'Welcome back!' }],
    });

    await useSenseiStore.getState().sendMessage('Let us practice N3 grammar.');

    const state = useSenseiStore.getState();
    expect(state.messages).toHaveLength(3); // init + user + reply
    expect(state.historyArchive).toHaveLength(3);
    expect(state.messages[1].content).toBe('Let us practice N3 grammar.');
    expect(state.messages[2].content).toBe('Sure! Let us practice N3 grammar.');
  });
});
