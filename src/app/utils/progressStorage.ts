import { getCurrentAuthUser } from './authStorage';

// Local storage utilities for tracking user progress

export interface UserProgress {
  userId: string;
  completedTopics: { [topicId: string]: boolean };
  lastUpdated: string;
}

const STORAGE_KEY = 'roadmap_progress';

export const getCurrentUser = (): string => {
  const user = getCurrentAuthUser();
  if (user) {
    return user.id;
  }
  return 'guest';
};

export const getProgress = (): UserProgress => {
  const userId = getCurrentUser();
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (stored) {
    try {
      const allProgress = JSON.parse(stored);
      return allProgress[userId] || {
        userId,
        completedTopics: {},
        lastUpdated: new Date().toISOString()
      };
    } catch {
      return {
        userId,
        completedTopics: {},
        lastUpdated: new Date().toISOString()
      };
    }
  }
  
  return {
    userId,
    completedTopics: {},
    lastUpdated: new Date().toISOString()
  };
};

export const saveProgress = (progress: UserProgress): void => {
  const stored = localStorage.getItem(STORAGE_KEY);
  let allProgress: { [userId: string]: UserProgress } = {};
  
  if (stored) {
    try {
      allProgress = JSON.parse(stored);
    } catch {
      allProgress = {};
    }
  }
  
  allProgress[progress.userId] = {
    ...progress,
    lastUpdated: new Date().toISOString()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
};

export const toggleTopicCompletion = (topicId: string): void => {
  const progress = getProgress();
  progress.completedTopics[topicId] = !progress.completedTopics[topicId];
  saveProgress(progress);
};

export const isTopicCompleted = (topicId: string): boolean => {
  const progress = getProgress();
  return !!progress.completedTopics[topicId];
};

export const getRoadmapProgress = (roadmapTopicIds: string[]): number => {
  const progress = getProgress();
  const completed = roadmapTopicIds.filter(id => progress.completedTopics[id]).length;
  return roadmapTopicIds.length > 0 ? (completed / roadmapTopicIds.length) * 100 : 0;
};

export const getTotalProgress = (allTopicIds: string[]): number => {
  const progress = getProgress();
  const completed = allTopicIds.filter(id => progress.completedTopics[id]).length;
  return allTopicIds.length > 0 ? (completed / allTopicIds.length) * 100 : 0;
};

export const resetProgress = (): void => {
  const userId = getCurrentUser();
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (stored) {
    try {
      const allProgress = JSON.parse(stored);
      delete allProgress[userId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    } catch {
      // If parsing fails, just clear everything
      localStorage.removeItem(STORAGE_KEY);
    }
  }
};
