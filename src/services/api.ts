import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Replace with your Flask API URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth services
export const login = (username: string, password: string) => 
  api.post('/auth/login', { username, password });

// Student services
export const getStudents = () => api.get('/students');
export const getStudentById = (id: number) => api.get(`/students/${id}`);

// Course services
export const getCourses = () => api.get('/courses');
export const getCourseById = (id: number) => api.get(`/courses/${id}`);

// Attendance services
export const getAttendance = (courseId: number, date: string) => 
  api.get(`/attendance/${courseId}/${date}`);

export const registerAttendance = (data: {
  courseId: number;
  studentId: number;
  date: string;
  state: boolean;
}) => api.post('/attendance', data);

// Mock data for development
export const mockData = {
  user: {
    id: 1,
    username: "teacher1",
    fullname: "John Doe",
    rol: "teacher",
    access_level: 2,
    active: true
  },
  courses: [
    {
      id: 1,
      level: 1,
      division: "A",
      year: 2024,
      current: true,
      active: true,
      students: [
        {
          id: 1,
          dni: 12345678,
          names: "Alice",
          surnames: "Smith",
          active: true
        },
        {
          id: 2,
          dni: 23456789,
          names: "Bob",
          surnames: "Johnson",
          active: true
        }
      ]
    }
  ],
  attendance: [
    {
      id: 1,
      course_id: 1,
      student_id: 1,
      day: "2024-02-14",
      state: true
    }
  ]
};