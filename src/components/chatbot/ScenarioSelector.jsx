import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ChevronRight, Lock,
  CheckCircle, Flame, Sparkles,
  Clock, Tag,
} from 'lucide-react'
import { useThemeStore } from '../../store/themeStore'

// ── All Scenarios ─────────────────────────────────────────
const SCENARIOS = [
  // ── BASICS
  { id: 'greetings', category: 'Basics', title: 'Greetings & Introductions', titleJP: '挨拶と自己紹介', description: 'Practice saying hello, goodbye, and introducing yourself to new people.', icon: '👋', difficulty: 'beginner', jlptLevel: 'N5', estimatedTime: '5 min', completed: false, locked: false, tags: ['greeting', 'daily', 'introduction'], systemPrompt: 'You are a friendly Japanese person meeting someone for the first time at a community event. Practice greetings and self-introductions warmly. Use simple N5 vocabulary.' },
  { id: 'numbers', category: 'Basics', title: 'Numbers & Counting', titleJP: '数字と数え方', description: 'Practice Japanese numbers, counters, and basic arithmetic in conversation.', icon: '🔢', difficulty: 'beginner', jlptLevel: 'N5', estimatedTime: '5 min', completed: false, locked: false, tags: ['numbers', 'basics', 'counting'], systemPrompt: 'You are a Japanese elementary school teacher helping a student practice numbers and counters. Use simple questions about age, quantity, and prices.' },
  { id: 'family', category: 'Basics', title: 'Talking About Family', titleJP: '家族について', description: 'Learn to describe your family members and ask about others.', icon: '👨‍👩‍👧‍👦', difficulty: 'beginner', jlptLevel: 'N5', estimatedTime: '7 min', completed: false, locked: false, tags: ['family', 'basics', 'daily'], systemPrompt: 'You are a friendly Japanese neighbor chatting about family. Ask and answer questions about family members using simple N5 vocabulary.' },
  { id: 'weather', category: 'Basics', title: 'Weather & Seasons', titleJP: '天気と季節', description: 'Chat about weather, seasons, and plan activities based on the forecast.', icon: '🌤️', difficulty: 'beginner', jlptLevel: 'N5', estimatedTime: '6 min', completed: false, locked: false, tags: ['weather', 'daily', 'small talk'], systemPrompt: 'You are a friendly Japanese coworker making small talk about the weather and upcoming seasons. Use simple weather vocabulary.' },
  { id: 'hobbies', category: 'Basics', title: 'Hobbies & Free Time', titleJP: '趣味と余暇', description: 'Talk about your hobbies, interests, and how you spend free time.', icon: '🎨', difficulty: 'beginner', jlptLevel: 'N5', estimatedTime: '8 min', completed: false, locked: false, tags: ['hobbies', 'daily', 'personal'], systemPrompt: 'You are a Japanese classmate getting to know a new student. Ask and share about hobbies and free time activities using N5 vocabulary.' },

  // ── DAILY LIFE
  { id: 'restaurant', category: 'Daily Life', title: 'At the Restaurant', titleJP: 'レストランで', description: 'Order food, ask for the menu, make special requests, and pay the bill.', icon: '🍜', difficulty: 'beginner', jlptLevel: 'N5', estimatedTime: '8 min', completed: false, locked: false, tags: ['food', 'daily', 'ordering'], systemPrompt: 'You are a server at a Japanese ramen restaurant. Help the customer order food, explain the menu, and handle payment naturally.' },
  { id: 'shopping', category: 'Daily Life', title: 'Shopping', titleJP: '買い物', description: 'Ask for prices, find items, try on clothes, and make purchases.', icon: '🛍️', difficulty: 'beginner', jlptLevel: 'N5', estimatedTime: '7 min', completed: false, locked: false, tags: ['shopping', 'daily', 'money'], systemPrompt: 'You are a shopkeeper at a Japanese clothing store. Help the customer find items, discuss sizes, prices, and complete a purchase.' },
  { id: 'convenience-store', category: 'Daily Life', title: 'Convenience Store', titleJP: 'コンビニで', description: 'Navigate a Japanese convenience store — buy items, use services, ask for help.', icon: '🏪', difficulty: 'beginner', jlptLevel: 'N5', estimatedTime: '6 min', completed: false, locked: false, tags: ['shopping', 'daily', 'convenience'], systemPrompt: 'You are a staff member at a Japanese convenience store (コンビニ). Help customers buy items, use the ATM, and access services like printing.' },
  { id: 'supermarket', category: 'Daily Life', title: 'At the Supermarket', titleJP: 'スーパーマーケットで', description: 'Find groceries, ask about products, and navigate a Japanese supermarket.', icon: '🛒', difficulty: 'beginner', jlptLevel: 'N5', estimatedTime: '8 min', completed: false, locked: false, tags: ['shopping', 'food', 'daily'], systemPrompt: 'You are a helpful staff member at a Japanese supermarket. Help the customer find products, explain ingredients, and assist with checkout.' },
  { id: 'post-office', category: 'Daily Life', title: 'At the Post Office', titleJP: '郵便局で', description: 'Send packages, buy stamps, and handle postal services in Japanese.', icon: '📮', difficulty: 'intermediate', jlptLevel: 'N4', estimatedTime: '10 min', completed: false, locked: false, tags: ['daily', 'services', 'formal'], systemPrompt: 'You are a Japanese post office clerk. Help customers send packages, buy stamps, and understand postal services.' },
  { id: 'bank', category: 'Daily Life', title: 'At the Bank', titleJP: '銀行で', description: 'Open an account, make transfers, and handle banking in Japanese.', icon: '🏦', difficulty: 'intermediate', jlptLevel: 'N4', estimatedTime: '12 min', completed: false, locked: false, tags: ['banking', 'formal', 'services'], systemPrompt: 'You are a Japanese bank clerk. Help the customer with account opening, transfers, and banking queries using polite Japanese.' },
  { id: 'haircut', category: 'Daily Life', title: 'At the Hair Salon', titleJP: '美容院で', description: 'Explain your desired hairstyle and chat with your Japanese hairdresser.', icon: '💇', difficulty: 'intermediate', jlptLevel: 'N4', estimatedTime: '10 min', completed: false, locked: false, tags: ['daily', 'beauty', 'conversation'], systemPrompt: 'You are a hairdresser at a Japanese salon. Ask the customer what style they want, discuss options, and make small talk during the haircut.' },
  { id: 'izakaya', category: 'Daily Life', title: 'At the Izakaya', titleJP: '居酒屋で', description: 'Order drinks and food at a Japanese pub, make toasts, and socialize.', icon: '🍻', difficulty: 'intermediate', jlptLevel: 'N4', estimatedTime: '10 min', completed: false, locked: false, tags: ['food', 'social', 'nightlife'], systemPrompt: 'You are a staff member at a lively Japanese izakaya. Help customers order drinks and food, explain the menu, and create a fun atmosphere.' },
  { id: 'cooking', category: 'Daily Life', title: 'Cooking & Recipes', titleJP: '料理とレシピ', description: 'Discuss Japanese cooking, follow recipes, and talk about ingredients.', icon: '🍳', difficulty: 'intermediate', jlptLevel: 'N4', estimatedTime: '10 min', completed: false, locked: false, tags: ['food', 'cooking', 'daily'], systemPrompt: 'You are a Japanese home cook teaching a friend how to make traditional dishes. Explain ingredients and cooking steps clearly.' },

  // ── TRAVEL
  { id: 'directions', category: 'Travel', title: 'Asking for Directions', titleJP: '道を聞く', description: 'Navigate the city by asking locals for directions to landmarks.', icon: '🗺️', difficulty: 'beginner', jlptLevel: 'N5', estimatedTime: '8 min', completed: false, locked: false, tags: ['travel', 'navigation', 'city'], systemPrompt: 'You are a helpful local in Tokyo. A tourist asks for directions to famous landmarks. Give clear directions using location vocabulary.' },
  { id: 'train', category: 'Travel', title: 'Taking the Train', titleJP: '電車に乗る', description: 'Buy tickets, find the right platform, and ask about train schedules.', icon: '🚃', difficulty: 'beginner', jlptLevel: 'N5', estimatedTime: '8 min', completed: false, locked: false, tags: ['travel', 'transport', 'train'], systemPrompt: 'You are a station staff member at a Japanese train station. Help passengers buy tickets, find platforms, and understand schedules.' },
  { id: 'hotel', category: 'Travel', title: 'Hotel Check-in', titleJP: 'ホテルのチェックイン', description: 'Check in, ask about facilities, request room service, and check out.', icon: '🏨', difficulty: 'beginner', jlptLevel: 'N5', estimatedTime: '8 min', completed: false, locked: false, tags: ['travel', 'hotel', 'accommodation'], systemPrompt: 'You are a hotel receptionist at a Japanese hotel. Handle check-in, explain facilities, answer room queries, and assist with requests.' },
  { id: 'taxi', category: 'Travel', title: 'Taking a Taxi', titleJP: 'タクシーに乗る', description: 'Give directions to a taxi driver and discuss routes in Japanese.', icon: '🚕', difficulty: 'beginner', jlptLevel: 'N5', estimatedTime: '6 min', completed: false, locked: false, tags: ['travel', 'transport', 'taxi'], systemPrompt: 'You are a Japanese taxi driver. Ask the passenger for their destination, discuss the route, and make friendly small talk.' },
  { id: 'tourist-spot', category: 'Travel', title: 'At a Tourist Spot', titleJP: '観光地で', description: 'Ask about famous sights, take photos, and explore tourist attractions.', icon: '⛩️', difficulty: 'intermediate', jlptLevel: 'N4', estimatedTime: '10 min', completed: false, locked: false, tags: ['travel', 'tourism', 'sightseeing'], systemPrompt: 'You are a tour guide at a famous Japanese shrine or temple. Explain its history, answer questions, and help tourists enjoy the visit.' },
  { id: 'airport', category: 'Travel', title: 'At the Airport', titleJP: '空港で', description: 'Check in, go through security, find gates, and navigate a Japanese airport.', icon: '✈️', difficulty: 'intermediate', jlptLevel: 'N4', estimatedTime: '12 min', completed: false, locked: false, tags: ['travel', 'airport', 'transport'], systemPrompt: 'You are an airline check-in staff at a Japanese international airport. Help passengers check in, answer baggage questions, and direct them to gates.' },
  { id: 'ryokan', category: 'Travel', title: 'Staying at a Ryokan', titleJP: '旅館に泊まる', description: 'Experience a traditional Japanese inn — meals, onsen, and customs.', icon: '🏯', difficulty: 'intermediate', jlptLevel: 'N4', estimatedTime: '12 min', completed: false, locked: false, tags: ['travel', 'culture', 'traditional'], systemPrompt: 'You are the innkeeper at a traditional Japanese ryokan. Explain customs, serve kaiseki meals, and help guests enjoy the onsen experience.' },
  { id: 'lost', category: 'Travel', title: 'Getting Lost', titleJP: '道に迷う', description: 'Handle the situation when you are lost in Japan and need urgent help.', icon: '😰', difficulty: 'intermediate', jlptLevel: 'N4', estimatedTime: '8 min', completed: false, locked: false, tags: ['travel', 'emergency', 'navigation'], systemPrompt: 'You are a kind Japanese passerby who helps a lost tourist. Practice urgent but polite requests for help with directions and transportation.' },

  // ── HEALTHCARE
  { id: 'doctor', category: 'Healthcare', title: 'At the Doctor', titleJP: '病院で', description: 'Describe symptoms, understand medical instructions, and get prescriptions.', icon: '🏥', difficulty: 'intermediate', jlptLevel: 'N4', estimatedTime: '12 min', completed: false, locked: false, tags: ['medical', 'formal', 'health'], systemPrompt: 'You are a Japanese doctor at a clinic. Ask about symptoms, give diagnoses in simple terms, and explain treatment plans clearly.' },
  { id: 'pharmacy', category: 'Healthcare', title: 'At the Pharmacy', titleJP: '薬局で', description: 'Ask for medicine, explain symptoms to a pharmacist, and get advice.', icon: '💊', difficulty: 'intermediate', jlptLevel: 'N4', estimatedTime: '8 min', completed: false, locked: false, tags: ['medical', 'pharmacy', 'health'], systemPrompt: 'You are a Japanese pharmacist. Help customers find the right medication, explain dosages, and warn about side effects.' },
  { id: 'dentist', category: 'Healthcare', title: 'At the Dentist', titleJP: '歯医者で', description: 'Describe dental problems, understand treatment options in Japanese.', icon: '🦷', difficulty: 'intermediate', jlptLevel: 'N4', estimatedTime: '10 min', completed: false, locked: false, tags: ['medical', 'dental', 'formal'], systemPrompt: 'You are a Japanese dentist. Ask about dental problems, explain procedures simply, and help the patient feel comfortable.' },
  { id: 'emergency', category: 'Healthcare', title: 'Emergency Situation', titleJP: '緊急事態', description: 'Handle emergencies — call for help, describe accidents, contact services.', icon: '🚨', difficulty: 'intermediate', jlptLevel: 'N4', estimatedTime: '10 min', completed: false, locked: false, tags: ['emergency', 'urgent', 'safety'], systemPrompt: 'You are an emergency services operator in Japan. Help the caller describe their emergency and guide them through the situation calmly.' },

  // ── EDUCATION
  { id: 'school', category: 'Education', title: 'At School', titleJP: '学校で', description: 'Talk to teachers, discuss subjects, and navigate school life in Japan.', icon: '🏫', difficulty: 'beginner', jlptLevel: 'N5', estimatedTime: '8 min', completed: false, locked: false, tags: ['school', 'education', 'daily'], systemPrompt: 'You are a Japanese high school teacher. Talk to a student about classes, homework, and school activities using accessible language.' },
  { id: 'library', category: 'Education', title: 'At the Library', titleJP: '図書館で', description: 'Find books, use library services, and ask for research help.', icon: '📚', difficulty: 'beginner', jlptLevel: 'N5', estimatedTime: '7 min', completed: false, locked: false, tags: ['library', 'education', 'quiet'], systemPrompt: 'You are a librarian at a Japanese public library. Help visitors find books, explain library rules, and assist with catalogue searches.' },
  { id: 'university', category: 'Education', title: 'University Life', titleJP: '大学生活', description: 'Navigate campus, talk to professors, join clubs, and university topics.', icon: '🎓', difficulty: 'intermediate', jlptLevel: 'N4', estimatedTime: '12 min', completed: false, locked: false, tags: ['university', 'education', 'campus'], systemPrompt: 'You are a Japanese university student helping a new exchange student navigate campus life, clubs, and classes.' },
  { id: 'cram-school', category: 'Education', title: 'Cram School (Juku)', titleJP: '塾で', description: 'Experience Japanese cram school culture and study sessions.', icon: '✏️', difficulty: 'intermediate', jlptLevel: 'N4', estimatedTime: '10 min', completed: false, locked: false, tags: ['education', 'study', 'juku'], systemPrompt: 'You are a Japanese juku (cram school) teacher preparing students for entrance exams. Discuss study strategies and practice problems.' },

  // ── BUSINESS
  { id: 'job-interview', category: 'Business', title: 'Job Interview', titleJP: '就職面接', description: 'Practice formal business Japanese for job interviews with keigo.', icon: '💼', difficulty: 'advanced', jlptLevel: 'N3', estimatedTime: '15 min', completed: false, locked: false, tags: ['business', 'formal', 'keigo'], systemPrompt: 'You are a Japanese HR manager at a major company conducting a structured job interview. Use formal keigo and ask about experience and motivation.' },
  { id: 'office', category: 'Business', title: 'Office Conversations', titleJP: 'オフィスで', description: 'Daily workplace conversations — meetings, emails, and colleague chats.', icon: '🏢', difficulty: 'intermediate', jlptLevel: 'N3', estimatedTime: '12 min', completed: false, locked: false, tags: ['business', 'office', 'daily'], systemPrompt: 'You are a Japanese coworker at a Tokyo office. Have daily workplace conversations about projects, meetings, and office life.' },
  { id: 'business-meeting', category: 'Business', title: 'Business Meeting', titleJP: 'ビジネス会議', description: 'Lead or participate in a formal Japanese business meeting.', icon: '📊', difficulty: 'advanced', jlptLevel: 'N2', estimatedTime: '15 min', completed: false, locked: false, tags: ['business', 'meeting', 'formal'], systemPrompt: 'You are a senior manager at a Japanese company running a business meeting. Discuss proposals, give feedback, and use formal business Japanese.' },
  { id: 'phone-call', category: 'Business', title: 'Business Phone Call', titleJP: 'ビジネス電話', description: 'Handle professional phone conversations with proper telephone keigo.', icon: '📞', difficulty: 'advanced', jlptLevel: 'N2', estimatedTime: '15 min', completed: false, locked: true, tags: ['business', 'phone', 'keigo'], systemPrompt: 'You are a Japanese office worker receiving a business call. Use formal telephone keigo.' },
  { id: 'client-meeting', category: 'Business', title: 'Meeting a Client', titleJP: 'クライアントとの面談', description: 'Greet clients, present proposals, and negotiate in formal Japanese.', icon: '🤝', difficulty: 'advanced', jlptLevel: 'N2', estimatedTime: '18 min', completed: false, locked: true, tags: ['business', 'client', 'negotiation'], systemPrompt: 'You are a Japanese client attending a proposal meeting. Respond with questions and negotiations using keigo.' },
  { id: 'keigo', category: 'Business', title: 'Keigo Mastery', titleJP: '敬語マスター', description: 'Master sonkeigo, kenjōgo, and teineigo — the three levels of Japanese politeness.', icon: '🎌', difficulty: 'advanced', jlptLevel: 'N1', estimatedTime: '20 min', completed: false, locked: true, tags: ['keigo', 'formal', 'advanced', 'N1'], systemPrompt: 'You are a Japanese business etiquette trainer. Test and teach all three keigo levels.' },

  // ── CULTURE & SOCIAL
  { id: 'matsuri', category: 'Culture', title: 'At a Festival (Matsuri)', titleJP: 'お祭りで', description: 'Enjoy a traditional Japanese festival — food stalls, games, and fireworks.', icon: '🎆', difficulty: 'beginner', jlptLevel: 'N5', estimatedTime: '8 min', completed: false, locked: false, tags: ['culture', 'festival', 'social'], systemPrompt: 'You are a friendly local at a summer matsuri. Talk about events, food stalls, yukata, and fireworks.' },
  { id: 'karaoke', category: 'Culture', title: 'Karaoke Night', titleJP: 'カラオケ', description: 'Enjoy a Japanese karaoke session — order drinks, pick songs, and socialize.', icon: '🎤', difficulty: 'beginner', jlptLevel: 'N5', estimatedTime: '8 min', completed: false, locked: false, tags: ['culture', 'social', 'entertainment'], systemPrompt: 'You are a Japanese friend at a karaoke box. Suggest songs, order food and drinks, and have fun.' },
  { id: 'sports', category: 'Culture', title: 'Sports & Exercise', titleJP: 'スポーツと運動', description: 'Talk about sports, join a gym, or watch a baseball game in Japan.', icon: '⚾', difficulty: 'beginner', jlptLevel: 'N5', estimatedTime: '8 min', completed: false, locked: false, tags: ['sports', 'culture', 'social'], systemPrompt: 'You are a Japanese sports fan. Talk about favorite sports, upcoming games, and working out.' },
  { id: 'anime-manga', category: 'Culture', title: 'Anime & Manga Talk', titleJP: 'アニメ・マンガについて', description: 'Discuss anime, manga, and pop culture with a fellow Japanese fan.', icon: '🎌', difficulty: 'intermediate', jlptLevel: 'N4', estimatedTime: '10 min', completed: false, locked: false, tags: ['culture', 'anime', 'pop culture'], systemPrompt: 'You are a passionate Japanese anime and manga fan. Discuss favorite series, characters, and otaku culture.' },
  { id: 'tea-ceremony', category: 'Culture', title: 'Tea Ceremony', titleJP: '茶道', description: 'Experience the formal language and customs of a Japanese tea ceremony.', icon: '🍵', difficulty: 'advanced', jlptLevel: 'N2', estimatedTime: '15 min', completed: false, locked: false, tags: ['culture', 'traditional', 'formal'], systemPrompt: 'You are a tea ceremony master. Guide a student through the ceremony using traditional polite Japanese.' },
  { id: 'dating', category: 'Culture', title: 'Dating & Romance', titleJP: 'デートと恋愛', description: 'Practice romantic Japanese — asking someone out, compliments, and dates.', icon: '💕', difficulty: 'intermediate', jlptLevel: 'N4', estimatedTime: '10 min', completed: false, locked: false, tags: ['romance', 'social', 'conversation'], systemPrompt: 'You are a friendly Japanese person on a casual first date. Have a natural conversation about interests and give compliments.' },

  // ── TECHNOLOGY
  { id: 'tech-support', category: 'Technology', title: 'Tech Support', titleJP: 'テクニカルサポート', description: 'Describe tech problems and understand solutions in Japanese.', icon: '💻', difficulty: 'intermediate', jlptLevel: 'N3', estimatedTime: '10 min', completed: false, locked: false, tags: ['technology', 'support', 'modern'], systemPrompt: 'You are a Japanese IT support specialist. Help troubleshoot computer, phone, or internet issues step by step.' },
  { id: 'social-media', category: 'Technology', title: 'Social Media & Internet', titleJP: 'SNSとインターネット', description: 'Discuss social media, online trends, and internet culture in Japanese.', icon: '📱', difficulty: 'intermediate', jlptLevel: 'N4', estimatedTime: '8 min', completed: false, locked: false, tags: ['technology', 'social media', 'modern'], systemPrompt: 'You are a young Japanese person chatting about social media trends, popular apps, and internet culture.' },
  { id: 'gaming', category: 'Technology', title: 'Video Games', titleJP: 'ゲームについて', description: 'Talk about video games, gaming culture, and Japan\'s gaming scene.', icon: '🎮', difficulty: 'intermediate', jlptLevel: 'N4', estimatedTime: '10 min', completed: false, locked: false, tags: ['gaming', 'technology', 'culture'], systemPrompt: 'You are a Japanese gamer enthusiast. Discuss favorite games, strategies, esports, and Japanese game developers.' },

  // ── ADVANCED
  { id: 'news-discussion', category: 'Advanced', title: 'News & Current Events', titleJP: 'ニュースと時事問題', description: 'Discuss Japanese and world news, express opinions, and debate topics.', icon: '📰', difficulty: 'advanced', jlptLevel: 'N2', estimatedTime: '15 min', completed: false, locked: true, tags: ['news', 'advanced', 'opinion'], systemPrompt: 'You are a Japanese journalist discussing current events. Have an intellectual conversation about news topics.' },
  { id: 'philosophy', category: 'Advanced', title: 'Philosophy Discussion', titleJP: '哲学について', description: 'Engage in deep philosophical conversations about life, society, and abstract concepts.', icon: '💭', difficulty: 'advanced', jlptLevel: 'N1', estimatedTime: '20 min', completed: false, locked: true, tags: ['philosophy', 'advanced', 'intellectual', 'N1'], systemPrompt: 'You are a Japanese philosophy professor. Have a deep intellectual conversation about life, society, and abstract concepts. Use complex N1 vocabulary and grammar.' },
  { id: 'debate', category: 'Advanced', title: 'Formal Debate', titleJP: 'ディベート', description: 'Participate in a structured formal debate on a Japanese social topic.', icon: '⚖️', difficulty: 'advanced', jlptLevel: 'N1', estimatedTime: '20 min', completed: false, locked: true, tags: ['debate', 'advanced', 'formal', 'N1'], systemPrompt: 'You are a debate moderator at a Japanese university. Conduct a formal debate on a social issue, challenging the student to argue their position using advanced Japanese.' },
  { id: 'literature', category: 'Advanced', title: 'Japanese Literature', titleJP: '日本文学', description: 'Discuss classic and modern Japanese literature, authors, and themes.', icon: '📖', difficulty: 'advanced', jlptLevel: 'N1', estimatedTime: '20 min', completed: false, locked: true, tags: ['literature', 'advanced', 'culture', 'N1'], systemPrompt: 'You are a Japanese literature professor. Discuss works by Murakami, Kawabata, Natsume Soseki, and other authors using sophisticated literary vocabulary.' },
]

// ── Categories ────────────────────────────────────────────
const CATEGORIES = [
  'All', 'Basics', 'Daily Life', 'Travel',
  'Healthcare', 'Education', 'Business',
  'Culture', 'Technology', 'Advanced',
]

const DIFF_CONFIG = {
  beginner:     { label: 'Beginner',     color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20', dot: 'bg-green-400'  },
  intermediate: { label: 'Intermediate', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', dot: 'bg-yellow-400' },
  advanced:     { label: 'Advanced',     color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-400'      },
}

const CATEGORY_ICONS = {
  'All':        '🌟',
  'Basics':     '📝',
  'Daily Life': '🏠',
  'Travel':     '✈️',
  'Healthcare': '🏥',
  'Education':  '🎓',
  'Business':   '💼',
  'Culture':    '⛩️',
  'Technology': '💻',
  'Advanced':   '🎌',
}

// ─────────────────────────────────────────────────────────
const ScenarioSelector = ({ onSelect, selectedId, loading, completedIds = [] }) => {
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme === 'dark'

  const [search,           setSearch]           = useState('')
  const [activeCategory,   setActiveCategory]   = useState('All')
  const [activeDifficulty, setActiveDifficulty] = useState('All')
  const [hoveredId,        setHoveredId]        = useState(null)

  const isCompleted = (sc) => Boolean(sc?.completed || (Array.isArray(completedIds) && completedIds.includes(sc?.id)))

  // ── Filter ───────────────────────────────────────────────
  const filtered = useMemo(() => {
    return SCENARIOS.filter((s) => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.titleJP.includes(search) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.includes(q))
      const matchCat  = activeCategory   === 'All' || s.category   === activeCategory
      const matchDiff = activeDifficulty === 'All' || s.difficulty === activeDifficulty
      return matchSearch && matchCat && matchDiff
    })
  }, [search, activeCategory, activeDifficulty])

  const completedCount = SCENARIOS.filter((s) => isCompleted(s)).length
  const unlockedCount  = SCENARIOS.filter((s) => !s.locked).length
  const totalCount     = SCENARIOS.length

  // ── Stats by category ────────────────────────────────────
  const categoryStats = useMemo(() => {
    const stats = {}
    CATEGORIES.forEach(cat => {
      if (cat === 'All') {
        stats[cat] = totalCount
      } else {
        stats[cat] = SCENARIOS.filter(s => s.category === cat).length
      }
    })
    return stats
  }, [])

  // ── Has active filters ───────────────────────────────────
  const hasFilters = activeCategory !== 'All' || activeDifficulty !== 'All' || search.trim() !== ''

  // ─────────────────────────────────────────────────────────
  return (
    <div className={`
      flex flex-col h-full
      bg-white dark:bg-gray-900
    `}>

      {/* ── Header ── */}
      <div className={`px-4 py-4 border-b flex-shrink-0 border-border`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className={`font-bold text-base flex items-center gap-2 text-foreground`}>
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Scenarios
            </h3>
            <p className={`text-xs mt-0.5 text-muted-foreground`}>
              Choose a conversation to practice
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-500/10 dark:border-orange-500/20 dark:text-orange-400`}>
              <Flame className="w-3 h-3" />
              <span className="font-bold">{completedCount}/{totalCount}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className={`h-1.5 rounded-full overflow-hidden bg-muted`}>
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
            animate={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className={`text-[10px] text-muted-foreground`}>
            {unlockedCount} unlocked
          </span>
          <span className={`text-[10px] text-muted-foreground`}>
            {totalCount - unlockedCount} locked
          </span>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scenarios..."
            className={`
              w-full rounded-xl pl-9 pr-9 py-2.5 text-xs border
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
              transition-colors
              bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500
            `}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-colors bg-gray-200 text-gray-500 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600`}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Category tabs ── */}
      <div className="px-4 pb-2 flex-shrink-0">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  flex items-center gap-1 text-[10px] px-2.5 py-1.5 rounded-lg
                  font-medium transition-all border whitespace-nowrap flex-shrink-0
                  ${isActive
                    ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30'
                    : 'text-gray-500 hover:text-gray-700 border-gray-200 hover:border-gray-300 dark:text-gray-500 dark:hover:text-gray-300 dark:border-gray-700/50 dark:hover:border-gray-600'
                  }
                `}
              >
                <span>{CATEGORY_ICONS[cat]}</span>
                <span>{cat}</span>
                <span className={`text-[9px] ml-0.5 ${isActive ? 'opacity-80' : 'opacity-50'}`}>
                  {categoryStats[cat]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Difficulty filter ── */}
      <div className={`px-4 pb-2 flex-shrink-0 border-b border-border`}>
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {['All', 'beginner', 'intermediate', 'advanced'].map((diff) => {
              const isActive = activeDifficulty === diff
              const config = diff !== 'All' ? DIFF_CONFIG[diff] : null
              return (
                <button
                  key={diff}
                  onClick={() => setActiveDifficulty(diff)}
                  className={`
                    flex items-center gap-1 text-[10px] px-2 py-1.5 rounded-lg font-medium transition-all border capitalize
                    ${isActive
                      ? 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/30'
                      : 'text-gray-500 hover:text-gray-700 border-gray-200 dark:text-gray-500 dark:hover:text-gray-300 dark:border-gray-700/50'
                    }
                  `}
                >
                  {config && <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
                  {diff === 'All' ? 'All Levels' : config?.label}
                </button>
              )
            })}
          </div>

          {hasFilters && (
            <button
              onClick={() => {
                setSearch('')
                setActiveCategory('All')
                setActiveDifficulty('All')
              }}
              className={`text-[10px] font-medium transition-colors text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300`}
            >
              Clear
            </button>
          )}
        </div>

        <p className={`text-[10px] mt-2 mb-1 text-muted-foreground`}>
          {filtered.length === totalCount
            ? `All ${totalCount} scenarios`
            : `${filtered.length} of ${totalCount} scenarios`
          }
        </p>
      </div>

      {/* ── Scenario List ── */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className={`text-sm font-medium text-muted-foreground`}>
              No scenarios found
            </p>
            <p className={`text-xs mt-1 mb-4 text-muted-foreground`}>
              Try a different search or filter
            </p>
            <button
              onClick={() => {
                setSearch('')
                setActiveCategory('All')
                setActiveDifficulty('All')
              }}
              className={`text-xs font-medium px-4 py-2 rounded-lg transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700`}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          filtered.map((sc, index) => {
            const isSelected = selectedId === sc.id
            const diff       = DIFF_CONFIG[sc.difficulty]
            const isHovered  = hoveredId === sc.id

            return (
              <motion.button
                key={sc.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02, duration: 0.2 }}
                whileHover={!sc.locked && !loading ? { x: 2 } : {}}
                whileTap={!sc.locked  && !loading ? { scale: 0.98 } : {}}
                onClick={() => !sc.locked && !loading && onSelect?.(sc)}
                onMouseEnter={() => setHoveredId(sc.id)}
                onMouseLeave={() => setHoveredId(null)}
                disabled={sc.locked || loading}
                className={`
                  w-full text-left rounded-xl border p-3
                  transition-all duration-200
                  ${isSelected
                    ? 'bg-blue-50 border-blue-300 shadow-sm dark:bg-blue-500/10 dark:border-blue-500/30 dark:shadow-lg dark:shadow-blue-500/5'
                    : sc.locked
                      ? 'bg-gray-50/50 border-gray-100 opacity-40 cursor-not-allowed dark:bg-gray-800/30 dark:border-gray-700/30 dark:opacity-40 dark:cursor-not-allowed'
                      : loading
                        ? 'opacity-50 cursor-not-allowed bg-white border-gray-200 dark:bg-gray-800/50 dark:border-gray-700/50'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm dark:bg-gray-800/50 dark:border-gray-700/50 dark:hover:border-gray-600 dark:hover:bg-gray-800'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center text-lg
                    flex-shrink-0 transition-transform duration-150
                    ${isHovered && !sc.locked && !loading ? 'scale-110' : ''}
                    ${isSelected
                      ? 'bg-blue-100 dark:bg-blue-500/20'
                      : 'bg-gray-100 dark:bg-gray-700/80'
                    }
                  `}>
                    {sc.locked
                      ? <Lock className="w-4 h-4 text-gray-500" />
                      : sc.icon
                    }
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`text-xs font-semibold truncate leading-tight ${
                        isSelected
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-foreground'
                      }`}>
                        {sc.title}
                      </span>
                      {isCompleted(sc) && (
                        <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                      )}
                    </div>

                    <p className={`text-[10px] mb-2 truncate font-jp text-muted-foreground`}>
                      {sc.titleJP}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Difficulty badge */}
                      <span className={`flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-md border font-semibold ${diff.bg} ${diff.color}`}>
                        <div className={`w-1 h-1 rounded-full ${diff.dot}`} />
                        {diff.label}
                      </span>
                      {/* JLPT badge */}
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-medium border bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-700/50 dark:text-gray-400 dark:border-gray-700`}>
                        {sc.jlptLevel}
                      </span>
                      {/* Time */}
                      <span className={`flex items-center gap-0.5 text-[9px] text-muted-foreground`}>
                        <Clock className="w-2.5 h-2.5" />
                        {sc.estimatedTime}
                      </span>
                    </div>
                  </div>

                  {/* Arrow / Lock */}
                  <div className="flex-shrink-0 self-center">
                    {sc.locked
                      ? <Lock className="w-3.5 h-3.5 text-gray-600" />
                      : <ChevronRight className={`w-4 h-4 transition-all ${
                          isSelected
                            ? 'text-blue-600 dark:text-blue-400'
                            : isHovered
                              ? 'text-foreground/80'
                              : 'text-foreground/80'
                        }`} />
                    }
                  </div>
                </div>

                {/* Description — reveal on hover or selected */}
                <AnimatePresence>
                  {(isSelected || isHovered) && !sc.locked && !loading && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{    opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className={`
                        text-[11px] mt-2.5 pt-2.5 border-t text-left leading-relaxed
                        border-gray-100 text-gray-500 dark:border-gray-700/50 dark:text-gray-400
                      `}>
                        {sc.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {sc.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className={`flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-400 dark:bg-gray-700/50 dark:text-gray-500`}
                          >
                            <Tag className="w-2 h-2" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })
        )}
      </div>

      {/* ── Footer ── */}
      <div className={`px-4 py-2.5 border-t flex-shrink-0 border-border`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Object.entries(DIFF_CONFIG).map(([key, config]) => (
              <div key={key} className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                <span className={`text-[9px] text-muted-foreground`}>
                  {config.label}
                </span>
              </div>
            ))}
          </div>
          <span className={`text-[9px] text-muted-foreground`}>
            {unlockedCount}/{totalCount}
          </span>
        </div>
      </div>
    </div>
  )
}

export { SCENARIOS, CATEGORIES, DIFF_CONFIG, CATEGORY_ICONS }
export default ScenarioSelector