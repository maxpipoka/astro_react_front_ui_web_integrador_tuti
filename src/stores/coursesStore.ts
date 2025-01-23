import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Course {
  id: number;
  level: number;
  division: string;
  year: number;
  createdAt: string;
  updatedAt: string;
  associated_user: number;
  students: {
    id: number;
    dni: number;
    names: string;
    surnames: string;
    active: boolean;
  }[];
}

interface CoursesState {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  getCourseById: (id: number) => Course | undefined;
}

export const useCoursesStore = create<CoursesState>()(
  persist(
    (set, get) => ({
      courses: [],
      setCourses: (courses) => set({ courses }),
      getCourseById: (id: number) => {
        const state = get();
        return state.courses.find(course => course.id === id);
      }
    }),
    {
      name: 'courses-storage',
    }
  )
);