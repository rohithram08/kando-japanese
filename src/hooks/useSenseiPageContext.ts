import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSenseiStore } from '../store/senseiStore';

// Keeps track of the user's location and triggers proactive Sensei interactions
export function useSenseiPageContext() {
  const location = useLocation();
  const { guideTo, clearTarget, isOpen, messages } = useSenseiStore();

  useEffect(() => {
    // Only trigger proactive tips if the user hasn't explicitly opened the chat
    // and if we aren't currently targeting something else.
    if (isOpen) {
      clearTarget();
      return;
    }

    const path = location.pathname;

    // Small delay to allow page render
    const timer = setTimeout(() => {
      if (path.startsWith('/dashboard')) {
        // Example logic: if they haven't done lessons recently, remind them
        // In a real implementation, we'd check user progress from a store
        // guideTo('lesson-card-1', 'You have a new lesson waiting for you!');
      } else if (path.startsWith('/review')) {
        guideTo('review-start-btn', 'Time for SRS reviews! Let us clear this queue.');
      } else if (path.startsWith('/kanji')) {
        guideTo('kanji-search', 'Looking for a specific Kanji? You can search by radical or reading here.');
      } else {
        clearTarget();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.pathname, isOpen, guideTo, clearTarget]);
}
