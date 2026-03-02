import { create } from 'zustand';
import type { AtsResume } from '../types/index.ts';

interface ResumeStore {
  resume: AtsResume;
  updateSection: <K extends keyof AtsResume>(section: K, value: AtsResume[K]) => void;
  addItem: <K extends keyof AtsResume>(section: K, item: AtsResume[K] extends Array<infer U> ? U : never) => void;
  removeItem: <K extends keyof AtsResume>(section: K, index: number) => void;
}

const initialResume: AtsResume = {
  basics: {
    name: '',
    email: '',
    location: '',
    summary: '',
  },
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  projects: [],
  languages: [],
};

export const useResumeStore = create<ResumeStore>((set) => ({
  resume: initialResume,
  updateSection: (section, value) => set((state) => ({
    resume: { ...state.resume, [section]: value },
  })),
  addItem: (section, item) => set((state) => ({
    resume: {
      ...state.resume,
      [section]: [
        ...(state.resume[section] as Array<typeof item>),
        item,
      ],
    },
  })),
  removeItem: (section, index) => set((state) => ({
    resume: {
      ...state.resume,
      [section]: ((state.resume[section] as unknown) as Array<unknown>).filter((_, i) => i !== index) as AtsResume[typeof section],
    },
  })),
}));
