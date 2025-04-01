import React from 'react';
import { Link } from 'react-router-dom';

const AdminHome = () => {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#f8f9fa', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/admin" style={{ color: '#343a40' }}>
            Panel de Administración
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="btn btn-outline-primary mx-1" to="/admin/usuarios" style={{ transition: 'all 0.3s ease' }}>
                  Usuarios
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-primary mx-1" to="/admin/permisos" style={{ transition: 'all 0.3s ease' }}>
                  Permisos
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-primary mx-1" to="/admin/servicios" style={{ transition: 'all 0.3s ease' }}>
                  Servicios
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-primary mx-1" to="/admin/citas" style={{ transition: 'all 0.3s ease' }}>
                  Citas
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-primary mx-1" to="/admin/historiales" style={{ transition: 'all 0.3s ease' }}>
                  Historiales
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-primary mx-1" to="/admin/consultorios" style={{ transition: 'all 0.3s ease' }}>
                  Consultorios
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-primary mx-1" to="/admin/doctores" style={{ transition: 'all 0.3s ease' }}>
                  Doctores
                </Link>
              </li>
            </ul>
          </div>
          <button
            className="btn btn-danger ms-3"
            style={{
              transition: 'all 0.3s ease',
              color: 'white',
              fontWeight: 'bold',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#c82333')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#dc3545')}
            onClick={() => {
              // Lógica para cerrar sesión
              localStorage.removeItem('authToken'); // Va a eliminar el token de autenticación
              sessionStorage.clear(); // Limpia cualquier dato de sesión
              window.location.href = '/login'; // Redirige al usuario a la página de inicio de sesión
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-5">
        <div className="text-center">
          <h1 className="display-4 mb-4" style={{ color: '#343a40' }}>
            Bienvenido al Panel de Administración
          </h1>
          <p className="lead" style={{ color: '#6c757d' }}>
            Selecciona una de las opciones del menú para gestionar el sistema.
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminHome;