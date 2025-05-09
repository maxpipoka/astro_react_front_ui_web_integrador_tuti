import axios from 'axios';

const API_URL = 'https://flask-api-rest-integrador-tuti.vercel.app/';
// const API_URL = 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth services
export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/auth', { username, password });
    return response;
  } catch (error) {
    throw error;
  }
};

// Student services
export const getStudents = async (token: string) => {
  try {
    const response = await api.get('/alumnos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllStudents = async (token: string) => {
  try {
    const response = await api.get('/alumnos/todos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export const getStudentReport = async (studentId: number, startDate: string, endDate: string, token: string) => {
  try {
    const response = await api.get(`/asistencias/alumno/${studentId}?start=${startDate}&end=${endDate}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export const getStudentById = async (studentId: number, token: string) => {
  try {
    const response = await api.get(`/alumnos/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export const saveStudent = async (student: any, token: string) => {
  try {
    const response = await api.post(`/alumnos`, student, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }

  // const config = {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`,
  //     'Access-Control-Allow-Origin': '*'
  //   }
  // };
  // return await axios.post(`/alumnos/`, student, config);
};

export const updateStudent = async (studentId: number, data: Record<string, any>, token: string) => {
  try {
    const response = await api.patch(`/alumnos/${studentId}`, 
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteStudent = async (studentId: number, token: string) => {
  try {
    const response = await api.delete(`/alumnos/${studentId}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

// Tutors Services
export const getAllTutors = async (token: string) => {
  try {
    const response = await api.get('/tutores', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getTutorById = async (tutorId: number, token: string) => {
  try {
    const response = await api.get(`/tutores/${tutorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Response Data GetTutorById: ', response.data)
    return response;
  } catch (error) {
    throw error;
  }
}

export const saveTutor = async (tutor: any, token: string) => {
try {
  const response = await api.post(`/tutores`,
  tutor,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
} catch (error) {
  throw error;
}
};

export const updateTutor = async (tutorId: number, data: Record<string, any>, token: string) => {
  try {
    const response = await api.patch(`/tutores/${tutorId}`, 
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteTutor = async (tutorId: number, token: string) => {
  try {
    const response = await api.delete(`/tutores/${tutorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

// Course services
export const getCoursesByPreceptor = async (preceptorId: number, token: string) => {
  try {
    const response = await api.get(`/cursos/preceptor/${preceptorId}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export const getAllCourses = async (token: string) => {
  try {
    const response = await api.get('/cursos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Attendance services
export const closeAttendance = async (courseId: number, token: string) => {
  try {
    const response = await api.post(`/asistencia/cerrar/${courseId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export const getAttendanceByDayAndCourse = async (courseId: number, date: string, token: string) => {
  try {
    const response = await api.post(
      '/asistencias/revision/',
      {
        course_id: courseId,
        date_to_search: date
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
}

// User Services
export const getUserDataById = async (token: string, userId: number) => {
  try {
    const response = await api.get(`/usuarios/${userId}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response
    } catch (error) {
      throw error;
    }
  }

export const updateUserData = async (token: string, userId: number, field: string, data: string) => {
  try {
    const response = await api.patch(`/usuarios/${userId}`, 
      {[field]: data},
      {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    return response
  } catch (error){
    throw error;
  }
}

export const getAllUsers= async (token: string) => {
  try {
    const response = await api.get(`/usuarios`,
      {
        headers: {
          Authorization:`Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
     )
     return response
  } catch (error){
    throw error;
  }
}

export const mockData = {
  // ... rest of the mock data
};