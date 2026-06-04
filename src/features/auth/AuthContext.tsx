import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {Session, User} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {supabase} from '../../services/supabase';

const GUEST_KEY = 'courseapp.guest';

interface SignUpResult {
  error: string | null;
  needsConfirmation: boolean;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{error: string | null}>;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  continueAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  isGuest: false,
  isLoading: true,
  signIn: async () => ({error: null}),
  signUp: async () => ({error: null, needsConfirmation: false}),
  continueAsGuest: async () => {},
  signOut: async () => {},
});

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.auth.getSession(),
      AsyncStorage.getItem(GUEST_KEY),
    ]).then(([{data}, guestFlag]) => {
      setSession(data.session);
      setIsGuest(guestFlag === 'true');
      setIsLoading(false);
    });

    const {data: listener} = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      // Real session wins over guest mode.
      if (newSession) {
        setIsGuest(false);
        AsyncStorage.removeItem(GUEST_KEY);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const {error} = await supabase.auth.signInWithPassword({email, password});
    return {error: error?.message ?? null};
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const {data, error} = await supabase.auth.signUp({email, password});
    // When email confirmation is on, signUp returns a user but no session.
    const needsConfirmation = !error && !data.session && !!data.user;
    return {error: error?.message ?? null, needsConfirmation};
  }, []);

  const continueAsGuest = useCallback(async () => {
    await AsyncStorage.setItem(GUEST_KEY, 'true');
    setIsGuest(true);
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(GUEST_KEY);
    setIsGuest(false);
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isGuest,
        isLoading,
        signIn,
        signUp,
        continueAsGuest,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
