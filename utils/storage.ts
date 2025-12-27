
import { TestHistoryEntry, User } from '../types';

const HISTORY_KEY = 'sqp_history';
const SESSION_KEY = 'sqp_session';

export const saveHistory = (entry: TestHistoryEntry) => {
  const history = getHistory();
  const newHistory = [entry, ...history].slice(0, 5);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
};

export const getHistory = (): TestHistoryEntry[] => {
  const raw = localStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};

export const setSession = (user: User) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const getSession = (): User | null => {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};
