import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSenseiStore } from '../store/senseiStore';

// Keeps track of the user's location and clears targets without uninvited speaking
export function useSenseiPageContext() {
  const location = useLocation();
  const { clearTarget } = useSenseiStore();

  useEffect(() => {
    clearTarget();
  }, [location.pathname, clearTarget]);
}
