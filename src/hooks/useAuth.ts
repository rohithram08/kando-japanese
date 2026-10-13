import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const {
    user,
    profile,
    loading,
    initialized,
    signIn,
    signUp,
    register,
    signInWithGoogle,
    logout,
    updateProfile,
    refreshProfile,
  } = useAuthStore();

  return {
    user,
    profile,
    loading,
    initialized,
    isAuthenticated: !!user,
    signIn,
    signUp,
    register,
    signInWithGoogle,
    signOut: logout, // alias for backward compatibility
    logout,
    updateProfile,
    refreshProfile,
  };
}
