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

  console.log(course)

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
    <div className="bg-white dark:bg-custom-darkblue rounded-lg shadow-md overflow-hidden ">
      <div className="p-6 bg-custom-primary dark:bg-custom-lightblue">
        <h3 className="text-xl font-bold text-custom-text dark:text-gray-50">
          {course.level}° "{course.division}" - {course.year}
        </h3>
        <p className="text-custom-text dark:text-gray-50 mt-2">
          Fecha: {format(new Date(), 'dd/MM/yyyy')}
        </p>
      </div>
      
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-custom-text dark:text-green-50">DNI</th>
                <th className="text-left py-3 px-4 text-custom-text dark:text-green-50">Apellidos</th>
                <th className="text-left py-3 px-4 text-custom-text dark:text-green-50">Nombres</th>
                <th className="text-center py-3 px-4 text-custom-text dark:text-green-50">Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {course.students.map(student => (
                <tr key={student.id} className="border-b hover:bg-custom-lightblue">
                  <td className="py-3 px-4 text-custom-text dark:text-green-50">{student.dni}</td>
                  <td className="py-3 px-4 text-custom-text dark:text-green-50">{student.surnames}</td>
                  <td className="py-3 px-4 text-custom-text dark:text-green-50">{student.names}</td>
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