import React from 'react';
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

const App = () => {
  return (
    <Router>
      <Routes>
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

        {/* Rutas para JEFE (también puede acceder un ADMIN) */}
        <Route path="/jefe/usuarios" element={
          <PrivateRoute roles={["JEFE", "ADMIN"]}><TablaUsuarios /></PrivateRoute>
        } />
        <Route path="/jefe/permisos" element={
          <PrivateRoute roles={["JEFE", "ADMIN"]}><TablaPermisos /></PrivateRoute>
        } />
        <Route path="/jefe/servicios" element={
          <PrivateRoute roles={["JEFE", "ADMIN"]}><TablaServicios /></PrivateRoute>
        } />
        <Route path="/jefe/historiales" element={
          <PrivateRoute roles={["JEFE", "ADMIN"]}><TablaHistoriales /></PrivateRoute>
        } />
        <Route path="/jefe/consultorios" element={
          <PrivateRoute roles={["JEFE", "ADMIN"]}><TablaConsultorios /></PrivateRoute>
        } />
        <Route path="/jefe/doctores" element={
          <PrivateRoute roles={["JEFE", "ADMIN"]}><TablaDoctores /></PrivateRoute>
        } />

        {/* Rutas para RECEPCIONISTA (también puede acceder un JEFE o ADMIN) */}
        <Route path="/recepcionista/usuarios" element={
          <PrivateRoute roles={["RECEPCIONISTA", "JEFE", "ADMIN"]}><TablaUsuarios /></PrivateRoute>
        } />
        <Route path="/recepcionista/historiales" element={
          <PrivateRoute roles={["RECEPCIONISTA", "JEFE", "ADMIN"]}><TablaHistoriales /></PrivateRoute>
        } />
        <Route path="/recepcionista/consultorios" element={
          <PrivateRoute roles={["RECEPCIONISTA", "JEFE", "ADMIN"]}><TablaConsultorios /></PrivateRoute>
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
