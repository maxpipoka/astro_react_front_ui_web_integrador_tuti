import React, { useEffect, useState } from 'react';
import { getCourseById, registerAttendance, mockData } from '../services/api';
import AttendanceToggle from './AttendanceToggle';
import { format } from 'date-fns';

interface Student {
  id: number;
  dni: number;
  names: string;
  surnames: string;
  active: boolean;
}

interface Course {
  id: number;
  level: number;
  division: string;
  year: number;
  students: Student[];
}

const StudentAttendanceList = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendanceStates, setAttendanceStates] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const courseId = window.location.pathname.split('/').pop();
    const fetchCourse = async () => {
      try {
        // In production, use this:
        // const response = await getCourseById(parseInt(courseId));
        // setCourse(response.data);
        
        // For development, using mock data:
        const mockCourse = mockData.courses.find(c => c.id === parseInt(courseId));
        setCourse(mockCourse || null);
        
        // Initialize attendance states
        if (mockCourse) {
          const states = {};
          mockCourse.students.forEach(student => {
            states[student.id] = false; // Initialize all as absent
          });
          setAttendanceStates(states);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el curso');
        setLoading(false);
      }
    };

    fetchCourse();
  }, []);

  const handleAttendanceToggle = async (studentId: number) => {
    try {
      const newState = !attendanceStates[studentId];
      
      // In production, use this:
      // await registerAttendance({
      //   courseId: course.id,
      //   studentId,
      //   date: format(new Date(), 'yyyy-MM-dd'),
      //   state: newState
      // });

      // For development, simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setAttendanceStates(prev => ({
        ...prev,
        [studentId]: newState
      }));

      // Show success message
      alert(newState ? 
        'Asistencia registrada correctamente' : 
        'Inasistencia registrada correctamente'
      );
    } catch (err) {
      alert('Error al registrar la asistencia');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-custom-text">Cargando datos del curso...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error || 'Curso no encontrado'}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 bg-custom-primary">
        <h3 className="text-xl font-bold text-custom-text">
          {course.level}° "{course.division}" - {course.year}
        </h3>
        <p className="text-custom-text mt-2">
          Fecha: {format(new Date(), 'dd/MM/yyyy')}
        </p>
      </div>
      
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-custom-text">DNI</th>
                <th className="text-left py-3 px-4 text-custom-text">Apellidos</th>
                <th className="text-left py-3 px-4 text-custom-text">Nombres</th>
                <th className="text-center py-3 px-4 text-custom-text">Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {course.students.map(student => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-custom-text">{student.dni}</td>
                  <td className="py-3 px-4 text-custom-text">{student.surnames}</td>
                  <td className="py-3 px-4 text-custom-text">{student.names}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <AttendanceToggle
                        isPresent={attendanceStates[student.id]}
                        onChange={() => handleAttendanceToggle(student.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceList;