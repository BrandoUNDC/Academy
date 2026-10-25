import { Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useState, type ReactNode } from 'react'
import { BookOpen, ChartNoAxesCombined, ChevronDown, ClipboardList, GraduationCap, LayoutDashboard, LogOut, Menu, Settings, ShieldCheck, Users, Wifi, WifiOff } from 'lucide-react'
import { useAcademy, roleHome } from './store'
import type { Role } from './types'
import { Button } from './components/ui'
import { Login } from './pages/Login'
import { AdminHome, AdminPeople, Audit } from './pages/Admin'
import { TeacherHome, CourseDetail, Courses, Exams, ExamEditor, TeacherResults, TeacherProgress } from './pages/Teacher'
import { StudentHome, StudentCourses, StudentCourse, MaterialViewer, StudentExams, ExamRunner, StudentProgress, StudentSettings } from './pages/Student'

const menus = {
  admin: [{to:'/admin/inicio',label:'Resumen',icon:LayoutDashboard},{to:'/admin/alumnos',label:'Estudiantes',icon:GraduationCap},{to:'/admin/docentes',label:'Docentes',icon:Users},{to:'/admin/usuarios',label:'Usuarios',icon:ShieldCheck},{to:'/admin/auditoria',label:'Auditoría',icon:ClipboardList}],
  teacher: [{to:'/docente/inicio',label:'Resumen',icon:LayoutDashboard},{to:'/docente/cursos',label:'Mis cursos',icon:BookOpen},{to:'/docente/examenes',label:'Evaluaciones',icon:ClipboardList},{to:'/docente/resultados',label:'Resultados',icon:ChartNoAxesCombined},{to:'/docente/progreso',label:'Progreso',icon:GraduationCap}],
  student: [{to:'/alumno/inicio',label:'Inicio',icon:LayoutDashboard},{to:'/alumno/cursos',label:'Mis cursos',icon:BookOpen},{to:'/alumno/examenes',label:'Evaluaciones',icon:ClipboardList},{to:'/alumno/progreso',label:'Mi progreso',icon:ChartNoAxesCombined},{to:'/alumno/ajustes',label:'Ajustes',icon:Settings}],
}
function Protected({ role, children }: {role:Role;children:ReactNode}) { const {user,ready}=useAcademy(); if(!ready) return <div className="boot">Cargando academia…</div>; if(!user) return <Navigate to={role==='student'?'/alumno/ingresar':'/login'} replace/>; if(user.role!==role) return <Navigate to={roleHome(user.role)} replace/>; return <>{children}</> }
function Shell({role}:{role:Role}) {
  const {user,online,offline,setOffline,logout,db,update}=useAcademy()
  const [open,setOpen]=useState(false)
  const navigate=useNavigate(); const location=useLocation()
  const current=menus[role].find(item=>location.pathname.startsWith(item.to))?.label ?? 'Academia'
  const pending=db.attempts.filter(a=>a.sync==='pending' && a.status!=='in_progress').length
  const signout=()=>{if(pending && !confirm(`Hay ${pending} entrega(s) pendientes en este dispositivo. ¿Cerrar sesión?`))return; logout();navigate(role==='student'?'/alumno/ingresar':'/login')}
  const process=()=>{if(!online)return; update(d=>({...d,attempts:d.attempts.map(a=>a.sync==='pending'?{...a,sync:'done'}:a)}),'Procesar cola demo','outbox','local')}
  return <div className={`app-shell ${role==='student'?'student-shell':''}`}>
    <aside className={`sidebar ${open?'sidebar-open':''}`}>
      <div className="brand"><div className="brand-mark"><span>A</span></div><div><strong>ACADEMIA<span className="brand-dot">.</span></strong><small>EDUCATION OS</small></div></div>
      <div className="sidebar-label">ESPACIO DE {role==='admin'?'ADMINISTRACIÓN':role==='teacher'?'DOCENTE':'ESTUDIANTE'}</div>
      <nav className="nav-list" aria-label="Navegación principal">{menus[role].map(({to,label,icon:Icon})=><NavLink key={to} to={to} onClick={()=>setOpen(false)} className={({isActive})=>`nav-item ${isActive?'active':''}`}><Icon size={19} strokeWidth={1.8}/><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="demo-note"><span className="note-line"/> ENTORNO DE DEMOSTRACIÓN <p>Datos guardados en este navegador.</p></div><button className="profile" onClick={signout} title="Cerrar sesión"><span className="avatar">{user?.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</span><span className="profile-text"><strong>{user?.name}</strong><small>{role==='admin'?'Administrador':role==='teacher'?'Docente':'Estudiante'}</small></span><LogOut size={17}/></button></div>
    </aside>
    {open&&<button className="mobile-overlay" aria-label="Cerrar menú" onClick={()=>setOpen(false)}/>}
    <div className="main-area"><header className="topbar"><div className="top-left"><button className="mobile-menu icon-button" aria-label="Abrir menú" onClick={()=>setOpen(true)}><Menu size={22}/></button><span className="breadcrumb">Academia <span>/</span> {current}</span></div><div className="top-right"><button className={`connectivity ${online?'':'is-offline'}`} onClick={()=>setOffline(!offline)} title="Alternar simulación de conexión">{online?<Wifi size={16}/>:<WifiOff size={16}/>}<span>{online?'En línea':'Sin conexión'}</span><ChevronDown size={13}/></button>{pending>0&&<Button size="sm" variant="outline" onClick={process} disabled={!online}>{pending} pendiente{pending!==1?'s':''} · Procesar demo</Button>}<span className="top-divider"/><span className="top-avatar">{user?.name[0]}</span></div></header><main className="content"><Outlet/></main></div>
  </div>
}
function HomeRedirect(){const {user,ready}=useAcademy(); if(!ready)return <div className="boot">Cargando academia…</div>;return <Navigate to={user?roleHome(user.role):'/login'} replace/>}
export default function App(){return <Routes>
  <Route path="/" element={<HomeRedirect/>}/><Route path="/login" element={<Login role="staff"/>}/><Route path="/alumno/ingresar" element={<Login role="student"/>}/><Route path="/alumno/qr" element={<Login role="student" qr/>}/>
  <Route path="/admin" element={<Protected role="admin"><Shell role="admin"/></Protected>}><Route path="inicio" element={<AdminHome/>}/><Route path="alumnos" element={<AdminPeople kind="student"/>}/><Route path="docentes" element={<AdminPeople kind="teacher"/>}/><Route path="usuarios" element={<AdminPeople kind="all"/>}/><Route path="auditoria" element={<Audit/>}/></Route>
  <Route path="/docente" element={<Protected role="teacher"><Shell role="teacher"/></Protected>}><Route path="inicio" element={<TeacherHome/>}/><Route path="cursos" element={<Courses/>}/><Route path="cursos/:id" element={<CourseDetail/>}/><Route path="examenes" element={<Exams/>}/><Route path="examenes/nuevo" element={<ExamEditor/>}/><Route path="examenes/:id/editar" element={<ExamEditor/>}/><Route path="resultados" element={<TeacherResults/>}/><Route path="progreso" element={<TeacherProgress/>}/></Route>
  <Route path="/alumno" element={<Protected role="student"><Shell role="student"/></Protected>}><Route path="inicio" element={<StudentHome/>}/><Route path="cursos" element={<StudentCourses/>}/><Route path="cursos/:id" element={<StudentCourse/>}/><Route path="material/:id" element={<MaterialViewer/>}/><Route path="examenes" element={<StudentExams/>}/><Route path="examenes/:id/rendir" element={<ExamRunner/>}/><Route path="progreso" element={<StudentProgress/>}/><Route path="ajustes" element={<StudentSettings/>}/></Route>
  <Route path="*" element={<HomeRedirect/>}/>
</Routes>}
