import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminHome from './components/AdminHome';
import Usuarios from './page/ADMIN/TablaUser';
import Permisos from './page/ADMIN/TablaPermisos';
import Servicios from './page/ADMIN/TablaServicios';
import Historiales from './page/ADMIN/TablaHistoriales';
import Consultorios from './page/ADMIN/TablaConsultorios';
import Doctores from './page/ADMIN/TablaDoctores';
import Citas from './page/ADMIN/TablaCitas';

// Importaciones para las rutas de "Jefe"
import JefeHome from './components/JefeHome';
import JefeUsuarios from './page/JEFE/TablaUser';
import JefePermisos from './page/JEFE/TablaPermisos';
import JefeServicios from './page/JEFE/TablaServicios';
import JefeHistoriales from './page/JEFE/TablaHistoriales';
import JefeConsultorios from './page/JEFE/TablaConsultorios';
import JefeDoctores from './page/JEFE/TablaDoctores';

// Importaciones para las rutas de "Recepcionista"
import RecepcionistaHome from './components/RecepcionistaHome';
import RecepcionistaUsuarios from './page/RECEPCIONISTA/TablaUser';
import RecepcionistaHistoriales from './page/RECEPCIONISTA/TablaHistoriales';
import RecepcionistaConsultorios from './page/RECEPCIONISTA/TablaConsultorios';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas para ADMIN */}
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/usuarios" element={<Usuarios />} />
        <Route path="/admin/permisos" element={<Permisos />} />
        <Route path="/admin/servicios" element={<Servicios />} />
        <Route path="/admin/citas" element={<Citas />} />
        <Route path="/admin/historiales" element={<Historiales />} />
        <Route path="/admin/consultorios" element={<Consultorios />} />
        <Route path="/admin/doctores" element={<Doctores />} />

        {/* Rutas para JEFE */}
        <Route path="/jefe" element={<JefeHome />} />
        <Route path="/jefe/usuarios" element={<JefeUsuarios />} />
        <Route path="/jefe/permisos" element={<JefePermisos />} />
        <Route path="/jefe/servicios" element={<JefeServicios />} />
        <Route path="/jefe/historiales" element={<JefeHistoriales />} />
        <Route path="/jefe/consultorios" element={<JefeConsultorios />} />
        <Route path="/jefe/doctores" element={<JefeDoctores />} />

        {/* Rutas para RECEPCIONISTA */}
        <Route path="/recepcionista" element={<RecepcionistaHome />} />
        <Route path="/recepcionista/usuarios" element={<RecepcionistaUsuarios />} />
        <Route path="/recepcionista/historiales" element={<RecepcionistaHistoriales />} />
        <Route path="/recepcionista/consultorios" element={<RecepcionistaConsultorios />} />

        </Routes>
      </Router>
  );
};

export default App;
