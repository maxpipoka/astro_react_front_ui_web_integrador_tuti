import React from 'react';
import { format } from 'date-fns';
import { useCoursesStore } from '../stores/coursesStore';
import { FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AttendanceTableProps {
  courseId: number;
  date: string;
  attendanceData: Array<{
    names: string;
    surnames: string;
    state: boolean;
  }>;
}

const AttendanceTable = ({ courseId, date, attendanceData }: AttendanceTableProps) => {
  const { getCourseById } = useCoursesStore();
  const course = getCourseById(courseId);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Título del documento
    doc.setFontSize(16);
    doc.text('Reporte de Asistencia', 14, 20);
    
    // Información del curso
    doc.setFontSize(12);
    doc.text(`Curso: ${course?.level}° "${course?.division}" - ${course?.year}`, 14, 30);
    doc.text(`Fecha: ${format(new Date(date), 'dd/MM/yyyy')}`, 14, 40);
    
    // Tabla de asistencia
    const tableData = attendanceData.map(student => [
      student.surnames,
      student.names,
      student.state ? 'PRESENTE' : 'AUSENTE'
    ]);

    autoTable(doc, {
      head: [['Apellidos', 'Nombres', 'Estado']],
      body: tableData,
      startY: 50,
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [232, 161, 59]
      }
    });

    // Estadísticas
    const totalStudents = attendanceData.length;
    const presentStudents = attendanceData.filter(s => s.state).length;
    const absentStudents = totalStudents - presentStudents;
    const attendancePercentage = (presentStudents / totalStudents * 100).toFixed(2);

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.text('Estadísticas:', 14, finalY);
    doc.text(`Total de alumnos: ${totalStudents}`, 14, finalY + 10);
    doc.text(`Presentes: ${presentStudents}`, 14, finalY + 20);
    doc.text(`Ausentes: ${absentStudents}`, 14, finalY + 30);
    doc.text(`Porcentaje de asistencia: ${attendancePercentage}%`, 14, finalY + 40);

    // Guardar el PDF
    doc.save(`asistencia_${course?.level}_${course?.division}_${date}.pdf`);
  };

  if (!course) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Curso no encontrado</p>
      </div>
    );
  }

  if (attendanceData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-custom-text">No hay registros de asistencia para la fecha seleccionada</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 bg-custom-primary flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-custom-text">
            {course.level}° "{course.division}" - {course.year}
          </h3>
          <p className="text-custom-text mt-2">
            Fecha: {format(new Date(date), 'dd/MM/yyyy')}
          </p>
        </div>
        <button
          onClick={generatePDF}
          className="flex items-center gap-2 bg-custom-accent text-white px-4 py-2 rounded hover:opacity-90 transition-opacity"
        >
          <FaFilePdf />
          Generar PDF
        </button>
      </div>
      
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-custom-text">Apellidos</th>
                <th className="text-left py-3 px-4 text-custom-text">Nombres</th>
                <th className="text-center py-3 px-4 text-custom-text">Estado</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((attendance, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-custom-text">{attendance.surnames}</td>
                  <td className="py-3 px-4 text-custom-text">{attendance.names}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm font-medium
                          ${attendance.state ? 'bg-green-500' : 'bg-red-500'}`}
                      >
                        {attendance.state ? 'PRESENTE' : 'AUSENTE'}
                      </span>
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

export default AttendanceTable;