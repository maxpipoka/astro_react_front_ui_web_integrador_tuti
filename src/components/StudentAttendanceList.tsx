import React, { useEffect, useState } from 'react';
import AttendanceToggle from './AttendanceToggle';
import { format } from 'date-fns';
import { useCoursesStore } from '../stores/coursesStore';

interface StudentAttendanceListProps {
  courseId: number;
}

const StudentAttendanceList = ({ courseId }: StudentAttendanceListProps) => {
  const { getCourseById } = useCoursesStore();
  const course = getCourseById(courseId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendanceStates, setAttendanceStates] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (course) {
      const states = {};
      course.students.forEach(student => {
        states[student.id] = false;
      });
      setAttendanceStates(states);
      setLoading(false);
    } else {
      setError('Curso no encontrado');
      setLoading(false);
    }
  }, [course]);

  const handleAttendanceToggle = async (studentId: number) => {
    try {
      const newState = !attendanceStates[studentId];
      await new Promise(resolve => setTimeout(resolve, 500));
      setAttendanceStates(prev => ({
        ...prev,
        [studentId]: newState
      }));
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
        <p className="text-custom-text dark:text-gray-50">Cargando datos del curso...</p>
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
    <div className="bg-white dark:bg-custom-darkblue rounded-lg shadow-md overflow-hidden">
      <div className="p-6 bg-custom-primary dark:bg-custom-lightblue">
        <h3 className="text-xl font-bold text-custom-text dark:text-gray-50">
          {course.level}° "{course.division}" - {course.year}
        </h3>
        <p className="text-custom-text dark:text-gray-50 mt-2">
          Fecha: {format(new Date(), 'dd/MM/yyyy')}
        </p>
      </div>
      
      <div className="p-4">
        {/* Encabezados de columna para desktop */}
        <div className="hidden md:grid md:grid-cols-4 md:gap-4 md:mb-4 md:px-4 md:py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div className="text-custom-text dark:text-gray-200 font-semibold">DNI</div>
          <div className="text-custom-text dark:text-gray-200 font-semibold">Apellidos</div>
          <div className="text-custom-text dark:text-gray-200 font-semibold">Nombres</div>
          <div className="text-custom-text dark:text-gray-200 font-semibold text-center">Asistencia</div>
        </div>

        <div className="grid gap-4">
          {course.students.map(student => (
            <div 
              key={student.id} 
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
            >
              {/* Vista móvil */}
              <div className="md:hidden">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-sm">
                    <span className="block text-gray-500 dark:text-gray-400">DNI</span>
                    <span className="font-medium text-custom-text dark:text-gray-50">{student.dni}</span>
                  </div>
                  <div className="text-sm">
                    <span className="block text-gray-500 dark:text-gray-400">Apellidos</span>
                    <span className="font-medium text-custom-text dark:text-gray-50">{student.surnames}</span>
                  </div>
                  <div className="text-sm">
                    <span className="block text-gray-500 dark:text-gray-400">Nombres</span>
                    <span className="font-medium text-custom-text dark:text-gray-50">{student.names}</span>
                  </div>
                </div>
                <div className="w-full">
                  <AttendanceToggle
                    isPresent={attendanceStates[student.id]}
                    onChange={() => handleAttendanceToggle(student.id)}
                  />
                </div>
              </div>

              {/* Vista desktop */}
              <div className="hidden md:grid md:grid-cols-4 md:gap-4 md:items-center">
                <div className="text-custom-text dark:text-gray-50">{student.dni}</div>
                <div className="text-custom-text dark:text-gray-50">{student.surnames}</div>
                <div className="text-custom-text dark:text-gray-50">{student.names}</div>
                <div className="flex justify-center">
                  <AttendanceToggle
                    isPresent={attendanceStates[student.id]}
                    onChange={() => handleAttendanceToggle(student.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceList;