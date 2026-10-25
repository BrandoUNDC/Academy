import type { Db } from './types'

const past = '2025-01-01T00:00:00.000Z'
const future = '2035-01-01T00:00:00.000Z'
export const seed: Db = {
  users: [
    { id: 'a1', name: 'Valeria Medina', email: 'admin@academia.demo', role: 'admin', active: true },
    { id: 't1', name: 'Lucía Fernández', email: 'lucia@academia.demo', role: 'teacher', active: true },
    { id: 't2', name: 'Diego Torres', email: 'diego@academia.demo', role: 'teacher', active: true },
    { id: 's1', name: 'Camila Rojas', role: 'student', active: true, code: 'ACD-2048', grade: '5°', section: 'A' },
    { id: 's2', name: 'Mateo Vargas', role: 'student', active: true, code: 'ACD-3192', grade: '5°', section: 'A' },
    { id: 's3', name: 'Sofía Quispe', role: 'student', active: true, code: 'ACD-4516', grade: '5°', section: 'B' },
    { id: 's4', name: 'Nicolás Pérez', role: 'student', active: true, code: 'ACD-6824', grade: '6°', section: 'A' },
    { id: 's5', name: 'Daniela Cruz', role: 'student', active: true, code: 'ACD-7350', grade: '6°', section: 'A' },
    { id: 's6', name: 'Gabriel Flores', role: 'student', active: true, code: 'ACD-8901', grade: '6°', section: 'B' },
  ],
  courses: [
    { id: 'c1', title: 'Matemáticas', description: 'Números, patrones y resolución de problemas.', teacherId: 't1', published: true, accent: '01' },
    { id: 'c2', title: 'Comunicación', description: 'Lectura, escritura y expresión de ideas.', teacherId: 't1', published: true, accent: '02' },
    { id: 'c3', title: 'Ciencias naturales', description: 'Exploramos el mundo que nos rodea.', teacherId: 't2', published: true, accent: '03' },
  ],
  modules: [
    { id: 'm1', courseId: 'c1', title: 'Fracciones y decimales', position: 1 },
    { id: 'm2', courseId: 'c1', title: 'Geometría cotidiana', position: 2 },
    { id: 'm3', courseId: 'c2', title: 'Comprensión lectora', position: 1 },
    { id: 'm4', courseId: 'c2', title: 'Escritura creativa', position: 2 },
    { id: 'm5', courseId: 'c3', title: 'Ecosistemas', position: 1 },
  ],
  enrollments: [
    ...['s1','s2','s3','s4','s5','s6'].map((studentId,i)=>({id:`e${i+1}`,courseId:'c1',studentId,date:past})),
    ...['s1','s2','s3','s4'].map((studentId,i)=>({id:`e${i+7}`,courseId:'c2',studentId,date:past})),
    ...['s1','s2','s5','s6'].map((studentId,i)=>({id:`e${i+11}`,courseId:'c3',studentId,date:past})),
  ],
  contents: [
    { id:'r1', moduleId:'m1', title:'Guía de fracciones', type:'pdf', ref:'/demo/fracciones.pdf', position:1 },
    { id:'r2', moduleId:'m1', title:'Fracciones visuales', type:'image', ref:'/demo/fracciones.svg', position:2 },
    { id:'r3', moduleId:'m2', title:'Introducción a la geometría', type:'youtube', ref:'yQ1K-aNUx1o', position:1 },
    { id:'r4', moduleId:'m3', title:'Guía de lectura', type:'pdf', ref:'/demo/lectura.pdf', position:1 },
    { id:'r5', moduleId:'m5', title:'Ecosistemas visuales', type:'image', ref:'/demo/ecosistemas.svg', position:1 },
  ],
  exams: [
    { id:'x1', courseId:'c1', title:'Evaluación de fracciones', minutes:25, openAt:past, closeAt:future, published:true, version:1, questions:[
      {id:'q1',type:'mcq',prompt:'¿Cuál de estas fracciones equivale a 1/2?',points:4,position:1,options:['1/4','2/4','3/4','4/4'],correct:'2/4'},
      {id:'q2',type:'tf',prompt:'La fracción 3/3 representa una unidad completa.',points:3,position:2,options:['Verdadero','Falso'],correct:'Verdadero'},
      {id:'q3',type:'short',prompt:'Explica con tus palabras cómo comparar dos fracciones.',points:5,position:3},
    ]},
    { id:'x2', courseId:'c2', title:'Comprensión de textos', minutes:30, openAt:past, closeAt:future, published:true, version:1, questions:[
      {id:'q4',type:'mcq',prompt:'¿Cuál es la idea principal de un texto?',points:4,position:1,options:['El tema central','Una palabra aislada','El título solamente'],correct:'El tema central'},
      {id:'q5',type:'short',prompt:'Describe una estrategia que usas para comprender lo que lees.',points:6,position:2},
    ]},
  ],
  attempts: [], progress: [], audit: [],
}
