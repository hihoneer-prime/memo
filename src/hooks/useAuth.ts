import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { subscribeToAuth } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => subscribeToAuth(setUser), []);
  return user;
}
