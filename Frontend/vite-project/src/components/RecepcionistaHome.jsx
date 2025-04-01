import React from 'react';
import { Link } from 'react-router-dom';

const RecepcionistaHome = () => {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <Link className="navbar-brand text-dark" to="/recepcionista">
            Panel de Recepción
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
                <Link className="nav-link text-dark" to="/recepcionista/usuarios">
                  Gestión de Usuarios
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/recepcionista/historiales">
                  Gestión de Historiales
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/recepcionista/consultorios">
                  Gestión de Consultorios
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <li className="nav-item">
          <button
            className="btn btn-danger nav-link text-white"
            onClick={() => {
              // Lógica para cerrar sesión
              localStorage.removeItem('authToken'); // Elimina el token de autenticación
              sessionStorage.clear(); // Limpia cualquier dato de sesión
              window.location.href = '/login'; // Redirige al usuario a la página de inicio de sesión
            }}
          >
            Cerrar Sesión
          </button>
        </li>
      </nav>

      {/* Main Content */}
      <div className="container mt-5">
        <div className="text-center">
          <h1 className="display-4 mb-4" style={{ color: '#343a40' }}>
            Bienvenido al Panel de Recepción
          </h1>
          <p className="lead" style={{ color: '#6c757d' }}>
            Selecciona una de las opciones del menú para gestionar el sistema.
          </p>
        </div>
      </div>
    </>
  );
};

export default RecepcionistaHome;