import React, { useState } from 'react';
import { useCoursesStore } from '../stores/coursesStore';
import { format } from 'date-fns';
import AttendanceTable from './AttendanceTable';
import { useAuth } from '../hooks/useAuth';
import { getAttendanceByDayAndCourse } from '../services/api';

interface AttendanceRecord {
  names: string;
  surnames: string;
  state: boolean;
}

const AttendanceReview = () => {
  const { courses } = useCoursesStore();
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Obtener el token del estado global
  const token = useAuth?.getState()?.token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourse && selectedDate && token) {
      setLoading(true);
      setError(null);
      try {
        const response = await getAttendanceByDayAndCourse(selectedCourse, selectedDate, token);
        setAttendanceData(response.data);
        setShowResults(true);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al obtener los datos de asistencia');
        setShowResults(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-custom-primary dark:bg-custom-lightblue p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="course" className="block text-custom-text dark:text-gray-50 font-medium mb-2">
              Curso
            </label>
            <select
              id="course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(Number(e.target.value))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-custom-accent focus:border-transparent"
              required
            >
              <option value="">Seleccione un curso</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.level}° "{course.division}" - {course.year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-custom-text dark:text-gray-50 font-medium mb-2">
              Fecha
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-custom-accent focus:border-transparent"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-6 w-full bg-custom-accent dark:bg-custom-darkblue text-white font-medium py-2 px-4 rounded transition-opacity
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && (
        <div className="text-center py-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <p className="text-custom-text dark:text-gray-50">Cargando datos de asistencia...</p>
        </div>
      )}

      {showResults && !loading && selectedCourse && (
        <AttendanceTable 
          courseId={selectedCourse} 
          date={selectedDate}
          attendanceData={attendanceData}
        />
      )}
    </div>
  );
};

export default AttendanceReview;