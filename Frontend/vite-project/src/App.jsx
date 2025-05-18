import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import TablaUsuarios from './components/TablaUser';
import TablaPermisos from './components/TablaPermisos';
import TablaServicios from './components/TablaServicios';
import TablaConsultorios from './components/TablaConsultorios';
import TablaDoctores from './components/TablaDoctores';
import TablaCitas from './components/TablaCitas';
import TablaHistoriales from './components/TablaHistoriales';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './pages/HomePage';

// Páginas públicas
import Contactenos from './pages/Contactenos';
import Nosotros from './pages/Nosotros';

// Páginas de paciente
import Perfil from './pages/Perfil';
import AgendarCitas from './pages/AgedarCitas';
import MisCitas from './pages/MisCitas';
import VerMiHistoria from './pages/VerMiHistoria';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/contactenos" element={<Contactenos />} /> 
        <Route path="/nosotros" element={<Nosotros />} /> 

        {/* Páginas para PACIENTE */}
        <Route path="/ver-mi-historia" element={<VerMiHistoria />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/agendar-cita" element={<AgendarCitas />} />
        <Route path="/mis-citas" element={<MisCitas />} />

        {/* Rutas para ADMIN */}
        <Route path="/admin/usuarios" element={
          <PrivateRoute roles={["ADMIN"]}><TablaUsuarios /></PrivateRoute>
        } />
        <Route path="/admin/permisos" element={
          <PrivateRoute roles={["ADMIN"]}><TablaPermisos /></PrivateRoute>
        } />
        <Route path="/admin/servicios" element={
          <PrivateRoute roles={["ADMIN"]}><TablaServicios /></PrivateRoute>
        } />
        <Route path="/admin/citas" element={
          <PrivateRoute roles={["ADMIN"]}><TablaCitas /></PrivateRoute>
        } />
        <Route path="/admin/consultorios" element={
          <PrivateRoute roles={["ADMIN"]}><TablaConsultorios /></PrivateRoute>
        } />
        <Route path="/admin/doctores" element={
          <PrivateRoute roles={["ADMIN"]}><TablaDoctores /></PrivateRoute>
        } />
        <Route path="/admin/historiales" element={
          <PrivateRoute roles={["ADMIN"]}><TablaHistoriales /></PrivateRoute>
        } />

        {/* Rutas para DOCTORA (antes JEFE, también puede acceder un ADMIN) */}
        <Route path="/doctora/usuarios" element={
          <PrivateRoute roles={["DOCTORA", "ADMIN"]}><TablaUsuarios /></PrivateRoute>
        } />
        <Route path="/doctora/permisos" element={
          <PrivateRoute roles={["DOCTORA", "ADMIN"]}><TablaPermisos /></PrivateRoute>
        } />
        <Route path="/doctora/servicios" element={
          <PrivateRoute roles={["DOCTORA", "ADMIN"]}><TablaServicios /></PrivateRoute>
        } />
        <Route path="/doctora/historiales" element={
          <PrivateRoute roles={["DOCTORA", "ADMIN"]}><TablaHistoriales /></PrivateRoute>
        } />
        <Route path="/doctora/consultorios" element={
          <PrivateRoute roles={["DOCTORA", "ADMIN"]}><TablaConsultorios /></PrivateRoute>
        } />
        <Route path="/doctora/doctores" element={
          <PrivateRoute roles={["DOCTORA", "ADMIN"]}><TablaDoctores /></PrivateRoute>
        } />
        <Route path="/doctora/citas" element={
          <PrivateRoute roles={["DOCTORA", "ADMIN"]}><TablaCitas /></PrivateRoute>
        } />

        {/* Rutas para RECEPCIONISTA (también puede acceder un DOCTORA o ADMIN) */}
        <Route path="/recepcionista/usuarios" element={
          <PrivateRoute roles={["RECEPCIONISTA", "DOCTORA", "ADMIN"]}><TablaUsuarios /></PrivateRoute>
        } />
        <Route path="/recepcionista/historiales" element={
          <PrivateRoute roles={["RECEPCIONISTA", "DOCTORA", "ADMIN"]}><TablaHistoriales /></PrivateRoute>
        } />
        <Route path="/recepcionista/consultorios" element={
          <PrivateRoute roles={["RECEPCIONISTA", "DOCTORA", "ADMIN"]}><TablaConsultorios /></PrivateRoute>
        } />

        {/* Ruta de registro */}
        <Route path="/register" element={<Register />} />

        {/* Ruta de login y unauthorized */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<div>No tienes permisos para acceder a esta página.</div>} />
      </Routes>
    </Router>
  );
};

export default App;
